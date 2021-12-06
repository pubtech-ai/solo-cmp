import {TCModel, TCString} from '@iabtcf/core';
import {CookieService} from './CookieService';
import {LoggerService} from './LoggerService';
import {CmpSupportedLanguageProvider} from './CmpSupportedLanguageProvider';

/**
 * TCStringService.
 */
export class TCStringService {

    private cookieService: CookieService;
    private loggerService: LoggerService;
    private readonly cmpVersion: number;
    private readonly cmpVendorListVersion: number;
    private readonly cmpSupportedLanguageProvider: CmpSupportedLanguageProvider;
    private readonly tcStringCookieName: string;
    private readonly isLegitimateInterestDisabled: boolean;

    /**
     * Constructor.
     *
     * @param {CookieService} cookieService
     * @param {LoggerService} loggerService
     * @param {CmpSupportedLanguageProvider} cmpSupportedLanguageProvider
     * @param {number} cmpVersion
     * @param {number} cmpVendorListVersion
     * @param {string} tcStringCookieName
     * @param {boolean} isLegitimateInterestDisabled
     */
    constructor(
        cookieService: CookieService,
        loggerService: LoggerService,
        cmpSupportedLanguageProvider: CmpSupportedLanguageProvider,
        cmpVersion: number,
        cmpVendorListVersion: number,
        tcStringCookieName: string,
        isLegitimateInterestDisabled: boolean,
    ) {

        if (Number.isNaN(cmpVersion)) {

            throw new Error('TCStringService, cmpVersion parameter must be a valid number.');

        }

        if (Number.isNaN(cmpVendorListVersion)) {

            throw new Error('TCStringService, cmpVendorListVersion parameter must be a valid number.');

        }

        if (tcStringCookieName.length === 0) {

            throw new Error(
                'TCStringService, tcStringCookieName parameter must be a string with a length greater than zero.',
            );

        }

        this.cookieService = cookieService;
        this.loggerService = loggerService;
        this.cmpSupportedLanguageProvider = cmpSupportedLanguageProvider;
        this.cmpVersion = cmpVersion;
        this.cmpVendorListVersion = cmpVendorListVersion;
        this.tcStringCookieName = tcStringCookieName;
        this.isLegitimateInterestDisabled = isLegitimateInterestDisabled;

    }

    /**
     * Save the encoded TCString.
     *
     * @param {string} tcString
     * @param {number} expireInDays
     */
    public persistTCString(tcString: string, expireInDays = 365): void {

        this.cookieService.setCookie(this.tcStringCookieName, tcString, expireInDays);

    }

    /**
     * Fetch the encoded TCString.
     *
     * @return {string}
     */
    public retrieveTCString(): string {

        return this.cookieService.getCookie(this.tcStringCookieName);

    }

    /**
     * Remove the TCString.
     */
    public removeTCString(): void {

        this.cookieService.removeCookiesByName(this.tcStringCookieName);

    }

    /**
     * Build the TCString from the TCModel provided.
     *
     * @param {TCModel} tcModel
     *
     * @return {string}
     */
    public buildTCString(tcModel: TCModel): string {

        let tcString = '';

        try {

            tcString = TCString.encode(tcModel);

        } catch (e) {

            this.loggerService.error(e);

        }

        if (tcString.length > 0) {

            this.loggerService.debug('TCString built: ' + tcString);

        }

        return tcString;

    }

    /**
     * Build the TCString with all vendors enabled.
     *
     * @param {TCModel} tcModel
     *
     * @return {string}
     */
    public buildTCStringAllEnabled(tcModel: TCModel): string {

        tcModel.setAll();

        // REQUIRED UNTIL SOLVED https://github.com/InteractiveAdvertisingBureau/iabtcf-es/issues/179
        tcModel.publisherConsents.set([...tcModel.purposeConsents.values()]);

        if (this.isLegitimateInterestDisabled) {

            tcModel.unsetAllPurposeLegitimateInterests();
            tcModel.unsetAllVendorLegitimateInterests();

        } else {

            const purposeLegitimateInterests = [...tcModel.purposeLegitimateInterests.values()].filter(
                (purposeId) => purposeId !== 1,
            );
            tcModel.publisherLegitimateInterests.set(purposeLegitimateInterests);

        }

        return TCString.encode(tcModel);

    }

    /**
     * Check if the tcString provided is valid.
     * If the CMP version is changed it return false.
     * If the vendorListVersion is changed it return false.
     * If the language of the user is changed it return false.
     *
     * @param {string} tcString
     *
     * @return {boolean}
     */
    public isValidTCString(tcString: string): boolean {

        let tcModel: TCModel;

        try {

            tcModel = TCString.decode(tcString);

        } catch (e) {

            this.loggerService.debug(`Checking if TCString is valid: the tcstring is not decodable.`);

            return false;

        }

        const cmpVersionCheck: boolean = tcModel.cmpVersion === this.cmpVersion;
        const cmpVendorListVersionCheck: boolean = tcModel.vendorListVersion === this.cmpVendorListVersion;

        const userLanguage: string = this.cmpSupportedLanguageProvider.getUserLanguage();

        let localeCheck = true;

        if (this.cmpSupportedLanguageProvider.getCmpSupportedLanguages().includes(userLanguage)) {

            localeCheck = userLanguage === tcModel.consentLanguage.toLowerCase();

        }

        this.loggerService.debug(
            `Checking if TCString is valid: localeCheck: ${localeCheck} | cmpVersionCheck: ${cmpVersionCheck} | cmpVendorListVersionCheck ${cmpVendorListVersionCheck}`,
        );

        return localeCheck && cmpVersionCheck && cmpVendorListVersionCheck;

    }

    static getClassName(): string {

        return 'TCStringService';

    }

}

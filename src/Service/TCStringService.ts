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
    private readonly expireTCStringInDays: number;
    private readonly purposeIdsForPartialCheck: number[];
    private readonly expirationDaysForPartialConsents: number | null;

    /**
     * Constructor.
     *
     * @param {CookieService} cookieService
     * @param {LoggerService} loggerService
     * @param {CmpSupportedLanguageProvider} cmpSupportedLanguageProvider
     * @param {number} cmpVersion
     * @param {number} cmpVendorListVersion
     * @param {string} tcStringCookieName
     * @param {number} expireTCStringInDays
     * @param {number[]} purposeIdsForPartialCheck
     * @param {number|null} expirationDaysForPartialConsents
     */
    constructor(
        cookieService: CookieService,
        loggerService: LoggerService,
        cmpSupportedLanguageProvider: CmpSupportedLanguageProvider,
        cmpVersion: number,
        cmpVendorListVersion: number,
        tcStringCookieName: string,
        expireTCStringInDays = 180,
        purposeIdsForPartialCheck: number[] = [],
        expirationDaysForPartialConsents: number | null = null,
    ) {

        if (isNaN(cmpVersion) || typeof cmpVersion == 'object') {

            throw new Error('TCStringService.cmpVersion must be a number.');

        }

        if (isNaN(cmpVendorListVersion) || typeof cmpVersion == 'object') {

            throw new Error('TCStringService.cmpVendorListVersion must be a number.');

        }

        if (tcStringCookieName.length === 0) {

            throw new Error('TCStringService.tcStringCookieName must be a not empty string.');

        }

        this.cookieService = cookieService;
        this.loggerService = loggerService;
        this.cmpSupportedLanguageProvider = cmpSupportedLanguageProvider;
        this.cmpVersion = Number(cmpVersion);
        this.cmpVendorListVersion = Number(cmpVendorListVersion);
        this.tcStringCookieName = tcStringCookieName;
        this.expireTCStringInDays = Number(expireTCStringInDays);
        this.purposeIdsForPartialCheck = purposeIdsForPartialCheck;
        this.expirationDaysForPartialConsents = expirationDaysForPartialConsents;

    }

    /**
     * Save the encoded TCString.
     *
     * @param {string} tcString
     */
    public persistTCString(tcString: string): void {

        this.cookieService.setCookie(this.tcStringCookieName, tcString, this.expireTCStringInDays);

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

            this.loggerService.debug('TCString.buildTCString: ' + tcString);

        }

        return tcString;

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

            this.loggerService.debug(`TCStringService.isValidTCString: not decodable.`);

            return false;

        }

        const isPartialConsent = this.purposeIdsForPartialCheck.filter((purposeId) => {

            return !tcModel.purposeConsents.has(Number(purposeId));

        }).length != 0;

        let isExpirationValid = true;

        if (this.expirationDaysForPartialConsents != null && !isNaN(this.expirationDaysForPartialConsents)) {

            if (isPartialConsent && tcModel.created instanceof Date) {

                const tcStringDate = new Date(tcModel.created.getTime());
                tcStringDate.setDate(tcStringDate.getDate() + Number(this.expirationDaysForPartialConsents));
                isExpirationValid = tcStringDate.getTime() >= new Date().getTime();

            }

        }

        const cmpVendorListVersionCheck = isPartialConsent || this.purposeIdsForPartialCheck.length == 0 ?
            tcModel.vendorListVersion === this.cmpVendorListVersion : true;

        const userLanguage: string = this.cmpSupportedLanguageProvider.getUserLanguage();

        let localeCheck = true;

        const cmpVersionCheck: boolean = tcModel.cmpVersion === this.cmpVersion;

        if (this.cmpSupportedLanguageProvider.getCmpSupportedLanguages().includes(userLanguage)) {

            localeCheck = userLanguage === tcModel.consentLanguage.toLowerCase();

        }

        this.loggerService.debug(
            `TCStringService.isValidTCString: 
            locale: ${localeCheck} | 
            cmpVersion: ${cmpVersionCheck} | 
            cmpVendorListVersion: ${cmpVendorListVersionCheck} |
            isExpirationValid: ${isExpirationValid}`,
        );

        return localeCheck && cmpVersionCheck && cmpVendorListVersionCheck && isExpirationValid;

    }

    static getClassName(): string {

        return 'TCStringService';

    }

}

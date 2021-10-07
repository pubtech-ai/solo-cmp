import {ACModel, GoogleVendorOption} from '../Entity';
import {LoggerService} from './LoggerService';

/**
 * ACStringService.
 */
export class ACStringService {

    private static readonly acStringIdSeparator = '~';

    private readonly acStringVersion: number;
    private readonly acStringLocalStorageKey: string;
    private loggerService: LoggerService;
    private localStorage: Storage;
    private readonly skipACStringCheck: boolean;

    /**
     * Constructor.
     *
     * @param {string} acStringVersion
     * @param {string} acStringLocalStorageKey
     * @param {LoggerService} loggerService
     * @param {Storage} localStorage
     * @param {Boolean} skipACStringCheck
     */
    constructor(
        acStringVersion: number,
        acStringLocalStorageKey: string,
        loggerService: LoggerService,
        localStorage: Storage,
        skipACStringCheck: boolean,
    ) {

        if (Number.isNaN(acStringVersion)) {

            throw new Error('ACStringService, cmpVersion parameter must be a valid number.');

        }

        if (acStringLocalStorageKey.length === 0) {

            throw new Error(
                'ACStringService, acStringLocalStorageKey must be a string with a length greater than zero.',
            );

        }

        this.acStringVersion = acStringVersion;
        this.acStringLocalStorageKey = acStringLocalStorageKey;
        this.loggerService = loggerService;
        this.localStorage = localStorage;
        this.skipACStringCheck = skipACStringCheck;

    }

    /**
     * Build the ACString from the ACModel provided.
     *
     * @param {ACModel} acModel
     *
     * @return {string}
     */
    public buildACString(acModel: ACModel): string {

        const acceptedGoogleVendors: GoogleVendorOption[] = acModel.googleVendorOptions.filter(
            (googleVendorOption: GoogleVendorOption) => googleVendorOption.state,
        );

        const acceptedGoogleVendorsIds: number[] = acceptedGoogleVendors.map((gvo) => gvo.id);

        const builtACString = this.buildACStringString(acceptedGoogleVendorsIds);

        this.loggerService.debug('ACString built: ' + builtACString);

        return builtACString;

    }

    /**
     * Build the ACString with all vendors enabled.
     *
     * @param {ACModel} acModel
     *
     * @return {string}
     */
    public buildACStringAllEnabled(acModel: ACModel): string {

        const allGoogleVendors = acModel.googleVendorOptions.map((vendor: any) => vendor.id);

        const builtACString = this.buildACStringString(allGoogleVendors);

        this.loggerService.debug('ACString all enabled built: ' + builtACString);

        return builtACString;

    }

    /**
     * Return the ACString string with proper schema.
     *
     * @param {number[]} enabledGoogleVendorIds
     * @private
     *
     * @return {string}
     */
    private buildACStringString(enabledGoogleVendorIds: number[]): string {

        return `${this.acStringVersion + ACStringService.acStringIdSeparator + enabledGoogleVendorIds.join('.')}`;

    }

    /**
     * Parse the ACString to retrieve the array
     * with ids of vendors.
     *
     * @param {string|null} acString
     *
     * @return {string[]}
     */
    public getVendorIdsByACString(acString: string | null): string[] {

        if (typeof acString == 'string' && acString.length > 0) {

            const cleanString = acString.split(ACStringService.acStringIdSeparator).pop();

            if (cleanString) {

                return cleanString.split('.');

            }

        }

        return [''];

    }

    /**
     * Save the ACString provided inside local storage.
     *
     * @param {string} acString
     */
    public persistACString(acString: string): void {

        try {

            this.localStorage.setItem(this.acStringLocalStorageKey, acString);

        } catch (error) {

            this.loggerService.debug('Can\'t persist ACString to localStorage.', error);

        }

    }

    /**
     * Retrieve the ACString persisted inside store.
     *
     * @return {string}
     */
    public retrieveACString(): string {

        try {

            return this.localStorage.getItem(this.acStringLocalStorageKey) ?? '';

        } catch (error) {

            this.loggerService.debug('Can\'t retrieve ACString from localStorage.', error);
            return `${this.acStringVersion + ACStringService.acStringIdSeparator}`;

        }

    }

    /**
     * Remove the ACString.
     */
    public removeACString(): void {

        try {

            this.localStorage.removeItem(this.acStringLocalStorageKey);

        } catch (error) {

            this.loggerService.debug('Can\'t delete ACString from localStorage.', error);

        }

    }

    /**
     * Check the if ACString provided is valid.
     *
     * @param {string|null} acString
     *
     * @return {boolean}
     */
    public isValidACString(acString: string | null): boolean {

        if (this.skipACStringCheck) {

            this.loggerService.debug('Skip ACString validation check');
            return true;

        }

        this.loggerService.debug('Checking if ACString is valid: ' + acString);

        if (typeof acString != 'string') {

            return false;

        }

        const cmpVersionStringLength: number = String(this.acStringVersion).length;

        return (
            acString == `${this.acStringVersion + ACStringService.acStringIdSeparator}` ||
            (acString.includes(`${this.acStringVersion + ACStringService.acStringIdSeparator}`) &&
                acString.length > cmpVersionStringLength + 1)
        );

    }

    static getClassName(): string {

        return 'ACStringService';

    }

}

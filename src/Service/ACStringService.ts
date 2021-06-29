import ACModel from '../Entity/ACModel';
import GoogleVendorOption from '../Entity/GoogleVendorOption';
import LoggerService from './LoggerService';

/**
 * ACStringService.
 */
class ACStringService {

    private static readonly acStringIdSeparator = '~';

    private readonly cmpVersion: number;
    private readonly acStringLocalStorageKey: string;
    private loggerService: LoggerService;
    private localStorage: Storage;

    /**
     * Constructor.
     *
     * @param {string} cmpVersion
     * @param {string} acStringLocalStorageKey
     * @param {LoggerService} loggerService
     * @param {Storage} localStorage
     */
    constructor(
        cmpVersion: number,
        acStringLocalStorageKey: string,
        loggerService: LoggerService,
        localStorage: Storage,
    ) {

        if (Number.isNaN(cmpVersion)) {

            throw new Error('ACStringService, cmpVersion parameter must be a valid number.');

        }

        if (acStringLocalStorageKey.length === 0) {

            throw new Error(
                'ACStringService, acStringLocalStorageKey must be a string with a length greater than zero.',
            );

        }

        this.cmpVersion = cmpVersion;
        this.acStringLocalStorageKey = acStringLocalStorageKey;
        this.loggerService = loggerService;
        this.localStorage = localStorage;

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

        return `${this.cmpVersion + ACStringService.acStringIdSeparator + enabledGoogleVendorIds.join('.')}`;

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

        if (acString) {

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

            this.loggerService.error('Can\'t persist ACString to localStorage.', error);

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

            this.loggerService.error('Can\'t retrieve ACString from localStorage.', error);
            return `${this.cmpVersion + ACStringService.acStringIdSeparator}`;

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

        this.loggerService.debug('Checking if ACString is valid: ' + acString);

        if (acString === null) {

            return false;

        }

        const cmpVersionStringLength: number = String(this.cmpVersion).length;

        return (
            acString === `${this.cmpVersion + ACStringService.acStringIdSeparator}` ||
            (acString.includes(`${this.cmpVersion + ACStringService.acStringIdSeparator}`) &&
                acString.length > cmpVersionStringLength + 1)
        );

    }

}

export default ACStringService;

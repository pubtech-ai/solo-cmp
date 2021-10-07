import {HttpRequestService} from './HttpRequestService';
import {ACModel, GoogleVendorOption} from '../Entity';
import {ACStringService} from './ACStringService';
import {LoggerService} from './LoggerService';

/**
 * ACModelService.
 */
export class ACModelService {

    private static readonly googleVendorListFileName = 'google-vendor-list.json';

    private googleVendorList: any[] = [];
    private readonly acStringService: ACStringService;
    private readonly baseUrlVendorList: string;
    private googleVendorOptions: GoogleVendorOption[] = [];
    private httpRequestService: HttpRequestService;
    private loggerService: LoggerService;
    private acString: string;

    /**
     * Constructor.
     *
     * @param {string} baseUrlVendorList
     * @param {ACStringService} acStringService
     * @param {HttpRequestService} httpRequestService
     * @param {LoggerService} loggerService
     */
    constructor(
        baseUrlVendorList: string,
        acStringService: ACStringService,
        httpRequestService: HttpRequestService,
        loggerService: LoggerService,
    ) {

        this.acStringService = acStringService;

        if (baseUrlVendorList.length === 0) {

            throw new Error('ACModelService, baseUrlVendorList must be a string with a length greater than zero.');

        }

        this.baseUrlVendorList = baseUrlVendorList;
        this.httpRequestService = httpRequestService;
        this.loggerService = loggerService;

    }

    /**
     * This method fetch google vendor list and return the ACModel.
     *
     * @param {string} acString
     * @return {Promise<ACModel>}
     */
    public async fetchDataAndBuildACModel(acString: string): Promise<ACModel> {

        this.googleVendorOptions = [];
        this.acString = acString;

        const url = `${this.baseUrlVendorList}/${ACModelService.googleVendorListFileName}`;

        return await this.httpRequestService
            .makeRequest('GET', url)
            .then((xhr) => {

                this.googleVendorList = JSON.parse(xhr.responseText);

                let acModel: ACModel = new ACModel([]);

                try {

                    acModel = this.buildACModel(this.googleVendorList);

                } catch (error) {

                    this.loggerService.error(
                        'ACModelService, check if all the elements of the json respect the google vendor scheme used.',
                        error,
                    );

                }

                return acModel;

            })
            .catch((error) => {

                this.loggerService.debug(
                    'ACModelService, fetchAndBuildACModel unable to build the ACModel, fallback to empty ACModel.',
                    error,
                );
                return new ACModel([]);

            });

    }

    /**
     * Build the ACModel from googleVendorList provided and acString
     * to restore state if is valid.
     *
     * @param {object[]} googleVendorList
     *
     * @return {ACModel}
     */
    private buildACModel(googleVendorList: Record<string, unknown>[]): ACModel {

        if (this.acStringService.isValidACString(this.acString)) {

            const vendorIdsEnabled = this.acStringService.getVendorIdsByACString(this.acString);
            this.googleVendorList.forEach((googleVendor: any) => {

                const state = vendorIdsEnabled.includes(String(googleVendor.provider_id));
                this.addGoogleVendorOptionToList(googleVendor, state);

            });

        } else {

            this.googleVendorList.forEach((googleVendor: any) => {

                this.addGoogleVendorOptionToList(googleVendor, false);

            });

        }

        return new ACModel(this.googleVendorOptions);

    }

    /**
     * Add a GoogleVendorOption to list.
     *
     * @param {object} googleVendorListElement
     * @param {boolean} state
     * @private
     */
    private addGoogleVendorOptionToList(googleVendorListElement: any, state: boolean): void {

        if (typeof googleVendorListElement.provider_id !== 'number' && isNaN(googleVendorListElement.provider_id)) {

            throw new Error('Google Vendor Schema, provider_id must be a valid number.');

        }

        if (typeof googleVendorListElement.provider_name !== 'string') {

            throw new Error('Google Vendor Schema, provider_name must be a string.');

        }

        if (typeof googleVendorListElement.policy_url !== 'string') {

            throw new Error('Google Vendor Schema, policy_url must be a string.');

        }

        if (typeof googleVendorListElement.domains !== 'string') {

            throw new Error('Google Vendor Schema, domains must be a string.');

        }

        const googleVendorOption: GoogleVendorOption = {
            id: Number(googleVendorListElement.provider_id),
            name: googleVendorListElement.provider_name,
            state: state,
            policyUrl: googleVendorListElement.policy_url,
            domains: googleVendorListElement.domains,
        };

        this.googleVendorOptions.push(googleVendorOption);

    }

    /**
     * Retrieve the Google vendor list.
     *
     * @return {object[]}
     */
    public getGoogleVendorList(): any {

        return this.googleVendorList;

    }

    static getClassName(): string {

        return 'ACModelService';

    }

}

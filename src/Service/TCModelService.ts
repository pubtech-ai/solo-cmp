import {TCModel, TCString} from '@iabtcf/core';
import {TCStringService} from './TCStringService';
import {CmpSupportedLanguageProvider} from './CmpSupportedLanguageProvider';

/**
 * TCModelService.
 */
export class TCModelService {

    private readonly cmpId: number;
    private readonly cmpVersion: number;
    private readonly isServiceSpecific: boolean;
    private readonly globalVendorListCreatorFunction: CallableFunction;
    private tcStringService: TCStringService;
    private cmpSupportedLanguageProvider: CmpSupportedLanguageProvider;

    /**
     * Constructor.
     *
     * @param {TCStringService} tcStringService
     * @param {CmpSupportedLanguageProvider} cmpSupportedLanguageProvider
     * @param {number} cmpId
     * @param {number} cmpVersion
     * @param {boolean} isServiceSpecific
     * @param {CallableFunction} globalVendorListCreatorFunction
     */
    constructor(
        tcStringService: TCStringService,
        cmpSupportedLanguageProvider: CmpSupportedLanguageProvider,
        cmpId: number,
        cmpVersion: number,
        isServiceSpecific: boolean,
        globalVendorListCreatorFunction: CallableFunction,
    ) {

        if (Number.isNaN(cmpId)) {

            throw new Error('TCModelService, cmpId parameter must be a valid number.');

        }

        if (Number.isNaN(cmpVersion)) {

            throw new Error('TCModelService, cmpVersion parameter must be a valid number.');

        }

        this.tcStringService = tcStringService;
        this.cmpSupportedLanguageProvider = cmpSupportedLanguageProvider;
        this.cmpId = cmpId;
        this.cmpVersion = cmpVersion;
        this.isServiceSpecific = isServiceSpecific;
        this.globalVendorListCreatorFunction = globalVendorListCreatorFunction;

    }

    /**
     * Build the TCModel from a TCString if is persisted
     * with the GVL used to generate it, otherwise build
     * a new TCModel with new GVL.
     *
     * @param {string} tcString
     * @return {Promise<TCModel>}
     */
    public async fetchDataAndBuildTCModel(tcString: string): Promise<TCModel> {

        const encodedString = tcString;

        let tcModel = new TCModel(this.globalVendorListCreatorFunction());

        // Some fields will not be populated until a GVL is loaded
        const promise = tcModel.gvl.readyPromise
            .then(() => {

                if (this.tcStringService.isValidTCString(encodedString)) {

                    const builtTCModel = TCString.decode(encodedString);
                    builtTCModel.gvl = tcModel.gvl;
                    tcModel = builtTCModel;

                }

                tcModel.cmpId = this.cmpId;
                tcModel.cmpVersion = this.cmpVersion;
                tcModel.isServiceSpecific = this.isServiceSpecific;

            })
            .then(() => {

                return tcModel.gvl.changeLanguage(this.cmpSupportedLanguageProvider.getCurrentLanguageForCmp());

            })
            .then(() => {

                return tcModel;

            });

        return await promise;

    }

    static getClassName(): string {

        return 'TCModelService';

    }

}

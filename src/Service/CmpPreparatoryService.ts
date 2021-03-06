import {EventDispatcher} from '../EventDispatcher';
import {ACModel} from '../Entity';
import {TCModel} from '@iabtcf/core';
import {UIConstructor} from '../UIConstructor';
import {ConsentRequiredEvent} from '../Event';
import {TCModelService} from './TCModelService';
import {ACModelService} from './ACModelService';
import {LoggerService} from './LoggerService';
import {SoloCmpDataBundle} from '../SoloCmpDataBundle';
import {UIChoicesBridgeDto, UIChoicesBridgeDtoBuilder} from '../UIChoicesBridge';

/**
 * CmpPreparatoryService.
 */
export class CmpPreparatoryService {

    private tcModelService: TCModelService;
    private acModelService: ACModelService;
    private uiConstructor: UIConstructor;
    private eventDispatcher: EventDispatcher;
    private loggerService: LoggerService;
    private isLegitimateInterestDisabled: boolean;

    /**
     * Constructor.
     *
     * @param {TCModelService} tcModelService
     * @param {ACModelService} acModelService
     * @param {UIConstructor} uiConstructor
     * @param {EventDispatcher} eventDispatcher
     * @param {LoggerService} loggerService
     * @param {Boolean} isLegitimateInterestDisabled
     */
    constructor(
        tcModelService: TCModelService,
        acModelService: ACModelService,
        uiConstructor: UIConstructor,
        eventDispatcher: EventDispatcher,
        loggerService: LoggerService,
        isLegitimateInterestDisabled: boolean,
    ) {

        this.tcModelService = tcModelService;
        this.acModelService = acModelService;
        this.uiConstructor = uiConstructor;
        this.eventDispatcher = eventDispatcher;
        this.loggerService = loggerService;
        this.isLegitimateInterestDisabled = isLegitimateInterestDisabled;

    }

    /**
     * Build the TCModel and ACModel to prepare the UI components and
     * call UIConstructor method to render the CMP.
     *
     * @param {string} tcString
     * @param {string} acString
     *
     * @return {Promise}
     */
    public async prepareAndRender(tcString: string, acString: string): Promise<SoloCmpDataBundle> {

        return await new Promise((resolve, reject) => {

            Promise.all([
                this.acModelService.fetchDataAndBuildACModel(acString),
                this.tcModelService.fetchDataAndBuildTCModel(tcString),
            ])
                .then((result) => {

                    const acModel: ACModel = result[0];
                    const checkACModel: boolean = typeof acModel === 'object' && acModel !== null;

                    const tcModel: TCModel = result[1];
                    const checkTCModel: boolean = typeof tcModel === 'object' && tcModel !== null;

                    if (!checkACModel || !checkTCModel) {

                        throw new Error('Something went wrong when checking ACModel and TCModel');

                    }

                    // Necessary, to know if the building process must set up some options enabled or not.
                    const firstTimeConsentRequest = tcString == '' || tcString == null;

                    const uiChoicesBridgeDto: UIChoicesBridgeDto = new UIChoicesBridgeDtoBuilder(
                        tcModel,
                        acModel,
                        firstTimeConsentRequest,
                        this.isLegitimateInterestDisabled,
                    ).createUIChoicesBridgeDto();

                    const soloCmpDataBundle = new SoloCmpDataBundle(
                        uiChoicesBridgeDto,
                        tcModel,
                        acModel,
                        firstTimeConsentRequest,
                    );

                    this.uiConstructor.buildUIAndRender(soloCmpDataBundle);

                    this.eventDispatcher.dispatch(new ConsentRequiredEvent());

                    resolve(soloCmpDataBundle);

                })
                .catch((error) => {

                    this.loggerService.error(
                        'CmpPreparatoryService, something went wrong in preparing the data!',
                        error,
                    );
                    reject(error);

                });

        });

    }

    static getClassName(): string {

        return 'CmpPreparatoryService';

    }

}

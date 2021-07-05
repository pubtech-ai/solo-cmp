import UIChoicesBridgeDtoBuilder from '../UIChoicesBridge/UIChoicesBridgeDtoBuilder';
import EventDispatcher from '../EventDispatcher/EventDispatcher';
import ACModel from '../Entity/ACModel';
import {TCModel} from '@iabtcf/core';
import UIConstructor from '../UIConstructor';
import ConsentRequiredEvent from '../Event/ConsentRequiredEvent';
import TCModelService from './TCModelService';
import ACModelService from './ACModelService';
import LoggerService from './LoggerService';
import SoloCmpDataBundle from '../SoloCmpDataBundle';
import UIChoicesBridgeDto from '../UIChoicesBridge/UIChoicesBridgeDto';

/**
 * CmpPreparatoryService.
 */
class CmpPreparatoryService {

    private tcModelService: TCModelService;
    private acModelService: ACModelService;
    private uiConstructor: UIConstructor;
    private eventDispatcher: EventDispatcher;
    private loggerService: LoggerService;

    /**
     * Constructor.
     *
     * @param {TCModelService} tcModelService
     * @param {ACModelService} acModelService
     * @param {UIConstructor} uiConstructor
     * @param {EventDispatcher} eventDispatcher
     * @param {LoggerService} loggerService
     */
    constructor(
        tcModelService: TCModelService,
        acModelService: ACModelService,
        uiConstructor: UIConstructor,
        eventDispatcher: EventDispatcher,
        loggerService: LoggerService,
    ) {

        this.tcModelService = tcModelService;
        this.acModelService = acModelService;
        this.uiConstructor = uiConstructor;
        this.eventDispatcher = eventDispatcher;
        this.loggerService = loggerService;

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

                    const uiChoicesBridgeDto: UIChoicesBridgeDto = new UIChoicesBridgeDtoBuilder(
                        tcModel,
                        acModel,
                    ).createUIChoicesBridgeDto();

                    const soloCmpDataBundle = new SoloCmpDataBundle(uiChoicesBridgeDto, tcModel, acModel);

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

export default CmpPreparatoryService;

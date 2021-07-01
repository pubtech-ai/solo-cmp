import UIChoicesParser from '../UIChoicesBridge/UIChoicesParser';
import UIChoicesBridgeDtoBuilder from '../UIChoicesBridge/UIChoicesBridgeDtoBuilder';
import EventDispatcher from '../EventDispatcher/EventDispatcher';
import ACModel from '../Entity/ACModel';
import {TCModel} from '@iabtcf/core';
import UIConstructor from '../UIConstructor';
import ConsentRequiredEvent from '../Event/ConsentRequiredEvent';
import TCModelService from './TCModelService';
import ACModelService from './ACModelService';
import LoggerService from './LoggerService';
import SoloCmpApi from '../SoloCmpApi';

/**
 * CmpPreparatoryService.
 */
class CmpPreparatoryService {

    private tcModelService: TCModelService;
    private uiConstructor: UIConstructor;
    private loggerService: LoggerService;
    private eventDispatcher: EventDispatcher;
    private acModelService: ACModelService;

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
     */
    prepareAndRender(tcString: string, acString: string): void {

        Promise.all([
            this.acModelService.fetchDataAndBuildACModel(acString),
            this.tcModelService.fetchDataAndBuildTCModel(tcString),
        ])
            .then((result) => {

                const acModel: ACModel = result[0];
                const checkACModel: boolean = typeof acModel === 'object';

                const tcModel: TCModel = result[1];
                const checkTCModel: boolean = typeof tcModel === 'object';

                if (!checkACModel || !checkTCModel) {

                    throw new Error('Something went wrong when checking ACModel and TCModel');

                }

                SoloCmpApi.getInstance().uiChoicesBridgeDto = new UIChoicesBridgeDtoBuilder(
                    tcModel,
                    acModel,
                ).createUIChoicesBridgeDto();

                UIChoicesParser.getInstance(tcModel, acModel);

                this.uiConstructor.buildUIAndRender();

                this.eventDispatcher.dispatch(new ConsentRequiredEvent());

            })
            .catch((error) => {

                this.loggerService.error('CmpPreparatoryService, something went wrong in preparing the data!', error);

            });

    }

}

export default CmpPreparatoryService;

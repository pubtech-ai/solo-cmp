import {UIChoicesParser} from '../UIChoicesBridge/';
import {ConsentReadyEvent} from '../Event';
import {EventDispatcher} from '../EventDispatcher';
import {TCStringService} from './TCStringService';
import {ACStringService} from './ACStringService';
import {SoloCmpDataBundle} from '../SoloCmpDataBundle';
import {TCModel} from '@iabtcf/core';
import {ACModel} from '../Entity';

/**
 * ConsentGeneratorService.
 */
export class ConsentGeneratorService {

    private tcStringService: TCStringService;
    private acStringService: ACStringService;
    private eventDispatcher: EventDispatcher;
    private isLegitimateInterestDisabled: boolean;

    /**
     * Constructor.
     *
     * @param {TCStringService} tcStringService
     * @param {ACStringService} acStringService
     * @param {EventDispatcher} eventDispatcher
     * @param {boolean} isLegitimateInterestDisabled
     */
    constructor(
        tcStringService: TCStringService,
        acStringService: ACStringService,
        eventDispatcher: EventDispatcher,
        isLegitimateInterestDisabled: boolean,
    ) {

        this.tcStringService = tcStringService;
        this.acStringService = acStringService;
        this.eventDispatcher = eventDispatcher;
        this.isLegitimateInterestDisabled = isLegitimateInterestDisabled;

    }

    /**
     * Generate the consent strings by the changes made on the UI bridges
     * parse the choices and dispatch ready and persist events.
     *
     * @param {SoloCmpDataBundle} soloCmpDataBundle
     */
    public generateAndPersistConsent(soloCmpDataBundle: SoloCmpDataBundle): void {

        const choicesParser = new UIChoicesParser(soloCmpDataBundle.tcModel, soloCmpDataBundle.acModel);

        const tcModel = choicesParser.parseTCModel(soloCmpDataBundle.uiChoicesBridgeDto);
        const acModel = choicesParser.parseACModel(soloCmpDataBundle.uiChoicesBridgeDto);

        this.dispatchReadyAndPersist(tcModel, acModel);

    }

    /**
     * Generate the consent strings with all consents enabled
     * and dispatch ready and persist events.
     *
     * @param {SoloCmpDataBundle} soloCmpDataBundle
     */
    public generateAndPersistConsentWithAllEnabled(soloCmpDataBundle: SoloCmpDataBundle): void {

        const choicesParser = new UIChoicesParser(soloCmpDataBundle.tcModel, soloCmpDataBundle.acModel);
        const tcModel = choicesParser.buildTCModelAllEnabled(this.isLegitimateInterestDisabled);
        const acModel = choicesParser.buildACModelAllEnabled();

        this.dispatchReadyAndPersist(tcModel, acModel);

    }

    /**
     * Dispatch the ready event and persist with the provided tcModel and acModel.
     *
     * @param {TCModel} tcModel
     * @param {ACModel} acModel
     * @private
     */
    private dispatchReadyAndPersist(tcModel: TCModel, acModel: ACModel): void {

        const tcString = this.tcStringService.buildTCString(tcModel);
        const acString = this.acStringService.buildACString(acModel);
        this.eventDispatcher.dispatch(new ConsentReadyEvent(tcString, acString));

        this.tcStringService.persistTCString(tcString);
        this.acStringService.persistACString(acString);

    }

    static getClassName(): string {

        return 'ConsentGeneratorService';

    }

}

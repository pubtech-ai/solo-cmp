import ChoicesParser from '../UIChoicesBridge/UIChoicesParser';
import ConsentReadyEvent from '../Event/ConsentReadyEvent';
import ConsentPersistEvent from '../Event/ConsentPersistEvent';
import EventDispatcher from '../EventDispatcher/EventDispatcher';
import TCStringService from './TCStringService';
import ACStringService from './ACStringService';
import UIChoicesBridgeDto from '../UIChoicesBridge/UIChoicesBridgeDto';
import SoloCmpDataBundle from '../SoloCmpDataBundle';

/**
 * ConsentGeneratorService.
 */
class ConsentGeneratorService {

    private tcStringService: TCStringService;
    private acStringService: ACStringService;
    private eventDispatcher: EventDispatcher;

    /**
     * Constructor.
     *
     * @param {TCStringService} tcStringService
     * @param {ACStringService} acStringService
     * @param {EventDispatcher} eventDispatcher
     */
    constructor(tcStringService: TCStringService, acStringService: ACStringService, eventDispatcher: EventDispatcher) {

        this.tcStringService = tcStringService;
        this.acStringService = acStringService;
        this.eventDispatcher = eventDispatcher;

    }

    /**
     * Generate the consent strings by the changes made on the UI bridges
     * parse the choices and dispatch ready and persist events.
     *
     * @param {UIChoicesBridgeDto} uiChoicesBridgeDto
     * @param {SoloCmpDataBundle} soloCmpDataBundle
     */
    public generateAndPersistConsent(uiChoicesBridgeDto: UIChoicesBridgeDto, soloCmpDataBundle: SoloCmpDataBundle): void {

        const choicesParser = new ChoicesParser(soloCmpDataBundle.tcModel, soloCmpDataBundle.acModel);

        const tcModel = choicesParser.parseTCModel(uiChoicesBridgeDto);
        const acModel = choicesParser.parseACModel(uiChoicesBridgeDto);

        const tcString = this.tcStringService.buildTCString(tcModel);
        const acString = this.acStringService.buildACString(acModel);

        this.dispatchReadyAndPersistEvents(tcString, acString);

    }

    /**
     * Generate the consent strings with all consents enabled
     * and dispatch ready and persist events.
     *
     * @param {SoloCmpDataBundle} soloCmpDataBundle
     */
    public generateAndPersistConsentWithAllEnabled(soloCmpDataBundle: SoloCmpDataBundle): void {

        const tcString = this.tcStringService.buildTCStringAllEnabled(soloCmpDataBundle.tcModel);
        const acString = this.acStringService.buildACStringAllEnabled(soloCmpDataBundle.acModel);

        this.dispatchReadyAndPersistEvents(tcString, acString);

    }

    /**
     * Dispatch the ready and persist events with the provided tcString and acString.
     *
     * @param {string} tcString
     * @param {string} acString
     * @private
     */
    private dispatchReadyAndPersistEvents(tcString: string, acString: string): void {

        this.eventDispatcher.dispatch(new ConsentReadyEvent(tcString, acString));

        this.eventDispatcher.dispatch(new ConsentPersistEvent(tcString, acString));

    }

}

export default ConsentGeneratorService;

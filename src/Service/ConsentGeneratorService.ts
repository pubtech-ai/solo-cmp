import ChoicesParser from '../UIChoicesBridge/UIChoicesParser';
import ConsentReadyEvent from '../Event/ConsentReadyEvent';
import ConsentPersistEvent from '../Event/ConsentPersistEvent';
import EventDispatcher from '../EventDispatcher/EventDispatcher';
import TCStringService from './TCStringService';
import ACStringService from './ACStringService';
import UIChoicesBridgeDto from '../UIChoicesBridge/UIChoicesBridgeDto';

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

        this.eventDispatcher = eventDispatcher;
        this.tcStringService = tcStringService;
        this.acStringService = acStringService;

    }

    /**
     * Generate the consent strings by the changes made on the UI bridges
     * parse the choices and dispatch ready and persist events.
     *
     * @param {UIChoicesBridgeDto} uiChoicesBridgeDto
     */
    public generateAndPersistConsent(uiChoicesBridgeDto: UIChoicesBridgeDto): void {

        const choicesParser = ChoicesParser.getInstance();

        const tcModel = choicesParser.parseTCModel(uiChoicesBridgeDto);
        const acModel = choicesParser.parseACModel(uiChoicesBridgeDto);

        const tcString = this.tcStringService.buildTCString(tcModel);
        const acString = this.acStringService.buildACString(acModel);

        this.dispatchReadyAndPersistEvents(tcString, acString);

    }

    /**
     * Generate the consent strings with all consents enabled
     * and dispatch ready and persist events.
     */
    public generateAndPersistConsentWithAllEnabled(): void {

        const choicesParser = ChoicesParser.getInstance();

        const tcString = this.tcStringService.buildTCStringAllEnabled(choicesParser.tcModel);
        const acString = this.acStringService.buildACStringAllEnabled(choicesParser.acModel);

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

import {UIChoicesParser} from '../UIChoicesBridge/';
import {ConsentReadyEvent} from '../Event';
import {EventDispatcher} from '../EventDispatcher';
import {TCStringService} from './TCStringService';
import {ACStringService} from './ACStringService';
import {SoloCmpDataBundle} from '../SoloCmpDataBundle';

/**
 * ConsentGeneratorService.
 */
export class ConsentGeneratorService {

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
     * @param {SoloCmpDataBundle} soloCmpDataBundle
     */
    public generateAndPersistConsent(soloCmpDataBundle: SoloCmpDataBundle): void {

        const choicesParser = new UIChoicesParser(soloCmpDataBundle.tcModel, soloCmpDataBundle.acModel);

        const tcModel = choicesParser.parseTCModel(soloCmpDataBundle.uiChoicesBridgeDto);
        const acModel = choicesParser.parseACModel(soloCmpDataBundle.uiChoicesBridgeDto);

        const tcString = this.tcStringService.buildTCString(tcModel);
        const acString = this.acStringService.buildACString(acModel);

        this.dispatchReadyAndPersist(tcString, acString);

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

        this.dispatchReadyAndPersist(tcString, acString);

    }

    /**
     * Dispatch the ready event and persist with the provided tcString and acString.
     *
     * @param {string} tcString
     * @param {string} acString
     * @private
     */
    private dispatchReadyAndPersist(tcString: string, acString: string): void {

        this.eventDispatcher.dispatch(new ConsentReadyEvent(tcString, acString));

        this.tcStringService.persistTCString(tcString);
        this.acStringService.persistACString(acString);

    }

    static getClassName(): string {

        return 'ConsentGeneratorService';

    }

}

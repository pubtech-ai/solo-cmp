import {ConsentReadyEvent, OpenCmpUIEvent} from '../Event';
import {UIConstructor} from '../UIConstructor';
import {EventDispatcher} from '../EventDispatcher';
import {LoggerService} from './LoggerService';
import {ACStringService} from './ACStringService';
import {TCStringService} from './TCStringService';

/**
 * Orchestrator.
 */
export class Orchestrator {

    private tcStringService: TCStringService;
    private acStringService: ACStringService;
    private uiConstructor: UIConstructor;
    private eventDispatcher: EventDispatcher;
    private loggerService: LoggerService;

    /**
     * Constructor.
     *
     * @param {TCStringService} tcStringService
     * @param {ACStringService} acStringService
     * @param {UIConstructor} uiConstructor
     * @param {EventDispatcher} eventDispatcher
     * @param {LoggerService} loggerService
     */
    constructor(
        tcStringService: TCStringService,
        acStringService: ACStringService,
        uiConstructor: UIConstructor,
        eventDispatcher: EventDispatcher,
        loggerService: LoggerService,
    ) {

        this.tcStringService = tcStringService;
        this.acStringService = acStringService;
        this.uiConstructor = uiConstructor;
        this.eventDispatcher = eventDispatcher;
        this.loggerService = loggerService;

    }

    /**
     * Init the process that orchestrate the flow of the
     * CMP, if the consent is valid it is useless to render
     * so generate directly the ConsentReadyEvent.
     * Otherwise, render the CMP.
     */
    public initCmp(): void {

        const tcStringFetched = this.tcStringService.retrieveTCString();
        const acStringFetched = this.acStringService.retrieveACString();

        if (this.checkIfConsentsAreValid(tcStringFetched, acStringFetched)) {

            const consentReadyEvent = new ConsentReadyEvent(tcStringFetched, acStringFetched);

            this.loggerService.debug('Orchestrator, consents are valid. ConsentReadyEvent dispatched.');

            this.eventDispatcher.dispatch(consentReadyEvent);

            this.uiConstructor.buildOpenCmpButtonAndRender();

        } else {

            if (tcStringFetched.length > 0) {

                this.tcStringService.removeTCString();
                this.acStringService.removeACString();

            }

            this.eventDispatcher.dispatch(new OpenCmpUIEvent());

        }

    }

    /**
     * Check if tcString and acString are valid.
     *
     * @param {string} tcString
     * @param {string} acString
     * @private
     *
     * @return {boolean}
     */
    private checkIfConsentsAreValid(tcString: string, acString: string): boolean {

        return this.tcStringService.isValidTCString(tcString) && this.acStringService.isValidACString(acString);

    }

    static getClassName(): string {

        return 'Orchestrator';

    }

}

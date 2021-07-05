import {AcceptAllEvent, ApplyConsentEvent} from '../Event';
import {EventSubscriberInterface} from '../EventDispatcher';
import {ConsentGeneratorService} from '../Service';

/**
 * ConsentsGeneratorSubscriber.
 */
export class ConsentsGeneratorSubscriber implements EventSubscriberInterface {

    private consentGeneratorService: ConsentGeneratorService;

    /**
     * Constructor.
     *
     * @param {ConsentGeneratorService} consentGeneratorService
     */
    constructor(consentGeneratorService: ConsentGeneratorService) {

        this.consentGeneratorService = consentGeneratorService;

    }

    /**
     * @inheritDoc
     */
    public getSubscribedEvents(): Record<string, string> {

        return {
            [ApplyConsentEvent.EVENT_NAME]: 'onApplyConsent',
            [AcceptAllEvent.EVENT_NAME]: 'onAcceptAll',
        };

    }

    /**
     * When the user click on accept selected
     * the CMP will generate the consent strings by the UIChoicesBridgeDto
     * stored in the event.
     *
     * @param {ApplyConsentEvent} event
     */
    public onApplyConsent(event: ApplyConsentEvent): void {

        this.consentGeneratorService.generateAndPersistConsent(event.uiChoicesBridgeDto, event.soloCmpDataBundle);

    }

    /**
     * When the user click on accept all
     * the CMP will generate the consent strings with all choices
     * enabled and persist them.
     *
     * @param {AcceptAllEvent} event
     */
    public onAcceptAll(event: AcceptAllEvent): void {

        this.consentGeneratorService.generateAndPersistConsentWithAllEnabled(event.soloCmpDataBundle);

    }

    static getClassName(): string {

        return 'ConsentsGeneratorSubscriber';

    }

}

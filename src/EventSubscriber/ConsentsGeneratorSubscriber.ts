import ApplyConsentEvent from '../Event/ApplyConsentEvent';
import AcceptAllEvent from '../Event/AcceptAllEvent';
import EventSubscriberInterface from '../EventDispatcher/EventSubscriberInterface';
import ConsentGeneratorService from '../Service/ConsentGeneratorService';

/**
 * ConsentsGeneratorSubscriber.
 */
class ConsentsGeneratorSubscriber implements EventSubscriberInterface {

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
            [ApplyConsentEvent.name]: 'onApplyConsent',
            [AcceptAllEvent.name]: 'onAcceptAll',
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

}

export default ConsentsGeneratorSubscriber;

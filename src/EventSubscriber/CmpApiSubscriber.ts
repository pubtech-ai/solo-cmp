import ConsentReadyEvent from '../Event/ConsentReadyEvent';
import ConsentRequiredEvent from '../Event/ConsentRequiredEvent';
import EventSubscriberInterface from '../EventDispatcher/EventSubscriberInterface';
import CmpApiProvider from '../Service/CmpApiProvider';

/**
 * CmpApiSubscriber.
 */
class CmpApiSubscriber implements EventSubscriberInterface {

    private cmpApiProvider: CmpApiProvider;

    /**
     * Constructor.
     *
     * @param {CmpApiProvider} cmpApiProvider
     */
    constructor(cmpApiProvider: CmpApiProvider) {

        this.cmpApiProvider = cmpApiProvider;

    }

    /**
     * @inheritDoc
     */
    public getSubscribedEvents(): Record<string, string> {

        return {
            [ConsentReadyEvent.name]: 'onConsentReady',
            [ConsentRequiredEvent.name]: 'onConsentRequired',
        };

    }

    /**
     * When the consent is ready we call the update
     * and provide it the new TCString and ACString.
     *
     * @param {ConsentReadyEvent} event
     */
    public onConsentReady(event: ConsentReadyEvent): void {

        this.cmpApiProvider.cmpApi.update(event.tcString, false);

    }

    /**
     * When the consent is required the UI is visible.
     *
     * @param {ConsentRequiredEvent} event
     */
    public onConsentRequired(event: ConsentRequiredEvent): void {

        this.cmpApiProvider.cmpApi.update('', true);

    }

}

export default CmpApiSubscriber;

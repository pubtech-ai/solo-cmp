import ConsentReadyEvent from '../Event/ConsentReadyEvent';
import CmpConfiguration from '../Service/CmpConfiguration/CmpConfiguration';
import EventSubscriberInterface from '../EventDispatcher/EventSubscriberInterface';
import CmpConfigurationProvider from '../Service/CmpConfigurationProvider';

/**
 * CmpCallbackSubscriber.
 */
class CmpCallbackSubscriber implements EventSubscriberInterface {

    private cmpConfigurationProvider: CmpConfigurationProvider;

    /**
     * Constructor.
     *
     * @param {CmpConfigurationProvider} cmpConfigurationProvider
     */
    constructor(cmpConfigurationProvider: CmpConfigurationProvider) {

        this.cmpConfigurationProvider = cmpConfigurationProvider;

    }

    /**
     * @inheritDoc
     */
    public getSubscribedEvents(): Record<string, string> {

        return {
            [ConsentReadyEvent.EVENT_NAME]: 'onConsentReady',
        };

    }

    /**
     * When the consent is ready, we need to call
     * the callback of the publisher.
     *
     * @param {ConsentReadyEvent} event
     */
    public onConsentReady(event: ConsentReadyEvent): void {

        const cmpConfiguration: CmpConfiguration = this.cmpConfigurationProvider.cmpConfiguration;

        cmpConfiguration.onConsentAdsCallBack(event);

    }

    static getClassName(): string {

        return 'CmpCallbackSubscriber';

    }

}

export default CmpCallbackSubscriber;

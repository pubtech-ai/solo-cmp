import {ConsentReadyEvent} from '../Event';
import {EventSubscriberInterface} from '../EventDispatcher';
import {CmpConfigurationProvider, CmpConfiguration} from '../Service';

/**
 * CmpCallbackSubscriber.
 */
export class CmpCallbackSubscriber implements EventSubscriberInterface {

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

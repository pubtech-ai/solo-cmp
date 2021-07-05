import {ConsentReadyEvent, ConsentRequiredEvent} from '../Event';
import {EventSubscriberInterface} from '../EventDispatcher';
import {CmpApiProvider} from '../Service';

/**
 * CmpApiSubscriber.
 */
export class CmpApiSubscriber implements EventSubscriberInterface {

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
            [ConsentReadyEvent.EVENT_NAME]: 'onConsentReady',
            [ConsentRequiredEvent.EVENT_NAME]: 'onConsentRequired',
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

    static getClassName(): string {

        return 'CmpApiSubscriber';

    }

}

export default CmpApiSubscriber;

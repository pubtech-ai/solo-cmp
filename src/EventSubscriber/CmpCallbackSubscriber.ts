import {ConsentReadyEvent} from '../Event';
import {EventSubscriberInterface} from '../EventDispatcher';
import {TCModel, TCString} from '@iabtcf/core';

/**
 * CmpCallbackSubscriber.
 */
export class CmpCallbackSubscriber implements EventSubscriberInterface {

    private onConsentAdsCallBack: (event: ConsentReadyEvent, tcModel: TCModel) => void;

    /**
     * Constructor.
     *
     * @param {CallableFunction} onConsentAdsCallBack
     */
    constructor(onConsentAdsCallBack: (event: ConsentReadyEvent, tcModel: TCModel) => void) {

        this.onConsentAdsCallBack = onConsentAdsCallBack;

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

        this.onConsentAdsCallBack(event, TCString.decode(event.tcString));

    }

    static getClassName(): string {

        return 'CmpCallbackSubscriber';

    }

}

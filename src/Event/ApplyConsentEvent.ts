import {BaseEvent} from '../EventDispatcher';
import {SoloCmpDataBundle} from '../SoloCmpDataBundle';

/**
 * ApplyConsentEvent.
 */
export class ApplyConsentEvent implements BaseEvent {

    readonly EVENT_NAME = 'ApplyConsent';
    static readonly EVENT_NAME = 'ApplyConsent';

    private readonly _soloCmpDataBundle: SoloCmpDataBundle;

    /**
     * Constructor.
     *
     * @param {SoloCmpDataBundle} soloCmpDataBundle
     */
    constructor(soloCmpDataBundle: SoloCmpDataBundle) {

        this._soloCmpDataBundle = soloCmpDataBundle;

    }

    get soloCmpDataBundle(): SoloCmpDataBundle {

        return this._soloCmpDataBundle;

    }

}

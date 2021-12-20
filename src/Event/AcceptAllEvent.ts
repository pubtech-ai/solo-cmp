import {BaseEvent} from '../EventDispatcher';
import {SoloCmpDataBundle} from '../SoloCmpDataBundle';

/**
 * AcceptAllEvent.
 */
export class AcceptAllEvent implements BaseEvent {

    readonly EVENT_NAME = 'AcceptAll';
    static readonly EVENT_NAME = 'AcceptAll';

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

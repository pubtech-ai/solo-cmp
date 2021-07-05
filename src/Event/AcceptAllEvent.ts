import BaseEvent from '../EventDispatcher/BaseEvent';
import SoloCmpDataBundle from '../SoloCmpDataBundle';

/**
 * AcceptAllEvent.
 */
class AcceptAllEvent implements BaseEvent {

    readonly EVENT_NAME = 'AcceptAllEvent';
    static readonly EVENT_NAME = 'AcceptAllEvent';

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

export default AcceptAllEvent;

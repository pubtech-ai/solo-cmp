import BaseEvent from '../EventDispatcher/BaseEvent';

/**
 * OpenCmpUIEvent.
 */
class OpenCmpUIEvent implements BaseEvent {

    readonly EVENT_NAME = 'OpenCmpUIEvent';
    static readonly EVENT_NAME = 'OpenCmpUIEvent';

    private readonly _tcString: string;
    private readonly _acString: string;

    /**
     * Constructor.
     *
     * @param {string} tcString
     * @param {string} acString
     */
    constructor(tcString = '', acString = '') {

        this._tcString = tcString;
        this._acString = acString;

    }

    get tcString(): string {

        return this._tcString;

    }

    get acString(): string {

        return this._acString;

    }

}

export default OpenCmpUIEvent;

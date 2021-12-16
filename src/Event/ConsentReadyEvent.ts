import {BaseEvent} from '../EventDispatcher';

/**
 * ConsentReadyEvent.
 */
export class ConsentReadyEvent implements BaseEvent {

    readonly EVENT_NAME = 'ConsentReady';
    static readonly EVENT_NAME = 'ConsentReady';

    private readonly _tcString: string;
    private readonly _acString: string;

    /**
     * Constructor.
     *
     * @param {string} tcString
     * @param {string} acString
     */
    constructor(tcString: string, acString: string) {

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

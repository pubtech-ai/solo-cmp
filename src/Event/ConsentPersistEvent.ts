import {BaseEvent} from '../EventDispatcher';

/**
 * ConsentPersistEvent.
 */
export class ConsentPersistEvent implements BaseEvent {

    readonly EVENT_NAME = 'ConsentPersistEvent';
    static readonly EVENT_NAME = 'ConsentPersistEvent';

    private readonly tcString: string;
    private readonly acString: string;

    /**
     * Constructor.
     *
     * @param {string} tcString
     * @param {string} acString
     */
    constructor(tcString: string, acString: string) {

        this.tcString = tcString;
        this.acString = acString;

    }

    public getTcString(): string {

        return this.tcString;

    }

    public getAcString(): string {

        return this.acString;

    }

}

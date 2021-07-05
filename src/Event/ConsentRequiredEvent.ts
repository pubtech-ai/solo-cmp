import {BaseEvent} from '../EventDispatcher';

/**
 * ConsentRequiredEvent.
 */
export class ConsentRequiredEvent implements BaseEvent {

    readonly EVENT_NAME = 'ConsentRequiredEvent';
    static readonly EVENT_NAME = 'ConsentRequiredEvent';

}

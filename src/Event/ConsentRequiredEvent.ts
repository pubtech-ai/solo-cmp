import {BaseEvent} from '../EventDispatcher';

/**
 * ConsentRequiredEvent.
 */
export class ConsentRequiredEvent implements BaseEvent {

    readonly EVENT_NAME = 'ConsentRequired';
    static readonly EVENT_NAME = 'ConsentRequired';

}

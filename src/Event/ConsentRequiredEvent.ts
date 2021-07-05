import BaseEvent from '../EventDispatcher/BaseEvent';

/**
 * ConsentRequiredEvent.
 */
class ConsentRequiredEvent implements BaseEvent {

    readonly EVENT_NAME = 'ConsentRequiredEvent';
    static readonly EVENT_NAME = 'ConsentRequiredEvent';

}

export default ConsentRequiredEvent;

import BaseEvent from '../EventDispatcher/BaseEvent';

/**
 * MoreChoicesEvent.
 */
class MoreChoicesEvent implements BaseEvent {

    readonly EVENT_NAME = 'MoreChoicesEvent';
    static readonly EVENT_NAME = 'MoreChoicesEvent';

}

export default MoreChoicesEvent;

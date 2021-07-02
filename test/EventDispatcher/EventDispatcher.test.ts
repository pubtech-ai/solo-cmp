const sinon = require('sinon');
import EventDispatcher from '../../src/EventDispatcher/EventDispatcher';

describe('EventDispatcher suit test', () => {
    it('EventDispatcher execute function on dispatch', () => {
        const subscriber = {
            method: function (eventObject) {
                //Do somethings!
            },
        };

        const mock = sinon.mock(subscriber);

        const testEvent = {
            constructor: {
                name: 'TestEvent',
            },
        };

        mock.expects('method').once().withArgs(testEvent);

        const eventDispatcher = EventDispatcher.getInstance();

        eventDispatcher.subscribe('SubscriberTest', testEvent.constructor.name, subscriber.method);

        eventDispatcher.dispatch(testEvent);

        mock.verify();
    });
});

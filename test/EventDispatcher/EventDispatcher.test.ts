const sinon = require("sinon");
import EventDispatcher from "../../src/EventDispatcher/EventDispatcher";

describe("EventDispatcher suit test", () => {

    it("EventDispatcher execute function on dispatch", () => {
        const subscriber = { method: function (eventObject) { console.log("wewewe!"); } };

        const mock = sinon.mock(subscriber);

        const testEvent = {
            constructor: {
                name: 'TestEvent',
            }
        };

        mock.expects('method').once().withArgs(testEvent);

        EventDispatcher.subscribe(
            'SubscriberTest',
            testEvent.constructor.name,
            subscriber.method
        );

        EventDispatcher.dispatch(testEvent);

        mock.verify();
    });

});

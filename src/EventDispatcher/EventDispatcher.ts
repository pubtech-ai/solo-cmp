import {BaseEvent} from './BaseEvent';

/**
 * EventDispatcher.
 */
export class EventDispatcher {

    private static instance: EventDispatcher;

    /**
     * subscriptions format:
     * { eventType: { id: callback } }
     */
    private subscriptions: any = {};
    private subscriptionsInfo: any = {};
    private getNextUniqueId = EventDispatcher.getIdGenerator();

    /**
     * Retrieve the instance or build it if is not instantiated.
     *
     * @return {EventDispatcher}
     */
    public static getInstance(): EventDispatcher {

        if (!EventDispatcher.instance) {

            EventDispatcher.instance = new EventDispatcher();

        }

        return EventDispatcher.instance;

    }

    /**
     * Subscribe a method to a specific event
     * when it will be dispatched the subscriber
     * callback will be executed.
     *
     * @param {string} name
     * @param {string} eventType
     * @param {CallableFunction} callback
     *
     * @return {object}
     */
    public subscribe(name: string, eventType: string, callback: CallableFunction): any {

        const id = this.getNextUniqueId();

        if (!this.subscriptions[eventType]) this.subscriptions[eventType] = {};

        if (!this.subscriptionsInfo[eventType]) {

            this.subscriptionsInfo[eventType] = {};

        }

        this.subscriptions[eventType][id] = callback;
        this.subscriptionsInfo[eventType][id] = name;

        return {
            unsubscribe: (): void => {

                delete this.subscriptions[eventType][id];

                if (Object.keys(this.subscriptions[eventType]).length === 0) {

                    delete this.subscriptions[eventType];

                }

            },
        };

    }

    /**
     * Dispatch an event.
     *
     * @param {BaseEvent} event
     */
    public dispatch(event: BaseEvent): void {

        const eventName = event.EVENT_NAME;

        if (!this.subscriptions[eventName]) return;

        Object.keys(this.subscriptions[eventName]).forEach((key) => {

            try {

                this.subscriptions[eventName][key](event);

            } catch (error) {

                // eslint-disable-next-line
                console.error(
                    'Something went wrong in ' +
                        this.subscriptionsInfo[event.EVENT_NAME][key] +
                        ', subscribed to the event: \'' +
                        event.EVENT_NAME +
                        '\'',
                    'SOLO-CMP',
                    [error],
                );

            }

        });

    }

    /**
     * Generate an ID.
     *
     * @private
     * @return {CallableFunction}
     */
    private static getIdGenerator(): CallableFunction {

        let lastId = 0;

        return function getNextUniqueId(): number {

            lastId += 1;
            return lastId;

        };

    }

    static getClassName(): string {

        return 'EventDispatcher';

    }

}

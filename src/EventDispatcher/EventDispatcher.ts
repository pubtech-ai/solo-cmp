import BaseEvent from './BaseEvent';

/**
 * EventDispatcher.
 */
class EventDispatcher {

    /**
     * subscriptions format:
     * { eventType: { id: callback } }
     */
    private subscriptions: any = {};
    private subscriptionsInfo: any = {};
    private getNextUniqueId = EventDispatcher.getIdGenerator();

    /**
     * Subscribe a method to a specific event
     * when it will be dispatched the subscriber
     * the callback will be executed.
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

        if (!this.subscriptions[event.constructor.name]) return;

        Object.keys(this.subscriptions[event.constructor.name]).forEach((key) => {

            try {

                this.subscriptions[event.constructor.name][key](event);

            } catch (error) {

                // eslint-disable-next-line
                console.error(
                    'Something went wrong in ' +
                        this.subscriptionsInfo[event.constructor.name][key] +
                        ', subscribed to the event: \'' +
                        event.constructor.name +
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

}

const instance = new EventDispatcher();
Object.freeze(instance);

export default instance;

/**
 * EventSubscriberInterface.
 */
interface EventSubscriberInterface {
    /**
     * Return an array that map an event to a function of the
     * EventSubscriber implemented.
     */
    getSubscribedEvents(): Record<string, string>;
}

export default EventSubscriberInterface;

import Bottle, {IContainer} from 'bottlejs';
import EventDispatcher from './EventDispatcher/EventDispatcher';
import EventSubscriberInterface from './EventDispatcher/EventSubscriberInterface';

/**
 * DIContainer.
 */
class DIContainer {

    private bottle: Bottle;

    /**
     * Constructor.
     */
    constructor() {

        this.bottle = new Bottle();

        const emptyContainer = (): void => {};

        this.bottle.service('service', emptyContainer);
        this.bottle.service('eventSubscriber', emptyContainer);

    }

    /**
     * Returns all containers. Use this method if you're want to get initializers in your services.
     *
     * @param {String=} containerName Name of the nested container. "init" & "service" are the core containers.
     * @return {Bottle.IContainer}
     */
    public getContainer(containerName = ''): Bottle.IContainer {

        const containerNames = this.bottle.list();

        if (containerNames.indexOf(containerName) !== -1) {

            return this.bottle.container[containerName];

        }

        return this.bottle.container;

    }

    /**
     * Registers optional services & provider for the application.
     * The service will be added to a nested DI container.
     *
     * @param {String} name Name of the service
     * @param {Function} provider Factory method for the service
     *
     * @return {DIContainer}
     */
    public addServiceProvider(name: string, provider: (container: IContainer) => any): DIContainer {

        this.bottle.factory(`service.${name}`, provider.bind(this));
        return this;

    }

    /**
     * Registers optional services & provider for the application.
     *
     * The service will be added to a nested DI container.
     *
     * @param {String} name Name of the service
     * @param {Function} provider Factory method for the service
     *
     * @return {DIContainer}
     */
    public addEventSubscriberProvider(
        name: string,
        provider: (container: IContainer) => EventSubscriberInterface,
    ): DIContainer {

        this.bottle.factory(`eventSubscriber.${name}`, provider.bind(this));

        const subscriber = provider(this.getContainer('service'));

        for (const [key, methodName] of Object.entries(subscriber.getSubscribedEvents())) {

            EventDispatcher.subscribe(name, key, (eventObject): void => subscriber[methodName](eventObject));

        }

        return this;

    }

    /**
     * Fetch a service inside container by className provided.
     *
     * @param {string} className
     *
     * @return {object}
     */
    public getService(className: string): any {

        const serviceContainer = this.getContainer('service');

        return serviceContainer[className];

    }

}

const instance = new DIContainer();
Object.freeze(instance);

export default instance;

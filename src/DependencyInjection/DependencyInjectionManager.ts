import Bottle, {IContainer} from 'bottlejs';
import EventDispatcher from '../EventDispatcher/EventDispatcher';
import EventSubscriberInterface from '../EventDispatcher/EventSubscriberInterface';

/**
 * DependencyInjectionManager.
 */
class DependencyInjectionManager {

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
     * Return a sub container or throw an error if it not exists.
     *
     * @param {String=} subContainerName Name of the nested container.
     * @return {Bottle.IContainer}
     */
    public getSubContainer(subContainerName = ''): Bottle.IContainer {

        const containerNames = this.bottle.list();

        if (containerNames.indexOf(subContainerName) !== -1) {

            return this.bottle.container[subContainerName];

        }

        throw new Error(`Sub container with name: ${subContainerName}, not exists.`);

    }

    /**
     * Add optional services & provider for the application.
     * The service will be added to a nested DI container.
     *
     * @param {String} name Name of the service
     * @param {Function} provider Factory method for the service
     *
     * @return {DependencyInjectionManager}
     */
    public addServiceProvider(name: string, provider: (container: IContainer) => any): DependencyInjectionManager {

        this.bottle.factory(`service.${name}`, provider.bind(this));
        return this;

    }

    /**
     * Add optional services & provider for the application.
     * The service will be added to a nested DI container.
     *
     * @param {String} name Name of the service
     * @param {Function} provider Factory method for the service
     *
     * @return {DependencyInjectionManager}
     */
    public addEventSubscriberProvider(
        name: string,
        provider: (container: IContainer) => EventSubscriberInterface,
    ): DependencyInjectionManager {

        this.bottle.factory(`eventSubscriber.${name}`, provider.bind(this));

        const subscriber = provider(this.getSubContainer('service'));

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

        const serviceContainer = this.getSubContainer('service');

        return serviceContainer[className];

    }

}

const instance = new DependencyInjectionManager();
Object.freeze(instance);

export default instance;

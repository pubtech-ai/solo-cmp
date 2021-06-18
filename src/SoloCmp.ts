import DIContainer from './DIContainer';

/**
 * SoloCmp.
 */
class SoloCmp {

    private _DIContainer = DIContainer;

    /**
     * Constructor.
     */
    constructor() {

        this.registerServices();
        this.registerSubscribers();

    }

    /**
     * Register all default services.
     */
    registerServices(): void {
        // TODO Add Logger Service #4
    }

    /**
     * Register all default subscribers.
     */
    registerSubscribers(): void {
        // TODO Add SoloCmp subscribers and relative events #11
    }

    /**
     * Return the DIContainer instance.
     *
     * @return {DIContainer}
     */
    getDIContainer(): typeof DIContainer {

        return this._DIContainer;

    }

}

export default SoloCmp;

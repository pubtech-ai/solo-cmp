import DIContainer from './DIContainer';

/**
 * SoloCmp.
 */
class SoloCmp {

    private _DIContainer = DIContainer;

    constructor() {

        this.buildServices();
        this.buildSubscribers();

    }

    /**
     * Register all default services.
     */
    buildServices(): void {
        // TODO Add all service provider.
    }

    /**
     * Register all default subscribers.
     */
    buildSubscribers(): void {
        // TODO Add all subscriber provider.
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

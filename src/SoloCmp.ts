import DependencyInjectionManager from './DependencyInjection/DependencyInjectionManager';

/**
 * SoloCmp.
 */
class SoloCmp {

    private _DependencyInjectionManager = DependencyInjectionManager;

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
     * Return the DependencyInjectionManager instance.
     *
     * @return {DependencyInjectionManager}
     */
    getDependencyInjectionManager(): typeof DependencyInjectionManager {

        return this._DependencyInjectionManager;

    }

}

export default SoloCmp;

import DependencyInjectionManager from './DependencyInjection/DependencyInjectionManager';
import Logger from './Service/Logger';

/**
 * SoloCmp.
 */
class SoloCmp {

    private _DependencyInjectionManager = DependencyInjectionManager;
    private isDebugEnabled: boolean;

    /**
     * Constructor.
     *
     * @param {boolean} isDebugEnabled
     */
    constructor(isDebugEnabled: boolean) {

        this.isDebugEnabled = isDebugEnabled;

        this.registerServices();
        this.registerSubscribers();

    }

    /**
     * Register all default services.
     */
    registerServices(): void {

        this._DependencyInjectionManager.addServiceProvider(Logger.name, () => {

            return new Logger(this.isDebugEnabled);

        });

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

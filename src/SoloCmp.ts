import {IContainer} from 'bottlejs';
import DependencyInjectionManager from './DependencyInjection/DependencyInjectionManager';
import Logger from './Service/Logger';
import Cookie from './Service/Cookie';
import CmpSupportedLanguageProvider from './Service/CmpSupportedLanguageProvider';

/**
 * SoloCmp.
 */
class SoloCmp {

    private _DependencyInjectionManager = DependencyInjectionManager;
    private isDebugEnabled: boolean;
    private supportedLanguages: string[];

    /**
     * Constructor.
     *
     * @param {boolean} isDebugEnabled
     * @param {string[]} supportedLanguages
     */
    constructor(isDebugEnabled: boolean, supportedLanguages: string[]) {

        this.isDebugEnabled = isDebugEnabled;
        this.supportedLanguages = supportedLanguages;

        this.registerServices();
        this.registerSubscribers();

    }

    /**
     * Register all default services.
     */
    registerServices(): void {

        this._DependencyInjectionManager
            .addServiceProvider(Logger.name, () => {

                return new Logger(this.isDebugEnabled);

            })
            .addServiceProvider(Cookie.name, (container: IContainer) => {

                return new Cookie(container[Logger.name], window.location.hostname, document);

            })
            .addServiceProvider(CmpSupportedLanguageProvider.name, () => {

                return new CmpSupportedLanguageProvider(this.supportedLanguages);

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

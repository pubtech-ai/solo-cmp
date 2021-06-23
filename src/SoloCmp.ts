import {IContainer} from 'bottlejs';
import DependencyInjectionManager from './DependencyInjection/DependencyInjectionManager';
import Logger from './Service/Logger';
import Cookie from './Service/Cookie';
import CmpConfigurationProvider from './Service/CmpConfigurationProvider';
import CmpSupportedLanguageProvider from './Service/CmpSupportedLanguageProvider';
import TCStringService from './Service/TCStringService';

/**
 * SoloCmp.
 */
class SoloCmp {

    private _DependencyInjectionManager = DependencyInjectionManager;
    private readonly isDebugEnabled: boolean;
    private readonly cmpVersion: number;
    private readonly cmpVendorListVersion: number;
    private readonly tcStringCookieName: string;
    private readonly cmpConfig: any;
    private readonly supportedLanguages: string[];

    /**
     * Constructor.
     *
     * @param {boolean} isDebugEnabled
     * @param {object} cmpConfig
     * @param {string[]} supportedLanguages
     * @param {number} cmpVersion
     * @param {number} cmpVendorListVersion
     * @param {string} tcStringCookieName
     */
    constructor(
        isDebugEnabled: boolean,
        cmpConfig: any,
        supportedLanguages: string[],
        cmpVersion: number,
        cmpVendorListVersion: number,
        tcStringCookieName: string,
    ) {

        this.isDebugEnabled = isDebugEnabled;
        this.cmpConfig = cmpConfig;
        this.supportedLanguages = supportedLanguages;
        this.cmpVersion = cmpVersion;
        this.cmpVendorListVersion = cmpVendorListVersion;
        this.tcStringCookieName = tcStringCookieName;

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
            .addServiceProvider(CmpConfigurationProvider.name, () => {

                return new CmpConfigurationProvider(this.cmpConfig);

            })
            .addServiceProvider(CmpSupportedLanguageProvider.name, () => {

                return new CmpSupportedLanguageProvider(this.supportedLanguages, navigator.language);

            })
            .addServiceProvider(TCStringService.name, (container: IContainer) => {

                return new TCStringService(
                    container[Cookie.name],
                    container[Logger.name],
                    container[CmpSupportedLanguageProvider.name],
                    this.cmpVersion,
                    this.cmpVendorListVersion,
                    this.tcStringCookieName,
                );

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

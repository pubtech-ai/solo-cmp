import {GVL} from '@iabtcf/core';
import {IContainer} from 'bottlejs';
import DependencyInjectionManager from './DependencyInjection/DependencyInjectionManager';
import EventDispatcher from './EventDispatcher/EventDispatcher';
import LoggerService from './Service/LoggerService';
import CookieService from './Service/CookieService';
import CmpConfigurationProvider from './Service/CmpConfigurationProvider';
import CmpSupportedLanguageProvider from './Service/CmpSupportedLanguageProvider';
import TCStringService from './Service/TCStringService';
import TCModelService from './Service/TCModelService';
import ACStringService from './Service/ACStringService';
import ACModelService from './Service/ACModelService';
import HttpRequestService from './Service/HttpRequestService';
import CmpApiProvider from './Service/CmpApiProvider';
import Orchestrator from './Service/Orchestrator';
import UIConstructor from './UIConstructor';
import CmpPreparatoryService from './Service/CmpPreparatoryService';
import ConsentGeneratorService from './Service/ConsentGeneratorService';
import AmpSubscriber from './EventSubscriber/AmpSubscriber';
import OpenCmpUISubscriber from './EventSubscriber/OpenCmpUISubscriber';
import ConsentsPersistSubscriber from './EventSubscriber/ConsentsPersistSubscriber';
import ConsentsGeneratorSubscriber from './EventSubscriber/ConsentsGeneratorSubscriber';
import CmpCallbackSubscriber from './EventSubscriber/CmpCallbackSubscriber';
import CmpApiSubscriber from './EventSubscriber/CmpApiSubscriber';

/**
 * SoloCmp.
 */
class SoloCmp {

    private _DependencyInjectionManager = DependencyInjectionManager;
    private readonly uiConstructor: UIConstructor;
    private readonly baseUrlVendorList: string;
    private readonly isDebugEnabled: boolean;
    private readonly cmpVersion: number;
    private readonly cmpVendorListVersion: number;
    private readonly cmpId: number;
    private readonly isServiceSpecific: boolean;
    private readonly tcStringCookieName: string;
    private readonly acStringLocalStorageName: string;
    private readonly cmpConfig: any;
    private readonly supportedLanguages: string[];
    private readonly initialHeightAmpCmpUi: string | null;
    private readonly enableBorderAmpCmpUi: boolean | null = null;

    /**
     * Constructor.
     *
     * @param {UIConstructor} uiConstructor
     * @param {boolean} isDebugEnabled
     * @param {object} cmpConfig
     * @param {string[]} supportedLanguages
     * @param {number} cmpVersion
     * @param {number} cmpVendorListVersion
     * @param {string} tcStringCookieName
     * @param {string} acStringLocalStorageName
     * @param {number} cmpId
     * @param {boolean} isServiceSpecific
     * @param {string} baseUrlVendorList
     * @param {string|null} initialHeightAmpCmpUi
     * @param {boolean|null} enableBorderAmpCmpUi
     */
    constructor(
        uiConstructor: UIConstructor,
        isDebugEnabled: boolean,
        cmpConfig: any,
        supportedLanguages: string[],
        cmpVersion: number,
        cmpVendorListVersion: number,
        tcStringCookieName: string,
        acStringLocalStorageName: string,
        cmpId: number,
        isServiceSpecific: boolean,
        baseUrlVendorList: string,
        initialHeightAmpCmpUi: string | null = null,
        enableBorderAmpCmpUi: boolean | null = null,
    ) {

        this.uiConstructor = uiConstructor;
        this.isDebugEnabled = isDebugEnabled;
        this.cmpConfig = cmpConfig;
        this.supportedLanguages = supportedLanguages;
        this.cmpVersion = cmpVersion;
        this.cmpVendorListVersion = cmpVendorListVersion;
        this.tcStringCookieName = tcStringCookieName;
        this.acStringLocalStorageName = acStringLocalStorageName;
        this.cmpId = cmpId;
        this.isServiceSpecific = isServiceSpecific;
        this.baseUrlVendorList = baseUrlVendorList;
        this.initialHeightAmpCmpUi = initialHeightAmpCmpUi;
        this.enableBorderAmpCmpUi = enableBorderAmpCmpUi;

        this.registerServices();
        this.registerSubscribers();

    }

    /**
     * Register all default services.
     */
    registerServices(): void {

        this._DependencyInjectionManager
            .addServiceProvider(LoggerService.getClassName(), () => {

                return new LoggerService(this.isDebugEnabled);

            })
            .addServiceProvider(CookieService.getClassName(), (container: IContainer) => {

                return new CookieService(container[LoggerService.getClassName()], window.location.hostname, document);

            })
            .addServiceProvider(CmpConfigurationProvider.getClassName(), () => {

                return new CmpConfigurationProvider(this.cmpConfig);

            })
            .addServiceProvider(CmpSupportedLanguageProvider.getClassName(), () => {

                return new CmpSupportedLanguageProvider(this.supportedLanguages, navigator.language);

            })
            .addServiceProvider(TCStringService.getClassName(), (container: IContainer) => {

                return new TCStringService(
                    container[CookieService.getClassName()],
                    container[LoggerService.getClassName()],
                    container[CmpSupportedLanguageProvider.getClassName()],
                    this.cmpVersion,
                    this.cmpVendorListVersion,
                    this.tcStringCookieName,
                );

            })
            .addServiceProvider(TCModelService.getClassName(), (container: IContainer) => {

                GVL.baseUrl = this.baseUrlVendorList;

                const gvl: GVL = new GVL();

                return new TCModelService(
                    container[TCStringService.getClassName()],
                    container[CmpSupportedLanguageProvider.getClassName()],
                    this.cmpId,
                    this.cmpVersion,
                    this.isServiceSpecific,
                    gvl,
                );

            })
            .addServiceProvider(ACStringService.getClassName(), (container: IContainer) => {

                return new ACStringService(
                    this.cmpVersion,
                    this.acStringLocalStorageName,
                    container[LoggerService.getClassName()],
                    localStorage,
                );

            })
            .addServiceProvider(ACModelService.getClassName(), (container: IContainer) => {

                return new ACModelService(
                    this.baseUrlVendorList,
                    container[ACStringService.getClassName()],
                    container[HttpRequestService.getClassName()],
                    container[LoggerService.getClassName()],
                );

            })
            .addServiceProvider(HttpRequestService.getClassName(), (container: IContainer) => {

                return new HttpRequestService();

            })
            .addServiceProvider(CmpApiProvider.getClassName(), (container: IContainer) => {

                return new CmpApiProvider(
                    this.cmpId,
                    this.cmpVersion,
                    this.isServiceSpecific,
                    container[ACStringService.getClassName()],
                );

            })
            .addServiceProvider(EventDispatcher.getClassName(), () => {

                return EventDispatcher.getInstance();

            })
            .addServiceProvider(Orchestrator.getClassName(), (container: IContainer) => {

                return new Orchestrator(
                    container[TCStringService.getClassName()],
                    container[ACStringService.getClassName()],
                    this.uiConstructor,
                    container[EventDispatcher.getClassName()],
                );

            })
            .addServiceProvider(CmpPreparatoryService.getClassName(), (container: IContainer) => {

                return new CmpPreparatoryService(
                    container[TCModelService.getClassName()],
                    container[ACModelService.getClassName()],
                    this.uiConstructor,
                    container[EventDispatcher.getClassName()],
                    container[LoggerService.getClassName()],
                );

            })
            .addServiceProvider(ConsentGeneratorService.getClassName(), (container: IContainer) => {

                return new ConsentGeneratorService(
                    container[TCStringService.getClassName()],
                    container[ACStringService.getClassName()],
                    container[EventDispatcher.getClassName()],
                );

            });

    }

    /**
     * Register all default subscribers.
     */
    registerSubscribers(): void {

        this._DependencyInjectionManager
            .addEventSubscriberProvider(OpenCmpUISubscriber.getClassName(), (container: IContainer) => {

                return new OpenCmpUISubscriber(container[CmpPreparatoryService.getClassName()]);

            })
            .addEventSubscriberProvider(ConsentsPersistSubscriber.getClassName(), (container: IContainer) => {

                return new ConsentsPersistSubscriber(
                    container[TCStringService.getClassName()],
                    container[ACStringService.getClassName()],
                );

            })
            .addEventSubscriberProvider(ConsentsGeneratorSubscriber.getClassName(), (container: IContainer) => {

                return new ConsentsGeneratorSubscriber(container[ConsentGeneratorService.getClassName()]);

            })
            .addEventSubscriberProvider(CmpCallbackSubscriber.getClassName(), (container: IContainer) => {

                return new CmpCallbackSubscriber(container[CmpConfigurationProvider.getClassName()]);

            })
            .addEventSubscriberProvider(CmpApiSubscriber.getClassName(), (container: IContainer) => {

                return new CmpApiSubscriber(container[CmpApiProvider.getClassName()]);

            })
            .addEventSubscriberProvider(AmpSubscriber.getClassName(), (container: IContainer) => {

                const cmpConfigurationProvider: CmpConfigurationProvider =
                    container[CmpConfigurationProvider.getClassName()];

                return new AmpSubscriber(
                    cmpConfigurationProvider.cmpConfiguration.isAmp,
                    window,
                    this.initialHeightAmpCmpUi,
                    this.enableBorderAmpCmpUi,
                );

            });

    }

    /**
     * Return the DependencyInjectionManager instance.
     *
     * @return {DependencyInjectionManager}
     */
    getDependencyInjectionManager(): typeof DependencyInjectionManager {

        return this._DependencyInjectionManager;

    }

    /**
     * Call the Orchestrator.initCmp() method.
     */
    init(): void {

        this._DependencyInjectionManager.getService(Orchestrator.getClassName()).initCmp();

    }

}

export default SoloCmp;

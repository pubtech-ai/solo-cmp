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
import * as cmpstub from '@iabtcf/stub';

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
        cmpstub();

    }

    /**
     * Register all default services.
     */
    registerServices(): void {

        this._DependencyInjectionManager
            .addServiceProvider(LoggerService.name, () => {

                return new LoggerService(this.isDebugEnabled);

            })
            .addServiceProvider(CookieService.name, (container: IContainer) => {

                return new CookieService(container[LoggerService.name], window.location.hostname, document);

            })
            .addServiceProvider(CmpConfigurationProvider.name, () => {

                return new CmpConfigurationProvider(this.cmpConfig);

            })
            .addServiceProvider(CmpSupportedLanguageProvider.name, () => {

                return new CmpSupportedLanguageProvider(this.supportedLanguages, navigator.language);

            })
            .addServiceProvider(TCStringService.name, (container: IContainer) => {

                return new TCStringService(
                    container[CookieService.name],
                    container[LoggerService.name],
                    container[CmpSupportedLanguageProvider.name],
                    this.cmpVersion,
                    this.cmpVendorListVersion,
                    this.tcStringCookieName,
                );

            })
            .addServiceProvider(TCModelService.name, (container: IContainer) => {

                GVL.baseUrl = this.baseUrlVendorList;

                const gvl: GVL = new GVL();

                return new TCModelService(
                    container[TCStringService.name],
                    container[CmpSupportedLanguageProvider.name],
                    this.cmpId,
                    this.cmpVersion,
                    this.isServiceSpecific,
                    gvl,
                );

            })
            .addServiceProvider(ACStringService.name, (container: IContainer) => {

                return new ACStringService(
                    this.cmpVersion,
                    this.acStringLocalStorageName,
                    container[LoggerService.name],
                    localStorage,
                );

            })
            .addServiceProvider(ACModelService.name, (container: IContainer) => {

                return new ACModelService(
                    this.baseUrlVendorList,
                    container[ACStringService.name],
                    container[HttpRequestService.name],
                    container[LoggerService.name],
                );

            })
            .addServiceProvider(HttpRequestService.name, (container: IContainer) => {

                return new HttpRequestService();

            })
            .addServiceProvider(CmpApiProvider.name, (container: IContainer) => {

                return new CmpApiProvider(
                    this.cmpId,
                    this.cmpVersion,
                    this.isServiceSpecific,
                    container[ACStringService.name],
                );

            })
            .addServiceProvider(EventDispatcher.name, () => {

                return EventDispatcher.getInstance();

            })
            .addServiceProvider(Orchestrator.name, (container: IContainer) => {

                return new Orchestrator(
                    container[TCStringService.name],
                    container[ACStringService.name],
                    this.uiConstructor,
                    container[EventDispatcher.name],
                );

            })
            .addServiceProvider(CmpPreparatoryService.name, (container: IContainer) => {

                return new CmpPreparatoryService(
                    container[TCModelService.name],
                    container[ACModelService.name],
                    this.uiConstructor,
                    container[EventDispatcher.name],
                    container[LoggerService.name],
                );

            })
            .addServiceProvider(ConsentGeneratorService.name, (container: IContainer) => {

                return new ConsentGeneratorService(
                    container[TCStringService.name],
                    container[ACStringService.name],
                    container[EventDispatcher.name],
                );

            });

    }

    /**
     * Register all default subscribers.
     */
    registerSubscribers(): void {

        this._DependencyInjectionManager
            .addEventSubscriberProvider(OpenCmpUISubscriber.name, (container: IContainer) => {

                return new OpenCmpUISubscriber(container[CmpPreparatoryService.name]);

            })
            .addEventSubscriberProvider(ConsentsPersistSubscriber.name, (container: IContainer) => {

                return new ConsentsPersistSubscriber(container[TCStringService.name], container[ACStringService.name]);

            })
            .addEventSubscriberProvider(ConsentsGeneratorSubscriber.name, (container: IContainer) => {

                return new ConsentsGeneratorSubscriber(container[ConsentGeneratorService.name]);

            })
            .addEventSubscriberProvider(CmpCallbackSubscriber.name, (container: IContainer) => {

                return new CmpCallbackSubscriber(container[CmpConfigurationProvider.name]);

            })
            .addEventSubscriberProvider(CmpApiSubscriber.name, (container: IContainer) => {

                return new CmpApiSubscriber(container[CmpApiProvider.name]);

            })
            .addEventSubscriberProvider(AmpSubscriber.name, (container: IContainer) => {

                const cmpConfigurationProvider: CmpConfigurationProvider = container[CmpConfigurationProvider.name];

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

        this._DependencyInjectionManager.getService(Orchestrator.name).initCmp();

    }

}

export default SoloCmp;

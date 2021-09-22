import {SoloCmpDto} from './Dto';
import {GVL} from '@iabtcf/core';
import {IContainer} from 'bottlejs';
import DependencyInjectionManager from './DependencyInjection/DependencyInjectionManager';
import {EventDispatcher} from './EventDispatcher';
import {UIConstructor} from './UIConstructor';

import {
    AmpSubscriber,
    OpenCmpUISubscriber,
    ConsentsPersistSubscriber,
    ConsentsGeneratorSubscriber,
    CmpCallbackSubscriber,
    CmpApiSubscriber,
} from './EventSubscriber';

import {
    LoggerService,
    CookieService,
    CmpConfigurationProvider,
    CmpSupportedLanguageProvider,
    TCStringService,
    TCModelService,
    ACStringService,
    ACModelService,
    HttpRequestService,
    CmpApiProvider,
    CmpPreparatoryService,
    ConsentGeneratorService,
    Orchestrator,
} from './Service';

/**
 * SoloCmp.
 */
export class SoloCmp {

    private _DependencyInjectionManager = DependencyInjectionManager;
    private readonly uiConstructor: UIConstructor;
    private readonly baseUrlVendorList: string;
    private readonly isDebugEnabled: boolean;
    private readonly cmpVersion: number;
    private readonly cmpVendorListVersion: number;
    private readonly acStringVersion: number;
    private readonly cmpId: number;
    private readonly isServiceSpecific: boolean;
    private readonly tcStringCookieName: string;
    private readonly acStringLocalStorageName: string;
    private readonly cmpConfig: any;
    private readonly supportedLanguages: string[];
    private readonly initialHeightAmpCmpUi: string | null;
    private readonly enableBorderAmpCmpUi: boolean | null = null;
    private readonly skipACStringCheck: boolean;

    /**
     * Constructor.
     *
     * @param {SoloCmpDto} soloCmpDto
     */
    constructor(soloCmpDto: SoloCmpDto) {

        this.uiConstructor = soloCmpDto.uiConstructor;
        this.isDebugEnabled = soloCmpDto.isDebugEnabled;
        this.cmpConfig = soloCmpDto.cmpConfig;
        this.supportedLanguages = soloCmpDto.supportedLanguages;
        this.cmpVersion = soloCmpDto.cmpVersion;
        this.cmpVendorListVersion = soloCmpDto.cmpVendorListVersion;
        this.acStringVersion = soloCmpDto.acStringVersion;
        this.tcStringCookieName = soloCmpDto.tcStringCookieName;
        this.acStringLocalStorageName = soloCmpDto.acStringLocalStorageName;
        this.cmpId = soloCmpDto.cmpId;
        this.isServiceSpecific = soloCmpDto.isServiceSpecific;
        this.baseUrlVendorList = soloCmpDto.baseUrlVendorList;
        this.initialHeightAmpCmpUi = soloCmpDto.initialHeightAmpCmpUi;
        this.enableBorderAmpCmpUi = soloCmpDto.enableBorderAmpCmpUi;
        this.skipACStringCheck = soloCmpDto.skipACStringCheck;

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

                /**
                 * @return {GVL}
                 */
                const createGVL = (): GVL => {

                    GVL.baseUrl = this.baseUrlVendorList;

                    return new GVL();

                };

                return new TCModelService(
                    container[TCStringService.getClassName()],
                    container[CmpSupportedLanguageProvider.getClassName()],
                    this.cmpId,
                    this.cmpVersion,
                    this.isServiceSpecific,
                    createGVL.bind(this),
                );

            })
            .addServiceProvider(ACStringService.getClassName(), (container: IContainer) => {

                let fetchedLocalStorage = {};

                try {

                    fetchedLocalStorage = localStorage;

                } catch (e) {

                    const loggerService: LoggerService = container[LoggerService.getClassName()];
                    loggerService.debug('localStorage disabled for the current environment.', e);

                }

                return new ACStringService(
                    this.acStringVersion,
                    this.acStringLocalStorageName,
                    container[LoggerService.getClassName()],
                    fetchedLocalStorage as Storage,
                    this.skipACStringCheck,
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
                    container[LoggerService.getClassName()],
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

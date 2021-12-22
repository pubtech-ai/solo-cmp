import DependencyInjectionManager from './DependencyInjection/DependencyInjectionManager';
import {GVL, TCModel} from '@iabtcf/core';
import {IContainer} from 'bottlejs';
import {EventDispatcher} from './EventDispatcher';
import {UIConstructor} from './UIConstructor';
import {SoloCmpDto} from './Dto';

import {
    AmpSubscriber,
    OpenCmpUISubscriber,
    ConsentsGeneratorSubscriber,
    CmpCallbackSubscriber,
    CmpApiSubscriber,
} from './EventSubscriber';

import {
    ConsentReadyEvent,
    OpenCmpUIEvent,
} from './Event';

import {
    LoggerService,
    CookieService,
    CmpSupportedLanguageProvider,
    TCStringService,
    TCModelService,
    ACStringService,
    ACModelService,
    HttpRequestService,
    CmpApiProvider,
    CmpPreparatoryService,
    ConsentGeneratorService,
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
    private readonly isAmp: boolean;
    private readonly onConsentAds: (event: ConsentReadyEvent, tcModel: TCModel) => void;
    private readonly supportedLanguages: string[];
    private readonly userLanguage: string;
    private readonly initialHeightAmpCmpUi: string | null;
    private readonly enableBorderAmpCmpUi: boolean | null = null;
    private readonly skipACStringCheck: boolean;
    private readonly isLegitimateInterestDisabled: boolean;

    /**
     * Constructor.
     *
     * @param {SoloCmpDto} soloCmpDto
     */
    constructor(soloCmpDto: SoloCmpDto) {

        this.uiConstructor = soloCmpDto.uiConstructor;
        this.isDebugEnabled = soloCmpDto.isDebugEnabled;
        this.isAmp = soloCmpDto.isAmp;
        this.onConsentAds = soloCmpDto.onConsentAds;
        this.supportedLanguages = soloCmpDto.supportedLanguages;
        this.userLanguage = soloCmpDto.userLanguage;
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
        this.isLegitimateInterestDisabled = soloCmpDto.isLegitimateInterestDisabled;

        this.registerServices();
        this.registerSubscribers();

    }

    /**
     * Register all default services.
     */
    private registerServices(): void {

        this._DependencyInjectionManager
            .addServiceProvider(LoggerService.getClassName(), () => {

                return new LoggerService(this.isDebugEnabled);

            })
            .addServiceProvider(CookieService.getClassName(), (container: IContainer) => {

                return new CookieService(container[LoggerService.getClassName()], window.location.hostname, document);

            })
            .addServiceProvider(CmpSupportedLanguageProvider.getClassName(), () => {

                return new CmpSupportedLanguageProvider(this.supportedLanguages, this.userLanguage);

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
            .addServiceProvider(HttpRequestService.getClassName(), () => {

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
            .addServiceProvider(CmpPreparatoryService.getClassName(), (container: IContainer) => {

                return new CmpPreparatoryService(
                    container[TCModelService.getClassName()],
                    container[ACModelService.getClassName()],
                    this.uiConstructor,
                    container[EventDispatcher.getClassName()],
                    container[LoggerService.getClassName()],
                    this.isLegitimateInterestDisabled,
                );

            })
            .addServiceProvider(ConsentGeneratorService.getClassName(), (container: IContainer) => {

                return new ConsentGeneratorService(
                    container[TCStringService.getClassName()],
                    container[ACStringService.getClassName()],
                    container[EventDispatcher.getClassName()],
                    this.isLegitimateInterestDisabled,
                );

            });

    }

    /**
     * Register all default subscribers.
     */
    private registerSubscribers(): void {

        this._DependencyInjectionManager
            .addEventSubscriberProvider(OpenCmpUISubscriber.getClassName(), (container: IContainer) => {

                return new OpenCmpUISubscriber(container[CmpPreparatoryService.getClassName()]);

            })
            .addEventSubscriberProvider(ConsentsGeneratorSubscriber.getClassName(), (container: IContainer) => {

                return new ConsentsGeneratorSubscriber(container[ConsentGeneratorService.getClassName()]);

            })
            .addEventSubscriberProvider(CmpCallbackSubscriber.getClassName(), () => {

                return new CmpCallbackSubscriber(this.onConsentAds);

            })
            .addEventSubscriberProvider(CmpApiSubscriber.getClassName(), (container: IContainer) => {

                return new CmpApiSubscriber(container[CmpApiProvider.getClassName()]);

            })
            .addEventSubscriberProvider(AmpSubscriber.getClassName(), () => {

                return new AmpSubscriber(
                    this.isAmp,
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
     * This logic decide if is required to render the CMP UI or dispatch directly the ConsentReadyEvent.
     * The tcString and acString are useful to the implementation of AMP version of the CMP.
     *
     * @param {string|null} tcString
     * @param {string|null} acString
     * @param {CallableFunction|null} additionalValidationCallback
     */
    init(
        tcString: string|null = null,
        acString: string|null = null,
        additionalValidationCallback: (() => boolean)|null = null,
    ): void {

        const tcStringService = this._DependencyInjectionManager.getService(TCStringService.getClassName());
        const acStringService = this._DependencyInjectionManager.getService(ACStringService.getClassName());

        tcString = typeof tcString == 'string' ? tcString : tcStringService.retrieveTCString();
        acString = typeof acString == 'string' ? acString : acStringService.retrieveACString();

        const eventDispatcher = this._DependencyInjectionManager.getService(EventDispatcher.getClassName());

        const isAdditionalValidationCallbackValid: boolean = (typeof additionalValidationCallback == 'function' ? additionalValidationCallback() : true);

        if (
            tcStringService.isValidTCString(tcString) &&
            acStringService.isValidACString(acString) &&
            isAdditionalValidationCallbackValid) {

            if (this.isAmp) {

                eventDispatcher.dispatch(new OpenCmpUIEvent(tcString as string, acString as string));

            } else {

                const consentReadyEvent = new ConsentReadyEvent(tcString as string, acString as string);

                eventDispatcher.dispatch(consentReadyEvent);

                this.uiConstructor.buildOpenCmpButtonAndRender();

            }

        } else {

            if (tcString && tcString.length > 0) {

                tcStringService.removeTCString();
                acStringService.removeACString();

            }

            eventDispatcher.dispatch(new OpenCmpUIEvent());

        }

    }

}

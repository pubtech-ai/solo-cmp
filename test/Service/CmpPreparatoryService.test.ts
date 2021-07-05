import { TCModel } from '@iabtcf/core';
import { TCModelFactory } from '@iabtcf/testing';
import {
    ACModelService,
    ACStringService,
    CmpPreparatoryService,
    CmpSupportedLanguageProvider,
    CookieService,
    HttpRequestService,
    LoggerService,
    TCModelService,
    TCStringService,
} from '../../src/Service';
import { ConsentRequiredEvent, EventDispatcher, UIConstructor } from '../../src';
const sinon = require('sinon');

describe('CmpPreparatoryService suit test', () => {
    const localStorage: Storage = {
        length: 0,
        setItem(key, value): string {
            return value;
        },
        clear() {},
        key(index: number): string | null {
            return null;
        },
        removeItem(key: string): void {},
        getItem(key: string): string | null {
            return null;
        },
    };

    const mockLocalStorage = sinon.mock(localStorage);

    it('CmpPreparatoryService prepareAndRender call UIConstructor.buildUIAndRender test', (done) => {
        const loggerService: LoggerService = new LoggerService(false);

        const acStringService = new ACStringService(1, 'solo-cmp-ac-string', loggerService, mockLocalStorage);
        const httpRequestService = new HttpRequestService();

        const jsonContent = [
            {
                provider_id: 39,
                provider_name: 'Digilant',
                policy_url: 'https://www.digilant.com/privacy-policy/',
                domains: 'wtp101.com',
            },
            {
                provider_id: 43,
                provider_name: 'AdPredictive',
                policy_url: 'http://adpredictive.com/optout/',
                domains: 'adpredictive.com platform.adpredictive.io',
            },
        ];

        sinon
            .stub(httpRequestService, 'makeRequest')
            .withArgs('GET', 'https://pubtech-ai-solo-cmp.com/google-vendor-list.json')
            .callsFake(function fakeMakeRequest() {
                return new Promise((resolve, reject) => {
                    const response = {
                        responseText: JSON.stringify(jsonContent),
                    };

                    resolve(response);
                });
            });

        const acModelService = new ACModelService(
            'https://pubtech-ai-solo-cmp.com',
            acStringService,
            httpRequestService,
            loggerService,
        );

        const cookieService: CookieService = new CookieService(loggerService, 'solocmp.com', document);

        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['it', 'fr', 'en'], 'it-IT');

        const tcModel: TCModel = (TCModelFactory.withGVL() as unknown) as TCModel;

        const tcStringService = new TCStringService(
            cookieService,
            loggerService,
            cmpSupportedLanguageProvider,
            Number(tcModel.cmpVersion),
            Number(tcModel.vendorListVersion),
            'solo-cmp-tc-string',
        );

        const tcModelService = new TCModelService(
            tcStringService,
            cmpSupportedLanguageProvider,
            Number(tcModel.cmpId),
            Number(tcModel.cmpVersion),
            true,
            tcModel.gvl,
        );

        sinon
            .stub(tcModelService, 'fetchDataAndBuildTCModel')
            .withArgs('')
            .callsFake(function fakeMakeRequest() {
                return new Promise((resolve, reject) => {
                    resolve(tcModel);
                });
            });

        const uiConstructor = new UIConstructor(
            document,
            'solo-cmp-dom-id',
            () => {
                done();
            },
            () => {},
        );

        const eventDispatcher = EventDispatcher.getInstance();

        const cmpPreparatoryService = new CmpPreparatoryService(
            tcModelService,
            acModelService,
            uiConstructor,
            eventDispatcher,
            loggerService,
        );

        cmpPreparatoryService.prepareAndRender('', '');
    });

    it('CmpPreparatoryService prepareAndRender dispatch ConsentRequiredEvent test', (done) => {
        const loggerService: LoggerService = new LoggerService(false);

        const acStringService = new ACStringService(1, 'solo-cmp-ac-string', loggerService, mockLocalStorage);
        const httpRequestService = new HttpRequestService();

        const jsonContent = [
            {
                provider_id: 39,
                provider_name: 'Digilant',
                policy_url: 'https://www.digilant.com/privacy-policy/',
                domains: 'wtp101.com',
            },
            {
                provider_id: 43,
                provider_name: 'AdPredictive',
                policy_url: 'http://adpredictive.com/optout/',
                domains: 'adpredictive.com platform.adpredictive.io',
            },
        ];

        sinon
            .stub(httpRequestService, 'makeRequest')
            .withArgs('GET', 'https://pubtech-ai-solo-cmp.com/google-vendor-list.json')
            .callsFake(function fakeMakeRequest() {
                return new Promise((resolve, reject) => {
                    const response = {
                        responseText: JSON.stringify(jsonContent),
                    };

                    resolve(response);
                });
            });

        const acModelService = new ACModelService(
            'https://pubtech-ai-solo-cmp.com',
            acStringService,
            httpRequestService,
            loggerService,
        );

        const cookieService: CookieService = new CookieService(loggerService, 'solocmp.com', document);

        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['it', 'fr', 'en'], 'it-IT');

        const tcModel: TCModel = (TCModelFactory.withGVL() as unknown) as TCModel;

        const tcStringService = new TCStringService(
            cookieService,
            loggerService,
            cmpSupportedLanguageProvider,
            Number(tcModel.cmpVersion),
            Number(tcModel.vendorListVersion),
            'solo-cmp-tc-string',
        );

        const tcModelService = new TCModelService(
            tcStringService,
            cmpSupportedLanguageProvider,
            Number(tcModel.cmpId),
            Number(tcModel.cmpVersion),
            true,
            tcModel.gvl,
        );

        sinon
            .stub(tcModelService, 'fetchDataAndBuildTCModel')
            .withArgs('')
            .callsFake(function fakeMakeRequest() {
                return new Promise((resolve, reject) => {
                    resolve(tcModel);
                });
            });

        const uiConstructor = new UIConstructor(
            document,
            'solo-cmp-dom-id',
            () => {},
            () => {},
        );

        const subscriber = {
            method: function (eventObject) {
                done();
            },
        };

        const eventDispatcher = EventDispatcher.getInstance();

        const subscription = eventDispatcher.subscribe('SubscriberTest', ConsentRequiredEvent.name, subscriber.method);

        const cmpPreparatoryService = new CmpPreparatoryService(
            tcModelService,
            acModelService,
            uiConstructor,
            eventDispatcher,
            loggerService,
        );

        cmpPreparatoryService.prepareAndRender('', '').then(() => {
            subscription.unsubscribe();
        });
    });
});

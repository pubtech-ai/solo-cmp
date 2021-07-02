import ACModelService from '../../src/Service/ACModelService';
import TCModelService from '../../src/Service/TCModelService';
import UIConstructor from '../../src/UIConstructor';
import LoggerService from '../../src/Service/LoggerService';
import EventDispatcher from '../../src/EventDispatcher/EventDispatcher';
import CmpPreparatoryService from '../../src/Service/CmpPreparatoryService';
import HttpRequestService from '../../src/Service/HttpRequestService';
import ACStringService from '../../src/Service/ACStringService';
import CmpSupportedLanguageProvider from '../../src/Service/CmpSupportedLanguageProvider';
import { TCModel } from '@iabtcf/core';
import TCStringService from '../../src/Service/TCStringService';
import CookieService from '../../src/Service/CookieService';
import { TCModelFactory } from '@iabtcf/testing';
import ConsentRequiredEvent from '../../src/Event/ConsentRequiredEvent';
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

        eventDispatcher.subscribe('SubscriberTest', ConsentRequiredEvent.name, subscriber.method);

        const cmpPreparatoryService = new CmpPreparatoryService(
            tcModelService,
            acModelService,
            uiConstructor,
            eventDispatcher,
            loggerService,
        );

        cmpPreparatoryService.prepareAndRender('', '');
    });
});

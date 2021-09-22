import {expect} from 'chai';
const sinon = require('sinon');
import {TCModelFactory} from '@iabtcf/testing';
import {TCModel} from '@iabtcf/core';
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
import {EventDispatcher, OpenCmpUIEvent, OpenCmpUISubscriber, UIConstructor} from '../../src';

describe('OpenCmpUISubscriber suit test', () => {

    const getCmpPreparatoryService = function() {

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
            () => tcModel.gvl,
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

        const eventDispatcher = EventDispatcher.getInstance();

        return new CmpPreparatoryService(tcModelService, acModelService, uiConstructor, eventDispatcher, loggerService);

    };

    it('OpenCmpUISubscriber getSubscribedEvents registered for OpenCmpUIEvent test', () => {

        const openCmpUISubscriber = new OpenCmpUISubscriber(getCmpPreparatoryService());

        expect(openCmpUISubscriber.getSubscribedEvents()).to.have.own.property(OpenCmpUIEvent.name);

    });

    it('OpenCmpUISubscriber OpenCmpUIEvent call CmpPreparatoryService test', () => {

        const cmpPreparatoryService = getCmpPreparatoryService();

        const mock = sinon.mock(cmpPreparatoryService);

        const openCmpUIEvent = new OpenCmpUIEvent('abc', 'cba');

        mock.expects('prepareAndRender').once().withArgs(openCmpUIEvent.tcString, openCmpUIEvent.acString);

        const openCmpUISubscriber = new OpenCmpUISubscriber(cmpPreparatoryService);

        openCmpUISubscriber[openCmpUISubscriber.getSubscribedEvents()[OpenCmpUIEvent.name]](openCmpUIEvent);

        mock.verify();

    });

});

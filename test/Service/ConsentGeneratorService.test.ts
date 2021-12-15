import {expect} from 'chai';
const sinon = require('sinon');
import {TCModel} from '@iabtcf/core';
// @ts-ignore
import {getACModelByFixture, getTCModelByFixture} from '../UIChoicesBridge/UIChoicesBridgeDtoBuilder.test';
import {
    ACStringService,
    CmpSupportedLanguageProvider,
    ConsentGeneratorService,
    CookieService,
    LoggerService,
    TCStringService,
} from '../../src/Service';
import {ACModel} from '../../src/Entity';
import {EventDispatcher} from '../../src/EventDispatcher';
import {ConsentPersistEvent, ConsentReadyEvent} from '../../src/Event';
import {UIChoicesBridgeDtoBuilder} from '../../src/UIChoicesBridge';
import {SoloCmpDataBundle} from '../../src';

describe('ConsentGeneratorService suit test', () => {

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

    it('ConsentGeneratorService generate and persist consent strings fire ConsentReadyEvent test', (done) => {

        const loggerService: LoggerService = new LoggerService(false);

        const cookieService: CookieService = new CookieService(loggerService, 'solocmp.com', document);

        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['it', 'fr', 'en'], 'it-IT');

        const tcModel: TCModel = getTCModelByFixture();
        const acModel: ACModel = getACModelByFixture();

        const tcStringService = new TCStringService(
            cookieService,
            loggerService,
            cmpSupportedLanguageProvider,
            Number(tcModel.cmpVersion),
            Number(tcModel.vendorListVersion),
            'solo-cmp-tc-string',
            false,
        );

        const acStringService = new ACStringService(
            Number(tcModel.cmpVersion),
            'solo-cmp-ac-string',
            loggerService,
            mockLocalStorage,
            false,
        );

        const subscriber = {
            method: function(eventObject) {

                expect(eventObject.tcString.length > 0).to.be.true;

                expect(eventObject.acString.length > 0).to.be.true;

                done();

            },
        };

        const eventDispatcher = EventDispatcher.getInstance();

        const subscription = eventDispatcher.subscribe('SubscriberTest', ConsentReadyEvent.name, subscriber.method);

        const consentGeneratorService = new ConsentGeneratorService(tcStringService, acStringService, eventDispatcher);

        const uiChoicesBridgeDto = new UIChoicesBridgeDtoBuilder(
            tcModel,
            acModel,
            true,
            false,
        ).createUIChoicesBridgeDto();

        consentGeneratorService.generateAndPersistConsent(
            new SoloCmpDataBundle(uiChoicesBridgeDto, tcModel, acModel, true),
        );

        subscription.unsubscribe();

    });

    it('ConsentGeneratorService generate and persist consent strings fire ConsentPersistEvent test', (done) => {

        const loggerService: LoggerService = new LoggerService(false);

        const cookieService: CookieService = new CookieService(loggerService, 'solocmp.com', document);

        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['it', 'fr', 'en'], 'it-IT');

        const tcModel: TCModel = getTCModelByFixture();
        const acModel: ACModel = getACModelByFixture();

        const tcStringService = new TCStringService(
            cookieService,
            loggerService,
            cmpSupportedLanguageProvider,
            Number(tcModel.cmpVersion),
            Number(tcModel.vendorListVersion),
            'solo-cmp-tc-string',
            false,
        );

        const acStringService = new ACStringService(
            Number(tcModel.cmpVersion),
            'solo-cmp-ac-string',
            loggerService,
            mockLocalStorage,
            false,
        );

        const subscriber = {
            method: function(eventObject) {

                expect(eventObject.tcString.length > 0).to.be.true;

                expect(eventObject.acString.length > 0).to.be.true;

                done();

            },
        };

        const eventDispatcher = EventDispatcher.getInstance();

        eventDispatcher.subscribe('SubscriberTest', ConsentPersistEvent.name, subscriber.method);

        const consentGeneratorService = new ConsentGeneratorService(tcStringService, acStringService, eventDispatcher);

        const uiChoicesBridgeDto = new UIChoicesBridgeDtoBuilder(
            tcModel,
            acModel,
            true,
            false,
        ).createUIChoicesBridgeDto();

        consentGeneratorService.generateAndPersistConsent(
            new SoloCmpDataBundle(uiChoicesBridgeDto, tcModel, acModel, true),
        );

    });

});

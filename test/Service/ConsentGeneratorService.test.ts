import {expect} from 'chai';
const sinon = require('sinon');
import {TCModel, TCString} from '@iabtcf/core';
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
import {ConsentReadyEvent} from '../../src/Event';
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

    it('ConsentGeneratorService generate and persist consent strings fire ConsentReadyEvent and call persist for strings test', () => {

        const loggerService: LoggerService = new LoggerService(false);

        const cookieService: CookieService = new CookieService(loggerService, 'solocmp.com', document);

        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['it', 'fr', 'en'], 'it-IT');

        const tcModel: TCModel = getTCModelByFixture();
        const acModel: ACModel = getACModelByFixture();

        const tcStringSpy = sinon.spy(TCStringService.prototype, 'persistTCString');
        const acStringSpy = sinon.spy(ACStringService.prototype, 'persistACString');

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

        sinon.assert.calledOnce(tcStringSpy);
        sinon.assert.calledOnce(acStringSpy);

        subscription.unsubscribe();

    });

});

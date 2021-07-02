import { expect } from 'chai';
const sinon = require('sinon');
import { TCModel } from '@iabtcf/core';
import LoggerService from '../../src/Service/LoggerService';
import ACStringService from '../../src/Service/ACStringService';
import CookieService from '../../src/Service/CookieService';
import CmpSupportedLanguageProvider from '../../src/Service/CmpSupportedLanguageProvider';
import TCStringService from '../../src/Service/TCStringService';
import ConsentGeneratorService from '../../src/Service/ConsentGeneratorService';
import EventDispatcher from '../../src/EventDispatcher/EventDispatcher';
import ConsentReadyEvent from '../../src/Event/ConsentReadyEvent';
import ACModel from '../../src/Entity/ACModel';
import UIChoicesParser from '../../src/UIChoicesBridge/UIChoicesParser';
import ConsentPersistEvent from '../../src/Event/ConsentPersistEvent';
import UIChoicesBridgeDtoBuilder from '../../src/UIChoicesBridge/UIChoicesBridgeDtoBuilder';
//@ts-ignore
import { getACModelByFixture, getTCModelByFixture } from '../UIChoicesBridge/UIChoicesBridgeDtoBuilder.test';
import SoloCmpDataBundle from '../../src/SoloCmpDataBundle';

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
        );

        const acStringService = new ACStringService(
            Number(tcModel.cmpVersion),
            'solo-cmp-ac-string',
            loggerService,
            mockLocalStorage,
        );

        const subscriber = {
            method: function (eventObject) {
                expect(eventObject.tcString.length > 0).to.be.true;

                expect(eventObject.acString.length > 0).to.be.true;

                done();
            },
        };

        const eventDispatcher = EventDispatcher.getInstance();

        const subscription = eventDispatcher.subscribe('SubscriberTest', ConsentReadyEvent.name, subscriber.method);

        const consentGeneratorService = new ConsentGeneratorService(tcStringService, acStringService, eventDispatcher);

        const uiChoicesBridgeDto = new UIChoicesBridgeDtoBuilder(tcModel, acModel).createUIChoicesBridgeDto();

        consentGeneratorService.generateAndPersistConsent(
            uiChoicesBridgeDto,
            new SoloCmpDataBundle(uiChoicesBridgeDto, tcModel, acModel),
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
        );

        const acStringService = new ACStringService(
            Number(tcModel.cmpVersion),
            'solo-cmp-ac-string',
            loggerService,
            mockLocalStorage,
        );

        const subscriber = {
            method: function (eventObject) {
                expect(eventObject.tcString.length > 0).to.be.true;

                expect(eventObject.acString.length > 0).to.be.true;

                done();
            },
        };

        const eventDispatcher = EventDispatcher.getInstance();

        eventDispatcher.subscribe('SubscriberTest', ConsentPersistEvent.name, subscriber.method);

        const consentGeneratorService = new ConsentGeneratorService(tcStringService, acStringService, eventDispatcher);

        const uiChoicesBridgeDto = new UIChoicesBridgeDtoBuilder(tcModel, acModel).createUIChoicesBridgeDto();

        consentGeneratorService.generateAndPersistConsent(
            uiChoicesBridgeDto,
            new SoloCmpDataBundle(uiChoicesBridgeDto, tcModel, acModel),
        );
    });
});

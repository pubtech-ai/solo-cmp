import { expect } from 'chai';
const sinon = require('sinon');
import TCStringService from '../../src/Service/TCStringService';
import ACStringService from '../../src/Service/ACStringService';
import CmpSupportedLanguageProvider from '../../src/Service/CmpSupportedLanguageProvider';
import LoggerService from '../../src/Service/LoggerService';
import CookieService from '../../src/Service/CookieService';
import ConsentGeneratorService from '../../src/Service/ConsentGeneratorService';
import EventDispatcher from '../../src/EventDispatcher/EventDispatcher';
import ApplyConsentEvent from '../../src/Event/ApplyConsentEvent';
import AcceptAllEvent from '../../src/Event/AcceptAllEvent';
import ConsentsGeneratorSubscriber from '../../src/EventSubscriber/ConsentsGeneratorSubscriber';
import { TCModelFactory } from '@iabtcf/testing';
import ACModel from '../../src/Entity/ACModel';
import UIChoicesBridgeDtoBuilder from '../../src/UIChoicesBridge/UIChoicesBridgeDtoBuilder';

describe('ConsentsGeneratorSubscriber suit test', () => {
    const loggerService: LoggerService = new LoggerService(false);

    const cookieService: CookieService = new CookieService(loggerService, 'solocmp.com', document);

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

    const getConsentsGeneratorService = function () {
        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['it', 'fr', 'en'], 'it-IT');

        const acStringService = new ACStringService(1, 'solo-cmp-ac-string', loggerService, mockLocalStorage);
        const tcStringService = new TCStringService(
            cookieService,
            loggerService,
            cmpSupportedLanguageProvider,
            1,
            1,
            'solo-cmp-tc-string',
        );

        return new ConsentGeneratorService(tcStringService, acStringService, EventDispatcher.getInstance());
    };

    it('ConsentsGeneratorSubscriber getSubscribedEvents registered for ApplyConsentEvent and AcceptAllEvent test', () => {
        const consentGeneratorSubscriber = new ConsentsGeneratorSubscriber(getConsentsGeneratorService());

        expect(consentGeneratorSubscriber.getSubscribedEvents()).to.have.own.property(ApplyConsentEvent.name);
        expect(consentGeneratorSubscriber.getSubscribedEvents()).to.have.own.property(AcceptAllEvent.name);
    });

    it('ConsentsGeneratorSubscriber ApplyConsentEvent call ConsentGeneratorService test', () => {
        const tcModel = TCModelFactory.withGVL();
        const acModel = new ACModel([]);

        const uiChoicesBridgeDto = new UIChoicesBridgeDtoBuilder(tcModel, acModel).createUIChoicesBridgeDto();

        const applyConsentEvent = new ApplyConsentEvent(uiChoicesBridgeDto);

        const consentGeneratorService = getConsentsGeneratorService();

        const mock = sinon.mock(consentGeneratorService);

        mock.expects('generateAndPersistConsent').once().withArgs(applyConsentEvent.uiChoicesBridgeDto);

        const consentGeneratorSubscriber = new ConsentsGeneratorSubscriber(consentGeneratorService);

        consentGeneratorSubscriber[consentGeneratorSubscriber.getSubscribedEvents()[ApplyConsentEvent.name]](
            applyConsentEvent,
        );

        mock.verify();
    });

    it('ConsentsGeneratorSubscriber AcceptAllEvent call ConsentGeneratorService generate consents with all enabled test', () => {
        const acceptAllEvent = new AcceptAllEvent();

        const consentGeneratorService = getConsentsGeneratorService();

        const mock = sinon.mock(consentGeneratorService);

        mock.expects('generateAndPersistConsentWithAllEnabled').once();

        const consentGeneratorSubscriber = new ConsentsGeneratorSubscriber(consentGeneratorService);

        consentGeneratorSubscriber[consentGeneratorSubscriber.getSubscribedEvents()[AcceptAllEvent.name]](
            acceptAllEvent,
        );

        mock.verify();
    });
});

import {expect} from 'chai';
const sinon = require('sinon');
import {TCModelFactory} from '@iabtcf/testing';
import {
    ACStringService,
    CmpSupportedLanguageProvider,
    ConsentGeneratorService,
    CookieService,
    LoggerService,
    TCStringService,
} from '../../src/Service';
import {EventDispatcher} from '../../src/EventDispatcher';
import {ConsentsGeneratorSubscriber} from '../../src/EventSubscriber';
import {AcceptAllEvent, ApplyConsentEvent} from '../../src/Event';
import {ACModel} from '../../src/Entity';
import {UIChoicesBridgeDtoBuilder} from '../../src/UIChoicesBridge';
import {SoloCmpDataBundle} from '../../src';

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

    const getConsentsGeneratorService = function() {

        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['it', 'fr', 'en'], 'it-IT');

        const acStringService = new ACStringService(1, 'solo-cmp-ac-string', loggerService, mockLocalStorage, false);
        const tcStringService = new TCStringService(
            cookieService,
            loggerService,
            cmpSupportedLanguageProvider,
            1,
            1,
            'solo-cmp-tc-string',
        );

        return new ConsentGeneratorService(tcStringService, acStringService, EventDispatcher.getInstance(), true);

    };

    it('ConsentsGeneratorSubscriber getSubscribedEvents registered for ApplyConsentEvent and AcceptAllEvent test', () => {

        const consentGeneratorSubscriber = new ConsentsGeneratorSubscriber(getConsentsGeneratorService());

        expect(consentGeneratorSubscriber.getSubscribedEvents()).to.have.own.property(ApplyConsentEvent.EVENT_NAME);
        expect(consentGeneratorSubscriber.getSubscribedEvents()).to.have.own.property(AcceptAllEvent.EVENT_NAME);

    });

    it('ConsentsGeneratorSubscriber ApplyConsentEvent call ConsentGeneratorService test', () => {

        const tcModel = TCModelFactory.withGVL();
        const acModel = new ACModel([]);

        const uiChoicesBridgeDto = new UIChoicesBridgeDtoBuilder(
            tcModel,
            acModel,
            true,
            false,
        ).createUIChoicesBridgeDto();

        const soloCmpDataBundle = new SoloCmpDataBundle(uiChoicesBridgeDto, tcModel, acModel, true);

        const applyConsentEvent = new ApplyConsentEvent(soloCmpDataBundle);

        const consentGeneratorService = getConsentsGeneratorService();

        const mock = sinon.mock(consentGeneratorService);

        mock.expects('generateAndPersistConsent').once().withArgs(soloCmpDataBundle);

        const consentGeneratorSubscriber = new ConsentsGeneratorSubscriber(consentGeneratorService);

        consentGeneratorSubscriber[consentGeneratorSubscriber.getSubscribedEvents()[ApplyConsentEvent.EVENT_NAME]](
            applyConsentEvent,
        );

        mock.verify();

    });

    it('ConsentsGeneratorSubscriber AcceptAllEvent call ConsentGeneratorService generate consents with all enabled test', () => {

        const tcModel = TCModelFactory.withGVL();
        const acModel = new ACModel([]);

        const uiChoicesBridgeDto = new UIChoicesBridgeDtoBuilder(
            tcModel,
            acModel,
            true,
            false,
        ).createUIChoicesBridgeDto();

        const soloCmpDataBundle = new SoloCmpDataBundle(uiChoicesBridgeDto, tcModel, acModel, true);

        const acceptAllEvent = new AcceptAllEvent(soloCmpDataBundle);

        const consentGeneratorService = getConsentsGeneratorService();

        const mock = sinon.mock(consentGeneratorService);

        mock.expects('generateAndPersistConsentWithAllEnabled').once().withArgs(soloCmpDataBundle);

        const consentGeneratorSubscriber = new ConsentsGeneratorSubscriber(consentGeneratorService);

        consentGeneratorSubscriber[consentGeneratorSubscriber.getSubscribedEvents()[AcceptAllEvent.EVENT_NAME]](
            acceptAllEvent,
        );

        mock.verify();

    });

});

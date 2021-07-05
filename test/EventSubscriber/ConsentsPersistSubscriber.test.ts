import { expect } from 'chai';
import {
    ACStringService,
    CmpSupportedLanguageProvider,
    CookieService,
    LoggerService,
    TCStringService,
} from '../../src/Service';
import { ConsentsPersistSubscriber } from '../../src/EventSubscriber';
import { ConsentPersistEvent } from '../../src/Event';
const sinon = require('sinon');

describe('ConsentsPersistSubscriber suit test', () => {
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

    it('ConsentsPersistSubscriber getSubscribedEvents registered for ConsentPersistEvent test', () => {
        const consentsPersistSubscriber = new ConsentsPersistSubscriber(sinon.mock(), sinon.mock());

        expect(consentsPersistSubscriber.getSubscribedEvents()).to.have.own.property(ConsentPersistEvent.name);
    });

    it('ConsentsPersistSubscriber ConsentPersistEvent call persist for tcString and acString test', () => {
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

        const mockACStringService = sinon.mock(acStringService);

        mockACStringService.expects('persistACString').once().withArgs('cba');

        const mockTCStringService = sinon.mock(tcStringService);

        mockTCStringService.expects('persistTCString').once().withArgs('abc');

        const consentsPersistSubscriber = new ConsentsPersistSubscriber(tcStringService, acStringService);

        const consentsPersistEvent = new ConsentPersistEvent('abc', 'cba');

        consentsPersistSubscriber[consentsPersistSubscriber.getSubscribedEvents()[ConsentPersistEvent.name]](
            consentsPersistEvent,
        );

        mockACStringService.verify();
        mockTCStringService.verify();
    });
});

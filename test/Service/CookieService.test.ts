import { expect } from 'chai';
const sinon = require('sinon');
import CookieService from '../../src/Service/CookieService';
import LoggerService from '../../src/Service/LoggerService';

describe('Cookie suit test', () => {
    let cookieService: CookieService;
    const loggerService: LoggerService = new LoggerService(true);

    const document = {
        cookie: '',
    };

    const mockLogger = sinon.mock(loggerService);
    const mockDocument = sinon.mock(document);

    before(() => {
        cookieService = new CookieService(loggerService, 'solocmp.com', mockDocument);
    });

    it('Cookie set cookie test', () => {
        cookieService.setCookie('cookieTest', 'valueTest', 365);

        const date = new Date();
        date.setTime(date.getTime() + 365 * CookieService.milliSecondsInADay);

        expect(mockDocument.cookie).to.equal(
            `cookieTest=valueTest;expires=${date.toUTCString()};path=/;domain=.solocmp.com`,
        );
    });

    it('Cookie get cookie test', () => {
        expect(cookieService.getCookie('cookieTest')).to.equal('valueTest');
    });

    it('Cookie remove all cookie by specific name test', () => {
        mockLogger.expects('debug').thrice();

        cookieService.removeCookiesByName('cookieTest');

        expect(mockDocument.cookie).to.equal(
            'cookieTest=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.solocmp.com',
        );

        mockLogger.verify();
    });
});

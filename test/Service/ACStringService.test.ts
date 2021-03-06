import {expect} from 'chai';
const sinon = require('sinon');
import {LoggerService, ACStringService} from '../../src/Service';
import {ACModel, GoogleVendorOption} from '../../src/Entity';

describe('ACStringService suit test', () => {

    const loggerService: LoggerService = new LoggerService(false);

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

    const getGoogleVendorOption = function() {

        const id: number = Math.floor(Math.random() * 10);

        const googleVendorOption: GoogleVendorOption = {
            id: id,
            name: `vendorName${id}`,
            state: false,
            policyUrl: 'fakeUrl',
            domains: 'fakeDomains',
        };

        return googleVendorOption;

    };

    it('ACStringService construction fail CMP version test', () => {

        const construction = function() {

            new ACStringService(NaN, 'solo-cmp-ac-string', loggerService, mockLocalStorage, false);

        };

        expect(construction).to.throw('ACStringService, cmpVersion parameter must be a valid number.');

    });

    it('ACStringService construction fail local storage key test', () => {

        const construction = function() {

            new ACStringService(1, '', loggerService, mockLocalStorage, false);

        };

        expect(construction).to.throw(
            'ACStringService, acStringLocalStorageKey must be a string with a length greater than zero.',
        );

    });

    it('ACStringService buildACString empty string with empty ACModel test', () => {

        const cmpVersion = 1;
        const acStringService = new ACStringService(
            cmpVersion,
            'solo-cmp-ac-string',
            loggerService,
            mockLocalStorage,
            false,
        );

        const acModel = new ACModel([]);

        expect(acStringService.buildACString(acModel)).to.equal(`${cmpVersion}~`);

    });

    it('ACStringService buildACString empty string with ACModel test', () => {

        const cmpVersion = 1;
        const acStringService = new ACStringService(
            cmpVersion,
            'solo-cmp-ac-string',
            loggerService,
            mockLocalStorage,
            false,
        );

        const firstVendorOption = getGoogleVendorOption();
        const secondVendorOption = getGoogleVendorOption();

        secondVendorOption.id = firstVendorOption.id + 1;
        firstVendorOption.state = true;

        const googleVendorOptions = [firstVendorOption, secondVendorOption];

        const acModel = new ACModel(googleVendorOptions);

        expect(acStringService.buildACString(acModel)).to.equal(`${cmpVersion}~${firstVendorOption.id}`);

    });

    it('ACStringService persistACString test', () => {

        const acStringService = new ACStringService(1, 'solo-cmp-ac-string', loggerService, localStorage, false);

        const firstVendorOption = getGoogleVendorOption();
        const secondVendorOption = getGoogleVendorOption();

        firstVendorOption.state = true;

        const googleVendorOptions = [firstVendorOption, secondVendorOption];

        const acModel = new ACModel(googleVendorOptions);

        acModel.googleVendorOptions.forEach((googleVendor) => (googleVendor.state = true));
        const acStringWithAllEnabled = acStringService.buildACString(acModel);

        mockLocalStorage.expects('setItem').withExactArgs('solo-cmp-ac-string', acStringWithAllEnabled);

        acStringService.persistACString(acStringWithAllEnabled);

        mockLocalStorage.verify();

    });

    it('ACStringService retrieveACString test', () => {

        const acStringService = new ACStringService(1, 'solo-cmp-ac-string', loggerService, localStorage, false);

        mockLocalStorage.expects('getItem').withExactArgs('solo-cmp-ac-string');

        expect(acStringService.retrieveACString()).to.equal('');

        mockLocalStorage.verify();

    });

    it('ACStringService retrieveACString fail test', () => {

        const cmpVersion = 1;
        const acStringService = new ACStringService(
            cmpVersion,
            'solo-cmp-ac-string',
            loggerService,
            mockLocalStorage,
            false,
        );

        expect(acStringService.retrieveACString()).to.equal(`${cmpVersion}~`);

    });

    it('ACStringService removeACString test', () => {

        const acStringService = new ACStringService(1, 'solo-cmp-ac-string', loggerService, localStorage, false);

        mockLocalStorage.expects('removeItem').withExactArgs('solo-cmp-ac-string');

        acStringService.removeACString();

        mockLocalStorage.verify();

    });

    it('ACStringService isValidACString test', () => {

        const cmpVersion = 1;
        const acStringService = new ACStringService(
            cmpVersion,
            'solo-cmp-ac-string',
            loggerService,
            localStorage,
            false,
        );

        expect(acStringService.isValidACString(null)).to.be.false;
        expect(acStringService.isValidACString(`${cmpVersion}~`)).to.be.true;
        expect(acStringService.isValidACString('12~')).to.be.false;
        expect(acStringService.isValidACString('1~2')).to.be.true;

    });

    it('ACStringService isValidACString with skipACStringCheck test', () => {

        const cmpVersion = 1;
        const acStringService = new ACStringService(
            cmpVersion,
            'solo-cmp-ac-string',
            loggerService,
            localStorage,
            true,
        );

        expect(acStringService.isValidACString(null)).to.be.true;
        expect(acStringService.isValidACString(`${cmpVersion}~`)).to.be.true;
        expect(acStringService.isValidACString('12~')).to.be.true;
        expect(acStringService.isValidACString('1~2')).to.be.true;

    });

});

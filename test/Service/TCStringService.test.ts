import {expect} from 'chai';
const sinon = require('sinon');
import {GVL, TCModel, TCString} from '@iabtcf/core';
import {TCModelFactory} from '@iabtcf/testing';
import {CmpSupportedLanguageProvider, CookieService, LoggerService, TCStringService} from '../../src/Service';

describe('TCStringService suit test', () => {

    const loggerService: LoggerService = new LoggerService(false);

    const document = {
        cookie: '',
    };

    const mockDocument = sinon.mock(document);
    const mockLoggerService = sinon.mock(loggerService);
    const cookieService: CookieService = new CookieService(loggerService, 'solocmp.com', mockDocument);

    const getTCModel = (withoutGVL = false): TCModel => {

        let tcModel: TCModel;

        if (withoutGVL) {

            tcModel = (TCModelFactory.noGVL() as unknown) as TCModel;

        } else {

            tcModel = (TCModelFactory.withGVL() as unknown) as TCModel;

        }

        return tcModel;

    };

    it('TCStringService construction fail CMP version test', () => {

        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['it', 'fr', 'en'], 'it');

        const construction = function() {

            new TCStringService(
                cookieService,
                loggerService,
                cmpSupportedLanguageProvider,
                NaN,
                1,
                'solo-cmp-tc-string',
                true,
            );

        };

        expect(construction).to.throw('TCStringService, cmpVersion parameter must be a valid number.');

    });

    it('TCStringService construction fail CMP vendorList version test', () => {

        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['it', 'fr', 'en'], 'it');

        const construction = function() {

            new TCStringService(
                cookieService,
                loggerService,
                cmpSupportedLanguageProvider,
                1,
                NaN,
                'solo-cmp-tc-string',
                true,
            );

        };

        expect(construction).to.throw('TCStringService, cmpVendorListVersion parameter must be a valid number.');

    });

    it('TCStringService construction fail CMP invalid cookie name test', () => {

        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['it', 'fr', 'en'], 'it');

        const construction = function() {

            new TCStringService(cookieService, loggerService, cmpSupportedLanguageProvider, 1, 1, '', true);

        };

        expect(construction).to.throw(
            'TCStringService, tcStringCookieName parameter must be a string with a length greater than zero.',
        );

    });

    it('TCStringService storage tcString test', () => {

        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['it', 'fr', 'en'], 'it');

        const tcStringService = new TCStringService(
            cookieService,
            loggerService,
            cmpSupportedLanguageProvider,
            1,
            1,
            'solo-cmp-tc-string',
            true,
        );

        expect(tcStringService.retrieveTCString()).to.equal('');

        const tcString =
            'CPIPbHaPIPbHaDhAAAENAwCAAAAAAAAAAAAAAAAAAAAA.IGLtV_T9fb2vj-_Z99_tkeYwf95y3p-wzhheMs-8NyZeH_B4Wv2MyvBX4JiQKGRgksjLBAQdtHGlcTQgBwIlViTLMYk2MjzNKJrJEilsbO2dYGD9Pn8HT3ZCY70-vv__7v3ff_3g';

        tcStringService.persistTCString(tcString);

        expect(tcStringService.retrieveTCString()).to.equal(tcString);

    });

    it('TCStringService build tcString test', () => {

        const tcString = TCString.encode(getTCModel());

        const tcModel: TCModel = TCString.decode(tcString);

        tcModel.gvl = getTCModel().gvl;

        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['it', 'fr', 'en'], 'it');

        const tcStringService = new TCStringService(
            cookieService,
            loggerService,
            cmpSupportedLanguageProvider,
            1,
            1,
            'solo-cmp-tc-string',
            true,
        );

        mockLoggerService.expects('debug').once();

        expect(tcStringService.buildTCString(tcModel)).to.equal(tcString);

        mockLoggerService.verify();

    });

    it('TCStringService build tcString with TCModel without gvl test', () => {

        const tcString = TCString.encode(getTCModel());

        const tcModel: TCModel = TCString.decode(tcString);

        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['it', 'fr', 'en'], 'it');

        const tcStringService = new TCStringService(
            cookieService,
            loggerService,
            cmpSupportedLanguageProvider,
            1,
            1,
            'solo-cmp-tc-string',
            true,
        );

        mockLoggerService.expects('error').once();

        expect(tcStringService.buildTCString(tcModel)).to.equal('');

        mockLoggerService.verify();

    });

    it('TCStringService build tcString with all consents enabled test', () => {

        const tcString = TCString.encode(getTCModel());

        const tcModel: TCModel = TCString.decode(tcString);

        tcModel.gvl = new GVL(require('@iabtcf/testing/lib/vendorlist/vendor-list.json'));

        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['it', 'fr', 'en'], 'it');

        const tcStringService = new TCStringService(
            cookieService,
            loggerService,
            cmpSupportedLanguageProvider,
            1,
            1,
            'solo-cmp-tc-string',
            false,
        );

        const tcStringWillAllConsentsEnabled: string = tcStringService.buildTCStringAllEnabled(tcModel);

        const tcModelWithAllEnabled: TCModel = TCString.decode(tcStringWillAllConsentsEnabled);

        expect(tcModelWithAllEnabled.purposeLegitimateInterests.size).to.equal(9);
        expect(tcModelWithAllEnabled.purposeConsents.size).to.equal(10);
        expect(tcModelWithAllEnabled.vendorLegitimateInterests.size).to.equal(209);
        expect(tcModelWithAllEnabled.vendorConsents.size).to.equal(467);

    });

    it('TCStringService build tcString with all consents enabled without legitimate interest test', () => {

        const tcString = TCString.encode(getTCModel());

        const tcModel: TCModel = TCString.decode(tcString);

        tcModel.gvl = new GVL(require('@iabtcf/testing/lib/vendorlist/vendor-list.json'));

        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['it', 'fr', 'en'], 'it');

        const tcStringService = new TCStringService(
            cookieService,
            loggerService,
            cmpSupportedLanguageProvider,
            1,
            1,
            'solo-cmp-tc-string',
            true,
        );

        const tcStringWillAllConsentsEnabled: string = tcStringService.buildTCStringAllEnabled(tcModel);

        const tcModelWithAllEnabled: TCModel = TCString.decode(tcStringWillAllConsentsEnabled);

        expect(tcModelWithAllEnabled.purposeLegitimateInterests.size).to.equal(0);
        expect(tcModelWithAllEnabled.purposeConsents.size).to.equal(10);
        expect(tcModelWithAllEnabled.vendorLegitimateInterests.size).to.equal(0);
        expect(tcModelWithAllEnabled.vendorConsents.size).to.equal(467);

    });

    it('TCStringService is valid tcString test', () => {

        const tcString = TCString.encode(getTCModel());

        const tcModel: TCModel = TCString.decode(tcString);

        tcModel.gvl = new GVL(require('@iabtcf/testing/lib/vendorlist/vendor-list.json'));

        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['fr', 'en'], 'it');

        const tcStringService = new TCStringService(
            cookieService,
            loggerService,
            cmpSupportedLanguageProvider,
            Number(tcModel.cmpVersion),
            Number(tcModel.vendorListVersion),
            'solo-cmp-tc-string',
            true,
        );

        const isValidTCString: boolean = tcStringService.isValidTCString(tcString);

        expect(isValidTCString).to.be.true;

    });

    it('TCStringService is valid tcString with different language used test', () => {

        const tcString = TCString.encode(getTCModel());

        const tcModel: TCModel = TCString.decode(tcString);

        tcModel.gvl = new GVL(require('@iabtcf/testing/lib/vendorlist/vendor-list.json'));

        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['it', 'fr', 'en'], 'it');

        const tcStringService = new TCStringService(
            cookieService,
            loggerService,
            cmpSupportedLanguageProvider,
            Number(tcModel.cmpVersion),
            Number(tcModel.vendorListVersion),
            'solo-cmp-tc-string',
            true,
        );

        const isValidTCString: boolean = tcStringService.isValidTCString(tcString);

        expect(isValidTCString).to.be.false;

    });

    it('TCStringService is valid tcString with different CMP version used test', () => {

        const tcModelTmp: TCModel = getTCModel();
        const tcString = TCString.encode(tcModelTmp);

        const tcModel: TCModel = TCString.decode(tcString);

        tcModel.gvl = new GVL(require('@iabtcf/testing/lib/vendorlist/vendor-list.json'));

        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['fr', 'en'], 'it');

        const tcStringService = new TCStringService(
            cookieService,
            loggerService,
            cmpSupportedLanguageProvider,
            Number(tcModelTmp.cmpVersion) + 1,
            Number(tcModel.vendorListVersion),
            'solo-cmp-tc-string',
            true,
        );

        const isValidTCString: boolean = tcStringService.isValidTCString(tcString);

        expect(isValidTCString).to.be.false;

    });

    it('TCStringService is valid tcString with different CMP version used test', () => {

        const tcString = TCString.encode(getTCModel());

        const tcModel: TCModel = TCString.decode(tcString);

        tcModel.gvl = new GVL(require('@iabtcf/testing/lib/vendorlist/vendor-list.json'));

        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['fr', 'en'], 'it');

        const tcStringService = new TCStringService(
            cookieService,
            loggerService,
            cmpSupportedLanguageProvider,
            Number(tcModel.cmpVersion),
            1,
            'solo-cmp-tc-string',
            true,
        );

        const isValidTCString: boolean = tcStringService.isValidTCString(tcString);

        expect(isValidTCString).to.be.false;

    });

});

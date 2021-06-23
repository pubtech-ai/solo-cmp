import { expect } from 'chai';
const sinon = require('sinon');
import Cookie from '../../src/Service/Cookie';
import Logger from '../../src/Service/Logger';
import TCStringService from '../../src/Service/TCStringService';
import CmpSupportedLanguageProvider from '../../src/Service/CmpSupportedLanguageProvider';
import { GVL, TCModel, TCString } from '@iabtcf/core';
import { TCModelFactory } from '@iabtcf/testing';

describe('TCStringService suit test', () => {
    const loggerService: Logger = new Logger(true);

    const document = {
        cookie: '',
    };

    const mockDocument = sinon.mock(document);
    const mockLoggerService = sinon.mock(loggerService);
    const cookieService: Cookie = new Cookie(loggerService, 'solocmp.com', mockDocument);

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
        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['it', 'fr', 'en'], 'it-IT');

        const construction = function () {
            new TCStringService(
                cookieService,
                loggerService,
                cmpSupportedLanguageProvider,
                NaN,
                1,
                'solo-cmp-tc-string',
            );
        };

        expect(construction).to.throw('TCStringService, cmpVersion parameter must be a valid number.');
    });

    it('TCStringService construction fail CMP vendorList version test', () => {
        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['it', 'fr', 'en'], 'it-IT');

        const construction = function () {
            new TCStringService(
                cookieService,
                loggerService,
                cmpSupportedLanguageProvider,
                1,
                NaN,
                'solo-cmp-tc-string',
            );
        };

        expect(construction).to.throw('TCStringService, cmpVendorListVersion parameter must be a valid number.');
    });

    it('TCStringService construction fail CMP invalid cookie name test', () => {
        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['it', 'fr', 'en'], 'it-IT');

        const construction = function () {
            new TCStringService(cookieService, loggerService, cmpSupportedLanguageProvider, 1, 1, '');
        };

        expect(construction).to.throw(
            'TCStringService, tcStringCookieName parameter must be a string with a length greater than zero.',
        );
    });

    it('TCStringService storage tcString test', () => {
        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['it', 'fr', 'en'], 'it-IT');

        const tcStringService = new TCStringService(
            cookieService,
            loggerService,
            cmpSupportedLanguageProvider,
            1,
            1,
            'solo-cmp-tc-string',
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

        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['it', 'fr', 'en'], 'it-IT');

        const tcStringService = new TCStringService(
            cookieService,
            loggerService,
            cmpSupportedLanguageProvider,
            1,
            1,
            'solo-cmp-tc-string',
        );

        mockLoggerService.expects('debug').once();

        expect(tcStringService.buildTCString(tcModel)).to.equal(tcString);

        mockLoggerService.verify();
    });

    it('TCStringService build tcString with TCModel without gvl test', () => {
        const tcString = TCString.encode(getTCModel());

        const tcModel: TCModel = TCString.decode(tcString);

        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['it', 'fr', 'en'], 'it-IT');

        const tcStringService = new TCStringService(
            cookieService,
            loggerService,
            cmpSupportedLanguageProvider,
            1,
            1,
            'solo-cmp-tc-string',
        );

        mockLoggerService.expects('error').once();

        expect(tcStringService.buildTCString(tcModel)).to.equal('');

        mockLoggerService.verify();
    });

    it('TCStringService build tcString with all consents enabled test', () => {
        const tcString = TCString.encode(getTCModel());

        const tcModel: TCModel = TCString.decode(tcString);

        tcModel.gvl = new GVL(require('@iabtcf/testing/lib/vendorlist/vendor-list.json'));

        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['it', 'fr', 'en'], 'it-IT');

        const tcStringService = new TCStringService(
            cookieService,
            loggerService,
            cmpSupportedLanguageProvider,
            1,
            1,
            'solo-cmp-tc-string',
        );

        const tcStringWillAllConsentsEnabled: string = tcStringService.buildTCStringAllEnabled(tcModel);

        const tcModelWithAllEnabled: TCModel = TCString.decode(tcStringWillAllConsentsEnabled);

        expect(tcModelWithAllEnabled.purposeLegitimateInterests.size).to.equal(9);
        expect(tcModelWithAllEnabled.purposeConsents.size).to.equal(10);
        expect(tcModelWithAllEnabled.vendorLegitimateInterests.size).to.equal(206);
        expect(tcModelWithAllEnabled.vendorConsents.size).to.equal(467);
    });

    it('TCStringService is valid tcString test', () => {
        const tcString = TCString.encode(getTCModel());

        const tcModel: TCModel = TCString.decode(tcString);

        tcModel.gvl = new GVL(require('@iabtcf/testing/lib/vendorlist/vendor-list.json'));

        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['fr', 'en'], 'it-IT');

        const tcStringService = new TCStringService(
            cookieService,
            loggerService,
            cmpSupportedLanguageProvider,
            Number(tcModel.cmpVersion),
            Number(tcModel.vendorListVersion),
            'solo-cmp-tc-string',
        );

        const isValidTCString: boolean = tcStringService.isValidTCString(tcString);

        expect(isValidTCString).to.be.true;
    });

    it('TCStringService is valid tcString with different language used test', () => {
        const tcString = TCString.encode(getTCModel());

        const tcModel: TCModel = TCString.decode(tcString);

        tcModel.gvl = new GVL(require('@iabtcf/testing/lib/vendorlist/vendor-list.json'));

        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['it', 'fr', 'en'], 'it-IT');

        const tcStringService = new TCStringService(
            cookieService,
            loggerService,
            cmpSupportedLanguageProvider,
            Number(tcModel.cmpVersion),
            Number(tcModel.vendorListVersion),
            'solo-cmp-tc-string',
        );

        const isValidTCString: boolean = tcStringService.isValidTCString(tcString);

        expect(isValidTCString).to.be.false;
    });

    it('TCStringService is valid tcString with different CMP version used test', () => {
        const tcString = TCString.encode(getTCModel());

        const tcModel: TCModel = TCString.decode(tcString);

        tcModel.gvl = new GVL(require('@iabtcf/testing/lib/vendorlist/vendor-list.json'));

        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['fr', 'en'], 'it-IT');

        const tcStringService = new TCStringService(
            cookieService,
            loggerService,
            cmpSupportedLanguageProvider,
            1,
            Number(tcModel.vendorListVersion),
            'solo-cmp-tc-string',
        );

        const isValidTCString: boolean = tcStringService.isValidTCString(tcString);

        expect(isValidTCString).to.be.false;
    });

    it('TCStringService is valid tcString with different CMP version used test', () => {
        const tcString = TCString.encode(getTCModel());

        const tcModel: TCModel = TCString.decode(tcString);

        tcModel.gvl = new GVL(require('@iabtcf/testing/lib/vendorlist/vendor-list.json'));

        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['fr', 'en'], 'it-IT');

        const tcStringService = new TCStringService(
            cookieService,
            loggerService,
            cmpSupportedLanguageProvider,
            Number(tcModel.cmpVersion),
            1,
            'solo-cmp-tc-string',
        );

        const isValidTCString: boolean = tcStringService.isValidTCString(tcString);

        expect(isValidTCString).to.be.false;
    });
});

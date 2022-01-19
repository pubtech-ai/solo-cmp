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
            );

        };

        expect(construction).to.throw('TCStringService.cmpVersion must be a number.');

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
            );

        };

        expect(construction).to.throw('TCStringService.cmpVendorListVersion must be a number.');

    });

    it('TCStringService construction fail CMP invalid cookie name test', () => {

        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['it', 'fr', 'en'], 'it');

        const construction = function() {

            new TCStringService(cookieService, loggerService, cmpSupportedLanguageProvider, 1, 1, '');

        };

        expect(construction).to.throw(
            'TCStringService.tcStringCookieName must be a not empty string.',
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
        );

        mockLoggerService.expects('error').once();

        expect(tcStringService.buildTCString(tcModel)).to.equal('');

        mockLoggerService.verify();

    });

    const globalTCModel = (() => {

        const tcString = TCString.encode(getTCModel());

        const tcModel: TCModel = TCString.decode(tcString);

        tcModel.gvl = new GVL(require('@iabtcf/testing/lib/vendorlist/vendor-list.json'));

        return tcModel;

    })();

    /**
     * Test the condition for the expiration days for partial consent.
     */
    const testFixtureForIsValidTCString = [
        {
            title: 'TCStringService is invalid tcString when expirationDaysForPartialConsents is exceeded test',
            subtractDaysFromNow: 6,
            expirationDaysForPartialConsents: 5,
            cmpVersion: globalTCModel.cmpVersion,
            vendorListVersion: globalTCModel.vendorListVersion,
            supportedLanguages: ['fr', 'en'],
            userLanguage: 'it',
            purposeIds: [2, 3, 4, 5, 6, 7, 8, 9, 10],
            purposeIdsForPartialCheck: [1],
            result: false,
        },
        {
            title: 'TCStringService is valid tcString when expirationDaysForPartialConsents is not exceeded test',
            subtractDaysFromNow: 5,
            expirationDaysForPartialConsents: 6,
            cmpVersion: globalTCModel.cmpVersion,
            vendorListVersion: globalTCModel.vendorListVersion,
            supportedLanguages: ['fr', 'en'],
            userLanguage: 'it',
            purposeIds: [2, 3, 4, 5, 6, 7, 8, 9, 10],
            purposeIdsForPartialCheck: [1],
            result: true,
        },
        {
            title: 'TCStringService is valid tcString when expirationDaysForPartialConsents is exceeded but skip the partial consent check test',
            subtractDaysFromNow: 6,
            expirationDaysForPartialConsents: 5,
            cmpVersion: globalTCModel.cmpVersion,
            vendorListVersion: globalTCModel.vendorListVersion,
            supportedLanguages: ['fr', 'en'],
            userLanguage: 'it',
            purposeIds: [2, 3, 4, 5, 6, 7, 8, 9, 10],
            purposeIdsForPartialCheck: [],
            result: true,
        },
        {
            title: 'TCStringService is invalid tcString with different CMP version used test',
            subtractDaysFromNow: 5,
            expirationDaysForPartialConsents: 6,
            cmpVersion: Number(globalTCModel.cmpVersion) + 1,
            vendorListVersion: globalTCModel.vendorListVersion,
            supportedLanguages: ['fr', 'en'],
            userLanguage: 'it',
            purposeIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            purposeIdsForPartialCheck: [1],
            result: false,
        },
        {
            title: 'TCStringService is invalid tcString with different vendor list version used and consent is not partial test',
            subtractDaysFromNow: 5,
            expirationDaysForPartialConsents: 6,
            cmpVersion: globalTCModel.cmpVersion,
            vendorListVersion: Number(globalTCModel.vendorListVersion) + 1,
            supportedLanguages: ['fr', 'en'],
            userLanguage: 'it',
            purposeIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            purposeIdsForPartialCheck: [1],
            result: true,
        },
        {
            title: 'TCStringService is invalid tcString with different vendor list version used and consent is partial test',
            subtractDaysFromNow: 5,
            expirationDaysForPartialConsents: 6,
            cmpVersion: globalTCModel.cmpVersion,
            vendorListVersion: Number(globalTCModel.vendorListVersion) + 1,
            supportedLanguages: ['fr', 'en'],
            userLanguage: 'it',
            purposeIds: [2, 3, 4, 5, 6, 7, 8, 9, 10],
            purposeIdsForPartialCheck: [1],
            result: false,
        },
        {
            title: 'TCStringService is invalid tcString with different vendor list version used and partial check is skipped test',
            subtractDaysFromNow: 5,
            expirationDaysForPartialConsents: 6,
            cmpVersion: globalTCModel.cmpVersion,
            vendorListVersion: Number(globalTCModel.vendorListVersion) + 1,
            supportedLanguages: ['fr', 'en'],
            userLanguage: 'it',
            purposeIds: [2, 3, 4, 5, 6, 7, 8, 9, 10],
            purposeIdsForPartialCheck: [],
            result: false,
        },
        {
            title: 'TCStringService is valid tcString with different language used test',
            subtractDaysFromNow: 5,
            expirationDaysForPartialConsents: 6,
            cmpVersion: globalTCModel.cmpVersion,
            vendorListVersion: globalTCModel.vendorListVersion,
            supportedLanguages: ['fr', 'en', 'it'],
            userLanguage: 'it',
            purposeIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            purposeIdsForPartialCheck: [1],
            result: false,
        },
        {
            title: 'TCStringService is valid tcString test',
            subtractDaysFromNow: 5,
            expirationDaysForPartialConsents: 6,
            cmpVersion: globalTCModel.cmpVersion,
            vendorListVersion: globalTCModel.vendorListVersion,
            supportedLanguages: ['fr', 'en'],
            userLanguage: 'it',
            purposeIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            purposeIdsForPartialCheck: [1],
            result: true,
        },
        {
            title: 'TCStringService is valid tcString without expirationDaysForPartialConsents test',
            subtractDaysFromNow: 5,
            expirationDaysForPartialConsents: null,
            cmpVersion: globalTCModel.cmpVersion,
            vendorListVersion: globalTCModel.vendorListVersion,
            supportedLanguages: ['fr', 'en'],
            userLanguage: 'it',
            purposeIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            purposeIdsForPartialCheck: [1],
            result: true,
        },
    ];

    testFixtureForIsValidTCString.forEach((testData) => {

        it(testData.title, () => {

            const subtractDaysFromNow = testData.subtractDaysFromNow;
            const expirationDaysForPartialConsents = testData.expirationDaysForPartialConsents;

            const tcModel: TCModel = globalTCModel;

            const createdDate = new Date();
            createdDate.setDate(createdDate.getDate() - subtractDaysFromNow);
            tcModel.created = createdDate;

            tcModel.purposeConsents.unset([...tcModel.purposeConsents.values()]);
            tcModel.purposeConsents.set(testData.purposeIds);

            tcModel.gvl = new GVL(require('@iabtcf/testing/lib/vendorlist/vendor-list.json'));

            const tcString = TCString.encode(tcModel);

            const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(
                testData.supportedLanguages,
                testData.userLanguage,
            );

            const tcStringService = new TCStringService(
                cookieService,
                loggerService,
                cmpSupportedLanguageProvider,
                Number(testData.cmpVersion),
                Number(testData.vendorListVersion),
                'solo-cmp-tc-string',
                NaN,
                testData.purposeIdsForPartialCheck,
                expirationDaysForPartialConsents,
            );

            const isValidTCString: boolean = tcStringService.isValidTCString(tcString);

            expect(isValidTCString).to.be[testData.result.toString()];

        });

    });

});

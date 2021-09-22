import {expect} from 'chai';
const sinon = require('sinon');
import {TCModel} from '@iabtcf/core';
import {TCModelFactory} from '@iabtcf/testing';
import {
    CmpSupportedLanguageProvider,
    CookieService,
    LoggerService,
    TCModelService,
    TCStringService,
} from '../../src/Service';

describe('TCModelService suit test', () => {

    const loggerService: LoggerService = new LoggerService(false);

    const document = {
        cookie: '',
    };

    const mockDocument = sinon.mock(document);
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

    it('TCModelService construction fail with invalid cmpId test', () => {

        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['it', 'fr', 'en'], 'it-IT');

        const tcModel: TCModel = getTCModel();

        const tcStringService = new TCStringService(
            cookieService,
            loggerService,
            cmpSupportedLanguageProvider,
            Number(tcModel.cmpVersion),
            Number(tcModel.vendorListVersion),
            'solo-cmp-tc-string',
        );

        const construction = () => {

            new TCModelService(
                tcStringService,
                cmpSupportedLanguageProvider,
                NaN,
                Number(tcModel.cmpVersion),
                true,
                () => tcModel.gvl,
            );

        };

        expect(construction).to.throw('TCModelService, cmpId parameter must be a valid number.');

    });

    it('TCModelService construction fail with invalid cmpVersion test', () => {

        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['it', 'fr', 'en'], 'it-IT');

        const tcModel: TCModel = getTCModel();

        const tcStringService = new TCStringService(
            cookieService,
            loggerService,
            cmpSupportedLanguageProvider,
            Number(tcModel.cmpVersion),
            Number(tcModel.vendorListVersion),
            'solo-cmp-tc-string',
        );

        const construction = () => {

            new TCModelService(tcStringService, cmpSupportedLanguageProvider, 123, NaN, true, () => tcModel.gvl);

        };

        expect(construction).to.throw('TCModelService, cmpVersion parameter must be a valid number.');

    });

    it('TCModelService buildTCModel test', async () => {

        const tcModel: TCModel = getTCModel();

        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(
            ['it', 'fr', 'en'],
            tcModel.consentLanguage + '-LN',
        );

        const tcStringService = new TCStringService(
            cookieService,
            loggerService,
            cmpSupportedLanguageProvider,
            Number(tcModel.cmpVersion),
            Number(tcModel.vendorListVersion),
            'solo-cmp-tc-string',
        );

        const tcModelService = new TCModelService(
            tcStringService,
            cmpSupportedLanguageProvider,
            123,
            Number(tcModel.cmpVersion),
            true,
            () => tcModel.gvl,
        );

        const builtTcModel: TCModel = await tcModelService.fetchDataAndBuildTCModel(
            tcStringService.buildTCString(tcModel),
        );

        expect(builtTcModel.isServiceSpecific).to.be.true;
        expect(builtTcModel.cmpId).to.equal(123);
        expect(builtTcModel.cmpVersion).to.equal(Number(tcModel.cmpVersion));

    });

});

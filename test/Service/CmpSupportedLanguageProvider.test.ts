import {expect} from 'chai';
import {CmpSupportedLanguageProvider} from '../../src/Service';

describe('CmpSupportedLanguageProvider suit test', () => {

    it('CmpSupportedLanguageProvider construction test', () => {

        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['it', 'fr', 'en'], 'it-IT');

        expect(cmpSupportedLanguageProvider.getCurrentLanguageForCmp()).to.equal('it');

    });

    it('CmpSupportedLanguageProvider construction fallback to en test', () => {

        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['fr', 'en'], 'it-IT');

        expect(cmpSupportedLanguageProvider.getCurrentLanguageForCmp()).to.equal(
            CmpSupportedLanguageProvider.defaultLanguage,
        );

    });

    it('CmpSupportedLanguageProvider get browser language test', () => {

        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['fr', 'en'], 'it-IT');

        expect(cmpSupportedLanguageProvider.getBrowserLanguage()).to.equal('it-IT');

    });

    it('CmpSupportedLanguageProvider get supported languages test', () => {

        const supportedLanguages: string[] = ['fr', 'en'];

        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(supportedLanguages, 'it-IT');

        expect(cmpSupportedLanguageProvider.getCmpSupportedLanguages()).to.deep.equal(supportedLanguages);

    });

});

import { expect } from "chai";
import CmpSupportedLanguageProvider from "../../src/Service/CmpSupportedLanguageProvider";

describe("CmpSupportedLanguageProvider suit test", () => {

    it("CmpSupportedLanguageProvider construction test", () => {

        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['it', 'fr', 'en'], 'it-IT');

        expect(cmpSupportedLanguageProvider.getLanguage()).to.equal('it');

    });

    it("CmpSupportedLanguageProvider construction fallback to en test", () => {

        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['fr', 'en'], 'it-IT');

        expect(cmpSupportedLanguageProvider.getLanguage()).to.equal(CmpSupportedLanguageProvider.defaultLanguage);

    });

});

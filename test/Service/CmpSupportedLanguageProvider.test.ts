import { expect } from "chai";
import CmpSupportedLanguageProvider from "../../src/Service/CmpSupportedLanguageProvider";

describe("CmpSupportedLanguageProvider suit test", () => {

    it("CmpSupportedLanguageProvider construction fallback to en test", () => {

        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['fr', 'en'], 'it-IT');

        expect(cmpSupportedLanguageProvider.getLanguage()).to.equal('en');

    });

    it("CmpSupportedLanguageProvider construction fallback to en test", () => {

        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(['it', 'fr', 'en'], 'it-IT');

        expect(cmpSupportedLanguageProvider.getLanguage()).to.equal('it');

    });

});

/**
 * CmpSupportedLanguageProvider.
 */
class CmpSupportedLanguageProvider {

    public static readonly defaultLanguage: string = 'en';
    private readonly language: string;
    private readonly browserLanguage: string;
    private readonly cmpSupportedLanguages: string[];

    /**
     * Constructor.
     *
     * @param {string[]} supportedLanguages
     * @param {string} browserLanguage
     */
    constructor(supportedLanguages: string[], browserLanguage: string) {

        let languageVendorList = CmpSupportedLanguageProvider.defaultLanguage;
        const cleanedBrowserLanguage = browserLanguage.split('-', 2)[0];

        if (supportedLanguages.includes(cleanedBrowserLanguage)) {

            languageVendorList = cleanedBrowserLanguage;

        }

        this.cmpSupportedLanguages = supportedLanguages;
        this.browserLanguage = browserLanguage;
        this.language = languageVendorList.toLowerCase();

    }

    /**
     * Retrieve the current language used by CMP.
     * If the language of the browser is not supported it fallbacks to en.
     *
     * @return {string}
     */
    getCurrentLanguageForCmp(): string {

        return this.language;

    }

    /**
     * Retrieve the current language of browser.
     *
     * @return {string}
     */
    getBrowserLanguage(): string {

        return this.browserLanguage;

    }

    /**
     * Retrieve the current CMP supported languages.
     *
     * @return {string[]}
     */
    getCmpSupportedLanguages(): string[] {

        return this.cmpSupportedLanguages;

    }

    static getClassName(): string {

        return 'CmpSupportedLanguageProvider';

    }

}

export default CmpSupportedLanguageProvider;

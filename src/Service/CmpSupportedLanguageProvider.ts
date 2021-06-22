/**
 * CmpSupportedLanguageProvider.
 */
class CmpSupportedLanguageProvider {

    public static readonly defaultLanguage: string = 'en';
    private language: string;

    /**
     * Constructor.
     *
     * @param {string[]} languages
     * @param {string} browserLanguage
     */
    constructor(languages: string[], browserLanguage: string) {

        let languageVendorList = CmpSupportedLanguageProvider.defaultLanguage;
        const cleanedBrowserLanguage = browserLanguage.split('-', 2)[0];

        if (languages.includes(cleanedBrowserLanguage)) {

            languageVendorList = cleanedBrowserLanguage;

        }

        this.language = languageVendorList.toLowerCase();

    }

    /**
     * Retrieve the language of the browser.
     * If the language of the browser is not supported it fallbacks to en.
     *
     * @return {string}
     */
    getLanguage(): string {

        return this.language;

    }

}

export default CmpSupportedLanguageProvider;

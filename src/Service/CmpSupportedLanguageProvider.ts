/**
 * CmpSupportedLanguageProvider.
 */
class CmpSupportedLanguageProvider {

    private language: string;

    /**
     * Constructor.
     *
     * @param {string[]} languages
     */
    constructor(languages: string[], browserLanguage: string) {

        let languageVendorList = 'en';
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

/**
 * CmpSupportedLanguageProvider.
 */
class CmpSupportedLanguageProvider {

    private languages: string[];

    /**
     * Constructor.
     *
     * @param {string[]} languages
     */
    constructor(languages: string[]) {

        this.languages = languages;

    }

    /**
     * Retrieve the language of the browser.
     * If the language of the browser is not supported it fallbacks to en.
     *
     * @return {string}
     */
    getLanguage(): string {

        let languageVendorList = 'en';
        const browserLanguage = navigator.language.split('-', 2)[0];

        if (this.languages.includes(browserLanguage)) {

            languageVendorList = browserLanguage;

        }

        return languageVendorList.toLowerCase();

    }

}

export default CmpSupportedLanguageProvider;

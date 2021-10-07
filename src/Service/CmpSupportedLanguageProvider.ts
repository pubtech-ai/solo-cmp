/**
 * CmpSupportedLanguageProvider.
 */
export class CmpSupportedLanguageProvider {

    public static readonly defaultLanguage: string = 'en';
    private readonly language: string;
    private readonly userLanguage: string;
    private readonly cmpSupportedLanguages: string[];

    /**
     * Constructor.
     *
     * @param {string[]} supportedLanguages
     * @param {string} userLanguage
     */
    constructor(supportedLanguages: string[], userLanguage: string) {

        let languageVendorList = CmpSupportedLanguageProvider.defaultLanguage;

        const cleanedUserLanguage = userLanguage.split('-', 2)[0];

        if (cleanedUserLanguage.length != 2) {

            throw new Error('The UserLanguage parameter must be a 2-character string');

        }

        if (supportedLanguages.includes(cleanedUserLanguage)) {

            languageVendorList = cleanedUserLanguage;

        }

        this.cmpSupportedLanguages = supportedLanguages;
        this.userLanguage = cleanedUserLanguage;
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
     * Retrieve the current language of user.
     *
     * @return {string}
     */
    getUserLanguage(): string {

        return this.userLanguage;

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

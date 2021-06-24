import LoggerService from './LoggerService';

/**
 * CookieService.
 */
class CookieService {

    public static readonly milliSecondsInADay: number = 86400000;

    private logger: LoggerService;
    private hostName: string;
    private document: Document;

    /**
     * Constructor.
     *
     * @param {LoggerService} logger
     * @param {string} hostName
     * @param {Document} document
     */
    constructor(logger: LoggerService, hostName: string, document: Document) {

        this.logger = logger;
        this.hostName = hostName;
        this.document = document;

    }

    /**
     * Set the cookie with name and value with expires
     * date calculated from the expiresDays provided.
     *
     * @param {string} cookieName
     * @param {string} cookieValue
     * @param {number} days
     */
    public setCookie(cookieName: string, cookieValue: string, days: number): void {

        const date = new Date();
        date.setTime(date.getTime() + days * CookieService.milliSecondsInADay);

        const expires = 'expires=' + date.toUTCString();
        const domain = CookieService.getCleanedDomain(this.hostName);

        this.document.cookie = `${cookieName}=${cookieValue};${expires};path=/;domain=${domain}`;

    }

    /**
     * Return the cookie from cookie name provided.
     *
     * @param {string} cookieName
     * @return {string}
     */
    public getCookie(cookieName: string): string {

        const name = cookieName + '=';
        let decodedCookie = this.document.cookie;

        try {

            decodedCookie = decodeURIComponent(this.document.cookie);

        } catch (error) {

            this.logger.error('decodeURIComponent error when read cookie, fallback to document.cookie.', error);

        }

        const cookieArray = decodedCookie.split(';');

        for (let i = 0; i < cookieArray.length; i++) {

            let cookie = cookieArray[i];

            while (cookie.charAt(0) == ' ') {

                cookie = cookie.substring(1);

            }

            if (cookie.indexOf(name) == 0) {

                return cookie.substring(name.length, cookie.length);

            }

        }

        return '';

    }

    /**
     * Remove all possible cookie with the name provided.
     *
     * @param {string} cookieName
     */
    public removeCookiesByName(cookieName: string): void {

        const allPossibleDomainGenerated: string[] = [];
        allPossibleDomainGenerated.push(CookieService.getCleanedDomain(this.hostName));
        allPossibleDomainGenerated.push(this.hostName);
        allPossibleDomainGenerated.push('.' + this.hostName);

        allPossibleDomainGenerated.forEach((domain) => {

            this.document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`;

            this.logger.debug('Deleted cookie: ' + cookieName + ' for domain: ' + domain);

        });

    }

    /**
     * Clean the hostname from string.
     *
     * @param {string} hostName
     *
     * @private
     * @return {string}
     */
    private static getCleanedDomain(hostName: string): string {

        let cleanedDomain = '';
        let domainTdlLength = 2;
        const isLocalHost = 'localhost' === hostName;

        isLocalHost || (0 !== hostName.indexOf('www.') && (hostName = 'www.' + hostName));

        const hostPieces = hostName.split('.');
        const checkPort = /^[0-9]+$/.test(hostName.split(':')[0].split('.').join(''));
        const domain = hostPieces[hostPieces.length - 2];

        if (!isLocalHost) {

            checkPort ||
                (3 < hostPieces.length && domain.length < 4 && (domainTdlLength = 3),
                (cleanedDomain = '.' + hostName.split('.').reverse().slice(0, domainTdlLength).reverse().join('.')));

        }

        return cleanedDomain;

    }

}

export default CookieService;

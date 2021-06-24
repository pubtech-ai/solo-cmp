/**
 * LoggerService.
 */
class LoggerService {

    private isDebug: boolean;
    public static readonly debugStyle: string = 'color: #b1c800; font-size: 12px; padding: 10px;';
    public static readonly errorStyle: string = 'color: #b42d2d; font-size: 12px; padding: 10px;';

    /**
     * Constructor.
     *
     * @param {boolean} isDebug
     */
    constructor(isDebug: boolean) {

        this.isDebug = isDebug;

        if (this.isDebug) {

            this.debug('ENABLED');

        }

    }

    /**
     * Wrap base console.debug to mark with label of solo-cmp.
     *
     * @param {string} message
     * @param {[]} errors
     */
    public debug(message: string, ...errors: any[]): void {

        if (this.isDebug) {

            // eslint-disable-next-line
            console.debug('%c SOLO-CMP DEBUG: ' + message, LoggerService.debugStyle, '\n', ...errors);
        }

    }

    /**
     * Wrap base console.trace to mark with label of solo-cmp.
     *
     * @param {string} message
     * @param {[]} errors
     */
    public error(message: string, ...errors: any[]): void {

        // eslint-disable-next-line
        console.trace('%c SOLO-CMP ERROR: ' + message, LoggerService.errorStyle, '\n', ...errors);
    }

}

export default LoggerService;

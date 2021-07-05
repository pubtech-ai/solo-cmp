import ConsentRequiredEvent from '../Event/ConsentRequiredEvent';
import MoreChoicesEvent from '../Event/MoreChoicesEvent';
import EventSubscriberInterface from '../EventDispatcher/EventSubscriberInterface';

/**
 * AmpSubscriber.
 */
class AmpSubscriber implements EventSubscriberInterface {

    private window: Window;
    private readonly ampEnabled: boolean;
    private readonly initialHeightAmpCmpUi: string;
    private readonly enableBorder: boolean;

    /**
     * Constructor
     *
     * @param {boolean} ampEnabled
     * @param {Window} window
     * @param {string} initialHeightAmpCmpUi
     * @param {boolean} enableBorder
     */
    constructor(
        ampEnabled: boolean,
        window: Window,
        initialHeightAmpCmpUi: string | null = null,
        enableBorder: boolean | null = false,
    ) {

        this.ampEnabled = ampEnabled;
        this.window = window;

        this.initialHeightAmpCmpUi = '30vh';

        if (initialHeightAmpCmpUi !== null) {

            this.initialHeightAmpCmpUi = initialHeightAmpCmpUi;

        }

        this.enableBorder = false;

        if (enableBorder !== null) {

            this.enableBorder = enableBorder;

        }

    }

    /**
     * @inheritdoc
     */
    public getSubscribedEvents(): Record<string, string> {

        if (!this.ampEnabled) {

            return {};

        }

        return {
            [ConsentRequiredEvent.EVENT_NAME]: 'onConsentRequired',
            [MoreChoicesEvent.EVENT_NAME]: 'onMoreChoices',
        };

    }

    /**
     * The first time the CMP is opened in an AMP environment
     * you must start with a max height of 30vh.
     *
     * @param {ConsentRequiredEvent} event
     */
    public onConsentRequired(event: ConsentRequiredEvent) {

        this.window.parent.postMessage(
            {
                type: 'consent-ui',
                action: 'ready',
                initialHeight: this.initialHeightAmpCmpUi,
                enableBorder: this.enableBorder,
            },
            '*',
        );

    }

    /**
     * CMP UI dispatch that event when the user click on a 'More Option' button
     * you can show the AMP version of your CMP with a fullscreen UI.
     *
     * @param {MoreChoicesEvent} event
     */
    public onMoreChoices(event: MoreChoicesEvent): void {

        this.window.parent.postMessage(
            {
                action: 'enter-fullscreen',
                type: 'consent-ui',
            },
            '*',
        );

    }

    static getClassName(): string {

        return 'AmpSubscriber';

    }

}

export default AmpSubscriber;

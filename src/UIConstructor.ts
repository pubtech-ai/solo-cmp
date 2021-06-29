/**
 * UIConstructor.
 */
class UIConstructor {

    private readonly renderCmpCallback: CallableFunction;
    private readonly renderOpenCmpCallback: CallableFunction;
    private readonly domElementId: string;
    private readonly document: HTMLDocument;

    /**
	 * Constructor.
	 *
	 * @param {HTMLDocument} document
	 * @param {string} domElementId
	 * @param {CallableFunction} renderCmpCallback
	 * @param {CallableFunction} renderOpenCmpCallback
	 */
    constructor(
        document: HTMLDocument,
        domElementId: string,
        renderCmpCallback: CallableFunction,
        renderOpenCmpCallback: CallableFunction,
    ) {

        this.document = document;

        if (domElementId.length === 0 || !(/^[a-z0-9]+$/i.test(domElementId))) {
            throw new Error('UIConstructor, domElementId must be a string with length greater than zero and contains only letters and numbers.');
        }

        this.domElementId = domElementId;
        this.renderCmpCallback = renderCmpCallback;
        this.renderOpenCmpCallback = renderOpenCmpCallback;

    }

    /**
	 * When the DOM is ready it will build and render
	 * the CMP with provided callback.
	 */
    public buildUIAndRender(): void {

        if (this.isDOMDocumentReady()) {

            this.document.addEventListener('DOMContentLoaded', () => {

                this.renderCmpCallback(this.prepareRootDOMElement());

            });

        } else {

            this.renderCmpCallback(this.prepareRootDOMElement());

        }

    }

    /**
	 * When the DOM is ready it will build and render
	 * the CMP open button with provided callback.
	 */
    public buildOpenCmpButtonAndRender(): void {

        if (this.isDOMDocumentReady()) {

            this.document.addEventListener('DOMContentLoaded', () => {

                this.renderOpenCmpCallback(this.prepareRootDOMElement());

            });

        } else {

            this.renderOpenCmpCallback(this.prepareRootDOMElement());

        }

    }

    /**
	 * Check if the DOM is ready to add dynamic HTMLElements.
	 * @private
     *
     * @return {boolean}
	 */
    private isDOMDocumentReady(): boolean {

        return typeof this.document !== 'undefined' &&
			typeof this.document.readyState !== 'undefined' &&
			this.document.readyState == 'loading';

    }

    /**
	 * This method check if DOM have the element with the id
	 * provided otherwise it will create a new one.
	 *
	 * @return {HTMLElement}
	 */
    private prepareRootDOMElement(): HTMLElement {

        let rootElement = this.document.getElementById(this.domElementId);

        if (rootElement === null || rootElement === undefined) {

            const appContainer = this.document.createElement('div');
            appContainer.id = this.domElementId;
            rootElement = appContainer;
            this.document.getElementsByTagName('body')[0].appendChild(appContainer);

        }

        rootElement.innerHTML = '';

        return rootElement;

    }

}

export default UIConstructor;
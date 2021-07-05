import {BaseEvent} from '../EventDispatcher';
import {UIChoicesBridgeDto} from '../UIChoicesBridge';
import {SoloCmpDataBundle} from '../SoloCmpDataBundle';

/**
 * ApplyConsentEvent.
 */
export class ApplyConsentEvent implements BaseEvent {

    readonly EVENT_NAME = 'ApplyConsentEvent';
    static readonly EVENT_NAME = 'ApplyConsentEvent';

    private readonly _uiChoicesBridgeDto: UIChoicesBridgeDto;
    private readonly _soloCmpDataBundle: SoloCmpDataBundle;

    /**
     * Constructor.
     *
     * @param {UIChoicesBridgeDto} uiChoicesBridgeDto
     * @param {SoloCmpDataBundle} soloCmpDataBundle
     */
    constructor(uiChoicesBridgeDto: UIChoicesBridgeDto, soloCmpDataBundle: SoloCmpDataBundle) {

        this._uiChoicesBridgeDto = uiChoicesBridgeDto;
        this._soloCmpDataBundle = soloCmpDataBundle;

    }

    get uiChoicesBridgeDto(): UIChoicesBridgeDto {

        return this._uiChoicesBridgeDto;

    }

    get soloCmpDataBundle(): SoloCmpDataBundle {

        return this._soloCmpDataBundle;

    }

}

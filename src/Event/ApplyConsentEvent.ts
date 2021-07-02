import BaseEvent from '../EventDispatcher/BaseEvent';
import UIChoicesBridgeDto from '../UIChoicesBridge/UIChoicesBridgeDto';
import SoloCmpDataBundle from '../SoloCmpDataBundle';

/**
 * ApplyConsentEvent.
 */
class ApplyConsentEvent implements BaseEvent {

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

export default ApplyConsentEvent;

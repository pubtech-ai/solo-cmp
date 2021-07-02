import BaseEvent from '../EventDispatcher/BaseEvent';
import UIChoicesBridgeDto from '../UIChoicesBridge/UIChoicesBridgeDto';

/**
 * ApplyConsentEvent.
 */
class ApplyConsentEvent implements BaseEvent {

    private readonly _uiChoicesBridgeDto: UIChoicesBridgeDto;

    /**
     * Constructor.
     *
     * @param {UIChoicesBridgeDto} uiChoicesBridgeDto
     */
    constructor(uiChoicesBridgeDto: UIChoicesBridgeDto) {

        this._uiChoicesBridgeDto = uiChoicesBridgeDto;

    }

    get uiChoicesBridgeDto(): UIChoicesBridgeDto {

        return this._uiChoicesBridgeDto;

    }

}

export default ApplyConsentEvent;

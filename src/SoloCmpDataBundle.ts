import {UIChoicesBridgeDto} from './UIChoicesBridge';
import {TCModel} from '@iabtcf/core';
import {ACModel} from './Entity';

/**
 * SoloCmpDataBundle.
 */
export class SoloCmpDataBundle {

    private readonly _tcModel: TCModel;
    private readonly _acModel: ACModel;
    private readonly _uiChoicesBridgeDto: UIChoicesBridgeDto;
    private readonly _isConsentRequest: boolean;

    /**
     * Constructor.
     *
     * @param {UIChoicesBridgeDto} uiChoicesBridgeDto
     * @param {TCModel} tcModel
     * @param {ACModel} acModel
     * @param {boolean} isConsentRequest
     * @private
     */
    constructor(uiChoicesBridgeDto: UIChoicesBridgeDto, tcModel: TCModel, acModel: ACModel, isConsentRequest: boolean) {

        this._uiChoicesBridgeDto = uiChoicesBridgeDto;
        this._tcModel = tcModel;
        this._acModel = acModel;
        this._isConsentRequest = isConsentRequest;

    }

    get uiChoicesBridgeDto(): UIChoicesBridgeDto {

        return this._uiChoicesBridgeDto;

    }

    get tcModel(): TCModel {

        return this._tcModel;

    }

    get acModel(): ACModel {

        return this._acModel;

    }

    get isConsentRequest(): boolean {

        return this._isConsentRequest;

    }

}

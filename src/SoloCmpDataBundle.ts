import UIChoicesBridgeDto from './UIChoicesBridge/UIChoicesBridgeDto';
import {TCModel} from '@iabtcf/core';
import ACModel from './Entity/ACModel';

/**
 * SoloCmpDataBundle.
 */
class SoloCmpDataBundle {

    private readonly _tcModel: TCModel;
    private readonly _acModel: ACModel;
    private readonly _uiChoicesBridgeDto: UIChoicesBridgeDto;

    /**
     * Constructor.
     *
     * @param {UIChoicesBridgeDto} uiChoicesBridgeDto
     * @param {TCModel} tcModel
     * @param {ACModel} acModel
     * @private
     */
    constructor(uiChoicesBridgeDto: UIChoicesBridgeDto, tcModel: TCModel, acModel: ACModel) {

        this._uiChoicesBridgeDto = uiChoicesBridgeDto;
        this._tcModel = tcModel;
        this._acModel = acModel;

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

}

export default SoloCmpDataBundle;

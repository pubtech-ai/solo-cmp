import {TCModel} from '@iabtcf/core';
import ACModel from '../Entity/ACModel';
import PurposeOption from '../Entity/PurposeOption';
import VendorOption from '../Entity/VendorOption';
import UIChoicesBridgeDto from './UIChoicesBridgeDto';

/**
 * UIChoicesParser.
 */
class UIChoicesParser {

    private readonly _tcModel: TCModel;
    private readonly _acModel: ACModel;

    /**
     * Constructor.
     *
     * @param {TCModel} tcModel
     * @param {ACModel} acModel
     * @private
     */
    constructor(tcModel: TCModel, acModel: ACModel) {

        this._tcModel = tcModel.clone();
        this._tcModel.unsetAll();
        this._acModel = acModel;

    }

    /**
     * Parse the choices to build the
     * TCModel with all choices applied.
     *
     * @param {UIChoicesBridgeDto} uiChoicesBridgeDto
     *
     * @return {TCModel}
     */
    public parseTCModel(uiChoicesBridgeDto: UIChoicesBridgeDto): TCModel {

        this._tcModel.purposeConsents.set(this.filterEnabledChoicesId(uiChoicesBridgeDto.UIPurposeChoices));
        this._tcModel.vendorConsents.set(this.filterEnabledChoicesId(uiChoicesBridgeDto.UIVendorChoices));
        this._tcModel.purposeLegitimateInterests.set(
            this.filterEnabledChoicesId(uiChoicesBridgeDto.UILegitimateInterestsPurposeChoices),
        );
        this._tcModel.vendorLegitimateInterests.set(
            this.filterEnabledChoicesId(uiChoicesBridgeDto.UILegitimateInterestsVendorChoices),
        );

        return this._tcModel;

    }

    /**
     * Parse the choices to build the
     * ACModel with all choices applied.
     *
     * @param {UIChoicesBridgeDto} uiChoicesBridgeDto
     *
     * @return {ACModel}
     */
    public parseACModel(uiChoicesBridgeDto: UIChoicesBridgeDto): ACModel {

        this._acModel.googleVendorOptions = uiChoicesBridgeDto.UIGoogleVendorOptions;

        return this._acModel;

    }

    /**
     * Return the enabled choices id.
     *
     * @param {PurposeOption[] | VendorOption[]} choices
     * @private
     *
     * @return {number[]}
     */
    private filterEnabledChoicesId(choices: PurposeOption[] | VendorOption[]): number[] {

        const allChoices = [...choices];

        const enabledChoices = allChoices.filter((choice) => choice.state && !isNaN(choice.id));

        return enabledChoices.map((choice) => Number(choice.id));

    }

    get tcModel(): TCModel {

        return this._tcModel;

    }

    get acModel(): ACModel {

        return this._acModel;

    }

}

export default UIChoicesParser;

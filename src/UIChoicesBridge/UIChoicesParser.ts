import {TCModel} from '@iabtcf/core';
import {ACModel, PurposeOption, VendorOption} from '../Entity';
import {UIChoicesBridgeDto} from './UIChoicesBridgeDto';

/**
 * UIChoicesParser.
 */
export class UIChoicesParser {

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
        this._tcModel.specialFeatureOptins.set(this.filterEnabledChoicesId(uiChoicesBridgeDto.UISpecialFeatureChoices));
        this._tcModel.purposeLegitimateInterests.set(
            this.filterEnabledChoicesId(uiChoicesBridgeDto.UILegitimateInterestsPurposeChoices),
        );
        this._tcModel.vendorLegitimateInterests.set(
            this.filterEnabledChoicesId(uiChoicesBridgeDto.UILegitimateInterestsVendorChoices),
        );

        this._tcModel.publisherConsents.set(this.filterEnabledChoicesId(uiChoicesBridgeDto.UIPurposeChoices));
        this._tcModel.publisherLegitimateInterests.set(
            this.filterEnabledChoicesId(uiChoicesBridgeDto.UILegitimateInterestsPurposeChoices),
        );

        return this._tcModel;

    }

    /**
     * Build the TCString with all enabled.
     *
     * @param {boolean} isLegitimateInterestDisabled
     *
     * @return {TCModel}
     */
    public buildTCModelAllEnabled(isLegitimateInterestDisabled: boolean): TCModel {

        this._tcModel.setAll();

        // REQUIRED UNTIL SOLVED https://github.com/InteractiveAdvertisingBureau/iabtcf-es/issues/179
        this._tcModel.publisherConsents.set([...this._tcModel.purposeConsents.values()]);

        if (isLegitimateInterestDisabled) {

            this._tcModel.unsetAllPurposeLegitimateInterests();
            this._tcModel.unsetAllVendorLegitimateInterests();

        } else {

            const purposeLegitimateInterests = [...this._tcModel.purposeLegitimateInterests.values()].filter(
                (purposeId) => purposeId !== 1,
            );
            this._tcModel.publisherLegitimateInterests.set(purposeLegitimateInterests);

        }

        return this._tcModel;

    }

    /**
     * Build the ACString with all vendors enabled.
     *
     * @return {ACModel}
     */
    public buildACModelAllEnabled(): ACModel {

        this._acModel.googleVendorOptions.forEach((googleVendor) => googleVendor.state = true);

        return this._acModel;

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

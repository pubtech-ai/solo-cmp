import {TCModel} from '@iabtcf/core';
import {ACModel, PurposeOption, VendorOption} from '../Entity';
import {UIChoicesBridgeDto} from './UIChoicesBridgeDto';

/**
 * UIChoicesParser.
 */
export class UIChoicesParser {

    private readonly _tcModel: TCModel;
    private readonly _acModel: ACModel;
    private readonly isLegitimateInterestDisabled: boolean;
    private readonly legitimateMirror: boolean;

    /**
     * Constructor.
     *
     * @param {TCModel} tcModel
     * @param {ACModel} acModel
     * @param {boolean} isLegitimateInterestDisabled
     * @param {boolean} legitimateMirror
     * @private
     */
    constructor(
        tcModel: TCModel,
        acModel: ACModel,
        isLegitimateInterestDisabled: boolean,
        legitimateMirror: boolean,
    ) {

        this._tcModel = tcModel.clone();
        this._tcModel.unsetAll();
        this._acModel = acModel;
        this.isLegitimateInterestDisabled = isLegitimateInterestDisabled;
        this.legitimateMirror = legitimateMirror;

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

        const enabledPurposes = this.filterEnabledChoicesId(uiChoicesBridgeDto.UIPurposeChoices);
        const enabledVendors = this.filterEnabledChoicesId(uiChoicesBridgeDto.UIVendorChoices);
        this._tcModel.purposeConsents.set(enabledPurposes);
        this._tcModel.vendorConsents.set(enabledVendors);
        this._tcModel.specialFeatureOptins.set(this.filterEnabledChoicesId(uiChoicesBridgeDto.UISpecialFeatureChoices));

        let legIntPurposes = this.filterEnabledChoicesId(uiChoicesBridgeDto.UILegitimateInterestsPurposeChoices);
        let legIntVendors = this.filterEnabledChoicesId(uiChoicesBridgeDto.UILegitimateInterestsVendorChoices);
        let letIntPurposesPublisher = this.filterEnabledChoicesId(
            uiChoicesBridgeDto.UILegitimateInterestsPurposeChoices,
        );

        if (this.legitimateMirror) {

            legIntPurposes = enabledPurposes.filter((purposeId) => purposeId != 1);
            legIntVendors = enabledVendors;
            letIntPurposesPublisher = enabledPurposes.filter((purposeId) => purposeId != 1);

        }

        this._tcModel.purposeLegitimateInterests.set(legIntPurposes);
        this._tcModel.vendorLegitimateInterests.set(legIntVendors);
        this._tcModel.publisherConsents.set(enabledPurposes);
        this._tcModel.publisherLegitimateInterests.set(letIntPurposesPublisher);

        return this._tcModel;

    }

    /**
     * Build the TCString with all enabled.
     *
     * @return {TCModel}
     */
    public buildTCModelAllEnabled(): TCModel {

        this._tcModel.setAll();

        // REQUIRED UNTIL SOLVED https://github.com/InteractiveAdvertisingBureau/iabtcf-es/issues/179
        this._tcModel.publisherConsents.set([...this._tcModel.purposeConsents.values()]);

        if (this.isLegitimateInterestDisabled && !this.legitimateMirror) {

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

        this._acModel.googleVendorOptions.forEach((googleVendor) => (googleVendor.state = true));

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

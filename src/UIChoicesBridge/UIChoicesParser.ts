import {PurposeRestriction, RestrictionType, TCModel} from '@iabtcf/core';
import {ACModel, PurposeLegitimateInterestOption, PurposeOption, VendorOption} from '../Entity';
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

        const acceptedPurposeIds = this.filterEnabledChoicesId(uiChoicesBridgeDto.UIPurposeChoices);

        const acceptedVendorIds: number[] = [];
        acceptedPurposeIds.forEach((id) => {

            const vendorsIds = Object.values(this._tcModel.gvl.getVendorsWithConsentPurpose(id)).map((vendor) => {

                return Number(vendor.id);

            });

            acceptedVendorIds.push(...vendorsIds);

        });

        // Set all purposeConsents enabled.
        this._tcModel.purposeConsents.set(acceptedPurposeIds);
        // Set all vendor that have the purposeConsent enabled.
        this._tcModel.vendorConsents.set(acceptedVendorIds);

        // Add restrictions to vendors
        uiChoicesBridgeDto.UIPurposeChoices.forEach((purposeOption) => {

            const restrictionVendors = purposeOption.vendorsRestriction;

            const enabledRestrictionVendors = restrictionVendors.filter((purposeVendorRestrictionOption) => {

                return purposeVendorRestrictionOption.state;

            });

            // If a user disables all vendor for a purpose, we disable directly the purpose.
            if (enabledRestrictionVendors.length == restrictionVendors.length) {

                this._tcModel.purposeConsents.unset(purposeOption.id);
                return;

            }

            const purposeRestriction = new PurposeRestriction(purposeOption.id, RestrictionType.NOT_ALLOWED);

            restrictionVendors.forEach((restrictionVendor) => {

                if (restrictionVendor.state) {

                    this._tcModel.publisherRestrictions.add(restrictionVendor.id, purposeRestriction);

                } else {

                    this._tcModel.publisherRestrictions.remove(restrictionVendor.id, purposeRestriction);

                }

            });

        });

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
     * @param {PurposeOption[] | VendorOption[] | PurposeLegitimateInterestOption[]} choices
     * @private
     *
     * @return {number[]}
     */
    private filterEnabledChoicesId(
        choices: PurposeOption[] | VendorOption[] | PurposeLegitimateInterestOption[],
    ): number[] {

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

import {
    PurposeOption,
    VendorOption,
    GoogleVendorOption,
    SpecialFeatureOption,
    PurposeLegitimateInterestOption,
} from '../Entity';

/**
 * UIChoicesBridgeDto.
 */
export class UIChoicesBridgeDto {

    private readonly _UIPurposeChoices: PurposeOption[] = [];
    private readonly _UISpecialFeatureChoices: SpecialFeatureOption[] = [];
    private readonly _UILegitimateInterestsPurposeChoices: PurposeLegitimateInterestOption[] = [];
    private readonly _UILegitimateInterestsVendorChoices: VendorOption[] = [];
    private readonly _UIGoogleVendorOptions: GoogleVendorOption[] = [];

    /**
     * Constructor.
     *
     * @param {PurposeOption[]} UIPurposeChoices
     * @param {SpecialFeatureOption[]} UISpecialFeatureChoices
     * @param {PurposeLegitimateInterestOption[]} UILegitimateInterestsPurposeChoices
     * @param {VendorOption[]} UILegitimateInterestsVendorChoices
     * @param {GoogleVendorOption[]} UIGoogleVendorOptions
     */
    constructor(
        UIPurposeChoices: PurposeOption[],
        UISpecialFeatureChoices: SpecialFeatureOption[],
        UILegitimateInterestsPurposeChoices: PurposeLegitimateInterestOption[],
        UILegitimateInterestsVendorChoices: VendorOption[],
        UIGoogleVendorOptions: GoogleVendorOption[],
    ) {

        this._UIPurposeChoices = UIPurposeChoices;
        this._UISpecialFeatureChoices = UISpecialFeatureChoices;
        this._UILegitimateInterestsPurposeChoices = UILegitimateInterestsPurposeChoices;
        this._UILegitimateInterestsVendorChoices = UILegitimateInterestsVendorChoices;
        this._UIGoogleVendorOptions = UIGoogleVendorOptions;

    }

    get UIPurposeChoices(): PurposeOption[] {

        return this._UIPurposeChoices;

    }

    get UISpecialFeatureChoices(): SpecialFeatureOption[] {

        return this._UISpecialFeatureChoices;

    }

    get UILegitimateInterestsPurposeChoices(): PurposeLegitimateInterestOption[] {

        return this._UILegitimateInterestsPurposeChoices;

    }

    get UILegitimateInterestsVendorChoices(): VendorOption[] {

        return this._UILegitimateInterestsVendorChoices;

    }

    get UIGoogleVendorOptions(): GoogleVendorOption[] {

        return this._UIGoogleVendorOptions;

    }

}

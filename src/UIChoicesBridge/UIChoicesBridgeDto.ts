import {PurposeOption, VendorOption, GoogleVendorOption, SpecialFeatureOption} from '../Entity';

/**
 * UIChoicesBridgeDto.
 */
export class UIChoicesBridgeDto {

    private readonly _UIPurposeChoices: PurposeOption[] = [];
    private readonly _UISpecialFeatureChoices: SpecialFeatureOption[] = [];
    private readonly _UIVendorChoices: VendorOption[] = [];
    private readonly _UILegitimateInterestsPurposeChoices: PurposeOption[] = [];
    private readonly _UILegitimateInterestsVendorChoices: VendorOption[] = [];
    private readonly _UIGoogleVendorOptions: GoogleVendorOption[] = [];

    /**
     * Constructor.
     *
     * @param {PurposeOption[]} UIPurposeChoices
     * @param {SpecialFeatureOption[]} UISpecialFeatureChoices
     * @param {VendorOption[]} UIVendorChoices
     * @param {PurposeOption[]} UILegitimateInterestsPurposeChoices
     * @param {VendorOption[]} UILegitimateInterestsVendorChoices
     * @param {GoogleVendorOption[]} UIGoogleVendorOptions
     */
    constructor(
        UIPurposeChoices: PurposeOption[],
        UISpecialFeatureChoices: SpecialFeatureOption[],
        UIVendorChoices: VendorOption[],
        UILegitimateInterestsPurposeChoices: PurposeOption[],
        UILegitimateInterestsVendorChoices: VendorOption[],
        UIGoogleVendorOptions: GoogleVendorOption[],
    ) {

        this._UIPurposeChoices = UIPurposeChoices;
        this._UISpecialFeatureChoices = UISpecialFeatureChoices;
        this._UIVendorChoices = UIVendorChoices;
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

    get UIVendorChoices(): VendorOption[] {

        return this._UIVendorChoices;

    }

    get UILegitimateInterestsPurposeChoices(): PurposeOption[] {

        return this._UILegitimateInterestsPurposeChoices;

    }

    get UILegitimateInterestsVendorChoices(): VendorOption[] {

        return this._UILegitimateInterestsVendorChoices;

    }

    get UIGoogleVendorOptions(): GoogleVendorOption[] {

        return this._UIGoogleVendorOptions;

    }

}

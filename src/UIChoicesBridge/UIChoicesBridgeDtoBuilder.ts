import {Feature, Purpose, TCModel, Vendor} from '@iabtcf/core';
import {IntMap} from '@iabtcf/core/lib/model';
import {
    ACModel,
    PurposeOption,
    VendorFeature,
    VendorPurpose,
    VendorOption,
    GoogleVendorOption,
    SpecialFeatureOption,
} from '../Entity';
import {UIChoicesBridgeDto} from './UIChoicesBridgeDto';

/**
 * UIChoicesBridgeDtoBuilder.
 */
export class UIChoicesBridgeDtoBuilder {

    private _UIPurposeChoices: PurposeOption[] = [];
    private _UISpecialFeatureOptInsChoices: SpecialFeatureOption[] = [];
    private _UIVendorChoices: VendorOption[] = [];
    private _UILegitimateInterestsPurposeChoices: PurposeOption[] = [];
    private _UILegitimateInterestsVendorChoices: VendorOption[] = [];
    private _UIGoogleVendorOptions: GoogleVendorOption[] = [];

    private readonly firstTimeConsentRequest: boolean;

    /**
     * Constructor.
     *
     * @param {TCModel} tcModel
     * @param {ACModel} acModel
     * @param {boolean} firstTimeConsentRequest
     * @param {boolean} isLegitimateInterestDisabled
     * @private
     */
    constructor(
        tcModel: TCModel,
        acModel: ACModel,
        firstTimeConsentRequest: boolean,
        isLegitimateInterestDisabled: boolean,
    ) {

        this.firstTimeConsentRequest = firstTimeConsentRequest;

        this.buildUIPurposeChoices(tcModel);
        this.buildUISpecialFeatureOptInsChoices(tcModel);
        this.buildUIVendorChoices(tcModel);

        if (!isLegitimateInterestDisabled) {

            this.buildUILegitimateInterestsChoices(tcModel);

        }

        this.buildUIGoogleVendorOptions(acModel);

    }

    /**
     * Create the UIChoicesBridgeDto.
     *
     * @return {UIChoicesBridgeDto}
     */
    public createUIChoicesBridgeDto(): UIChoicesBridgeDto {

        return new UIChoicesBridgeDto(
            this._UIPurposeChoices,
            this._UISpecialFeatureOptInsChoices,
            this._UIVendorChoices,
            this._UILegitimateInterestsPurposeChoices,
            this._UILegitimateInterestsVendorChoices,
            this._UIGoogleVendorOptions,
        );

    }

    /**
     * Build the UIPurposeChoices with the provided TCModel and set
     * status in base of the consent enabled in it.
     *
     * @param {TCModel} tcModel
     * @private
     */
    private buildUIPurposeChoices(tcModel: TCModel): void {

        this._UIPurposeChoices = this.buildUIConsentChoices(tcModel, tcModel.gvl.purposes, 'purposeConsents', 'getVendorsWithConsentPurpose');

    }

    /**
     * Build the UISpecialFeatureOptInsChoices with the provided TCModel and set
     * status in base of the consent enabled in it.
     *
     * @param {TCModel} tcModel
     * @private
     */
    private buildUISpecialFeatureOptInsChoices(tcModel: TCModel): void {

        this._UISpecialFeatureOptInsChoices = this.buildUIConsentChoices(tcModel, tcModel.gvl.specialFeatures, 'specialFeatureOptins', 'getVendorsWithSpecialFeature');

    }

    /**
     * Build UI Consent choices.
     *
     * @param {TCModel} tcModel
     * @param {IntMap<Purpose> | IntMap<Feature>}tcfChoices
     * @param {string} tcfModelStateChoices
     * @param {string} tcfGVLMethod
     * @private
     *
     * @return {PurposeOption[] | SpecialFeatureOption[]}
     */
    private buildUIConsentChoices(
        tcModel,
        tcfChoices,
        tcfModelStateChoices,
        tcfGVLMethod,
    ): PurposeOption[] | SpecialFeatureOption[] {

        const choicesIds: string[] = Object.keys(tcfChoices);

        const consentOptions: PurposeOption[] | SpecialFeatureOption[] = [];

        choicesIds.forEach((choiceId) => {

            const choice: Purpose | Feature = tcfChoices[choiceId];
            consentOptions.push({
                state: tcModel[tcfModelStateChoices].has(choice.id),
                id: Number(choice.id),
                title: choice.name,
                description: choice.description,
                legalDescription: choice.descriptionLegal,
                vendors: tcModel.gvl[tcfGVLMethod](choice.id),
            });

        });

        return consentOptions;

    }

    /**
     * Build the UIVendorChoices with the provided TCModel and set
     * status in base of the consent enabled in it.
     *
     * @param {TCModel} tcModel
     * @private
     */
    private buildUIVendorChoices(tcModel: TCModel): void {

        const vendors = tcModel.gvl.vendors;

        const vendorIds: string[] = Object.keys(vendors);

        this._UIVendorChoices = this.buildUIConsentVendorChoices(tcModel, vendorIds, vendors, 'vendorConsents');

    }

    /**
     * Build the UILegitimateInterestsPurposeChoices and
     * UILegitimateInterestsVendorChoices with the provided
     * TCModel and set status in base of the consent enabled in it.
     *
     * @param {TCModel} tcModel
     * @private
     */
    private buildUILegitimateInterestsChoices(tcModel: TCModel): void {

        const allVendorsWithLegitimateInterests = this.buildLegitimateInterestsPurposeOptions(tcModel);

        this.buildLegitimateInterestsVendorOptions(allVendorsWithLegitimateInterests, tcModel);

    }

    /**
     * Build the UILegitimateInterestsVendorChoices with the provided TCModel and set
     * status in base of the consent enabled in it.
     *
     * @param {array} allVendorsWithLegitimateInterests
     * @param {TCModel} tcModel
     * @private
     */
    private buildLegitimateInterestsVendorOptions(
        allVendorsWithLegitimateInterests: IntMap<Vendor>,
        tcModel: TCModel,
    ): void {

        const vendorIds = Object.keys(allVendorsWithLegitimateInterests);

        this._UILegitimateInterestsVendorChoices = this.buildUIConsentVendorChoices(tcModel, vendorIds, allVendorsWithLegitimateInterests, 'vendorLegitimateInterests');

    }

    /**
     * Build UI Consent for Vendor Choices.
     *
     * @param {TCModel} tcModel
     * @param {string[]} vendorIds
     * @param {IntMap<Vendor>} allVendorsWithLegitimateInterests
     * @param {string} tcfModelStateChoices
     * @private
     *
     * @return {VendorOption[]}
     */
    private buildUIConsentVendorChoices(
        tcModel: TCModel,
        vendorIds: string[],
        allVendorsWithLegitimateInterests: IntMap<Vendor>,
        tcfModelStateChoices: string): VendorOption[] {

        const consentVendorOptions: VendorOption[] = [];

        vendorIds.forEach((vendorId) => {

            const vendor: Vendor = allVendorsWithLegitimateInterests[vendorId];

            // IAB use null instead of NaN, it's a bad design, so we fix it!
            let cookieMaxAgeSeconds = NaN;

            if (typeof vendor.cookieMaxAgeSeconds === 'number' && !isNaN(vendor.cookieMaxAgeSeconds)) {

                cookieMaxAgeSeconds = Number(vendor.cookieMaxAgeSeconds);

            }

            // Legitimate interest choices are opt-out, so the default is true
            const state = this.firstTimeConsentRequest ? true : tcModel[tcfModelStateChoices].has(vendor.id);

            consentVendorOptions.push({
                state: state,
                features: UIChoicesBridgeDtoBuilder
                    .buildVendorPurposesOrVendorFeatures(vendor.features, tcModel.gvl.features),
                flexiblePurposes: vendor.flexiblePurposes,
                id: Number(vendor.id),
                legIntPurposes: vendor.legIntPurposes,
                name: vendor.name,
                policyUrl: vendor.policyUrl,
                cookieMaxAgeSeconds: cookieMaxAgeSeconds,
                purposes: UIChoicesBridgeDtoBuilder
                    .buildVendorPurposesOrVendorFeatures(vendor.purposes, tcModel.gvl.purposes),
                specialFeatures: UIChoicesBridgeDtoBuilder.buildVendorPurposesOrVendorFeatures(
                    vendor.specialFeatures,
                    tcModel.gvl.specialFeatures,
                ),
                specialPurposes: UIChoicesBridgeDtoBuilder.buildVendorPurposesOrVendorFeatures(
                    vendor.specialPurposes,
                    tcModel.gvl.specialPurposes,
                ),
            });

        });

        return consentVendorOptions;

    }

    /**
     * Build the UILegitimateInterestsPurposeChoices with the provided TCModel and set
     * status in base of the consent enabled in it.
     *
     * @param {TCModel} tcModel
     * @private
     *
     * @return {IntMap<Vendor>}
     */
    private buildLegitimateInterestsPurposeOptions(tcModel: TCModel): IntMap<Vendor> {

        const purposes = tcModel.gvl.purposes;

        const purposeIds = Object.keys(purposes);

        let allVendorsWithLegitimateInterests = {};

        const legitimateInterestsPurposesOptions: PurposeOption[] = [];

        purposeIds.forEach((purposeId) => {

            const purpose: Purpose = purposes[purposeId];
            const vendors = tcModel.gvl.getVendorsWithLegIntPurpose(purpose.id);

            if (Object.keys(vendors).length !== 0 && vendors.constructor === Object) {

                // Legitimate interest choices are opt-out, so the default is true
                const state = this.firstTimeConsentRequest ? true : tcModel.purposeLegitimateInterests.has(purpose.id);

                legitimateInterestsPurposesOptions.push({
                    state: state,
                    id: Number(purpose.id),
                    title: purpose.name,
                    description: purpose.description,
                    legalDescription: purpose.descriptionLegal,
                    vendors: vendors,
                });

            }

            allVendorsWithLegitimateInterests = Object.assign({}, allVendorsWithLegitimateInterests, vendors);

        });

        this._UILegitimateInterestsPurposeChoices = legitimateInterestsPurposesOptions;

        return allVendorsWithLegitimateInterests;

    }

    /**
     * Build the vendor purpose entity for every purposes provided.
     *
     * @param {number[]} purposeOrFeatureIds
     * @param {IntMap<Purpose>|IntMap<Feature>} purposesOrFeatureBases
     * @private
     *
     * @return {VendorPurpose[]|VendorFeature[]}
     */
    private static buildVendorPurposesOrVendorFeatures(
        purposeOrFeatureIds: number[],
        purposesOrFeatureBases: IntMap<Purpose> | IntMap<Feature>,
    ): VendorPurpose[] | VendorFeature[] {

        const result: VendorPurpose[] | VendorFeature[] = [];

        purposeOrFeatureIds.forEach((purposeId) => {

            const purpose = purposesOrFeatureBases[purposeId];
            result.push({
                id: Number(purpose.id),
                name: purpose.name,
                description: purpose.description,
                descriptionLegal: purpose.descriptionLegal,
            });

        });

        return result;

    }

    /**
     * Build the UIGoogleVendorOptions from ACModel provided.
     *
     * @param {ACModel}acModel
     * @private
     */
    private buildUIGoogleVendorOptions(acModel: ACModel): void {

        this._UIGoogleVendorOptions = [...acModel.googleVendorOptions];

    }

}

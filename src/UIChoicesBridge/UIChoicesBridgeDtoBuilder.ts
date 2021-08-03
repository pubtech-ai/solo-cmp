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
     * @private
     */
    constructor(tcModel: TCModel, acModel: ACModel, firstTimeConsentRequest: boolean) {

        this.buildUIPurposeChoices(tcModel);
        this.buildUISpecialFeatureOptInsChoices(tcModel);
        this.buildUIVendorChoices(tcModel);
        this.buildUILegitimateInterestsChoices(tcModel);
        this.buildUIGoogleVendorOptions(acModel);

        this.firstTimeConsentRequest = firstTimeConsentRequest;

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

        const purposes = tcModel.gvl.purposes;

        const purposesIds: string[] = Object.keys(purposes);

        const purposeOptions: PurposeOption[] = [];

        purposesIds.forEach((purposeId) => {

            const purpose: Purpose = purposes[purposeId];
            purposeOptions.push({
                state: tcModel.purposeConsents.has(purpose.id),
                id: Number(purpose.id),
                title: purpose.name,
                description: purpose.description,
                legalDescription: purpose.descriptionLegal,
                vendors: tcModel.gvl.getVendorsWithConsentPurpose(purpose.id),
            });

        });

        this._UIPurposeChoices = purposeOptions;

    }

    /**
     * Build the UISpecialFeatureOptInsChoices with the provided TCModel and set
     * status in base of the consent enabled in it.
     *
     * @param {TCModel} tcModel
     * @private
     */
    private buildUISpecialFeatureOptInsChoices(tcModel: TCModel): void {

        const specialFeatures = tcModel.gvl.specialFeatures;

        const specialFeaturesIds: string[] = Object.keys(specialFeatures);

        const specialFeaturesOptions: SpecialFeatureOption[] = [];

        specialFeaturesIds.forEach((specialFeaturesId) => {

            const specialFeature: Feature = specialFeatures[specialFeaturesId];
            specialFeaturesOptions.push({
                state: tcModel.specialFeatureOptins.has(specialFeature.id),
                id: Number(specialFeature.id),
                title: specialFeature.name,
                description: specialFeature.description,
                legalDescription: specialFeature.descriptionLegal,
                vendors: tcModel.gvl.getVendorsWithSpecialFeature(specialFeature.id),
            });

        });

        this._UISpecialFeatureOptInsChoices = specialFeaturesOptions;

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

        const vendorOption: VendorOption[] = [];

        vendorIds.forEach((vendorId) => {

            const vendor: Vendor = vendors[vendorId];

            // IAB use null instead of NaN, it's a bad design, so we fix it!
            let cookieMaxAgeSeconds = NaN;

            if (typeof vendor.cookieMaxAgeSeconds === 'number' && !isNaN(vendor.cookieMaxAgeSeconds)) {

                cookieMaxAgeSeconds = Number(vendor.cookieMaxAgeSeconds);

            }

            vendorOption.push({
                state: tcModel.vendorConsents.has(vendor.id),
                features: UIChoicesBridgeDtoBuilder.buildVendorFeatures(vendor.features, tcModel.gvl.features),
                flexiblePurposes: vendor.flexiblePurposes,
                id: Number(vendor.id),
                legIntPurposes: vendor.legIntPurposes,
                name: vendor.name,
                policyUrl: vendor.policyUrl,
                cookieMaxAgeSeconds: cookieMaxAgeSeconds,
                purposes: UIChoicesBridgeDtoBuilder.buildVendorPurposes(vendor.purposes, tcModel.gvl.purposes),
                specialFeatures: UIChoicesBridgeDtoBuilder.buildVendorFeatures(
                    vendor.specialFeatures,
                    tcModel.gvl.specialFeatures,
                ),
                specialPurposes: UIChoicesBridgeDtoBuilder.buildVendorPurposes(
                    vendor.specialPurposes,
                    tcModel.gvl.specialPurposes,
                ),
            });

        });

        this._UIVendorChoices = vendorOption;

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

        const legitimateInterestsVendorOption: VendorOption[] = [];

        const vendorIds = Object.keys(allVendorsWithLegitimateInterests);

        vendorIds.forEach((vendorId) => {

            const vendor: Vendor = allVendorsWithLegitimateInterests[vendorId];

            // IAB use null instead of NaN, it's a bad design, so we fix it!
            let cookieMaxAgeSeconds = NaN;

            if (typeof vendor.cookieMaxAgeSeconds === 'number' && !isNaN(vendor.cookieMaxAgeSeconds)) {

                cookieMaxAgeSeconds = Number(vendor.cookieMaxAgeSeconds);

            }

            // Legitimate interest choices are opt-out, so the default is true
            const state = this.firstTimeConsentRequest ? true : tcModel.vendorLegitimateInterests.has(vendor.id);

            legitimateInterestsVendorOption.push({
                state: state,
                features: UIChoicesBridgeDtoBuilder.buildVendorFeatures(vendor.features, tcModel.gvl.features),
                flexiblePurposes: vendor.flexiblePurposes,
                id: Number(vendor.id),
                legIntPurposes: vendor.legIntPurposes,
                name: vendor.name,
                policyUrl: vendor.policyUrl,
                cookieMaxAgeSeconds: cookieMaxAgeSeconds,
                purposes: UIChoicesBridgeDtoBuilder.buildVendorPurposes(vendor.purposes, tcModel.gvl.purposes),
                specialFeatures: UIChoicesBridgeDtoBuilder.buildVendorFeatures(
                    vendor.specialFeatures,
                    tcModel.gvl.specialFeatures,
                ),
                specialPurposes: UIChoicesBridgeDtoBuilder.buildVendorPurposes(
                    vendor.specialPurposes,
                    tcModel.gvl.specialPurposes,
                ),
            });

        });

        this._UILegitimateInterestsVendorChoices = legitimateInterestsVendorOption;

    }

    /**
     * Build the vendor purpose entity for every purposes provided.
     *
     * @param {number[]} purposeIds
     * @param {IntMap<Purpose>} purposesBases
     * @private
     *
     * @return {VendorPurpose[]}
     */
    private static buildVendorPurposes(purposeIds: number[], purposesBases: IntMap<Purpose>): VendorPurpose[] {

        const result: VendorPurpose[] = [];

        purposeIds.forEach((purposeId) => {

            const purpose = purposesBases[purposeId];
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
     * Build the vendor feature entity for every feature provided.
     *
     * @param {number[]} featureIds
     * @param {IntMap<Feature>} featuresBases
     * @private
     *
     * @return {VendorPurpose[]}
     */
    private static buildVendorFeatures(featureIds: number[], featuresBases: IntMap<Feature>): VendorFeature[] {

        const result: VendorFeature[] = [];

        featureIds.forEach((featureId) => {

            const feature = featuresBases[featureId];
            result.push({
                id: Number(feature.id),
                name: feature.name,
                description: feature.description,
                descriptionLegal: feature.descriptionLegal,
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

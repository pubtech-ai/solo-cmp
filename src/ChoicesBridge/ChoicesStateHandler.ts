import {Feature, Purpose, TCModel, Vendor} from '@iabtcf/core';
import {IntMap} from '@iabtcf/core/lib/model';
import ACModel from '../Entity/ACModel';
import PurposeOption from '../Entity/PurposeOption';
import VendorFeature from '../Entity/VendorFeature';
import VendorPurpose from '../Entity/VendorPurpose';
import VendorOption from '../Entity/VendorOption';
import GoogleVendorOption from '../Entity/GoogleVendorOption';

/**
 * ChoicesStateHandler.
 */
class ChoicesStateHandler {

    private static instance: ChoicesStateHandler;

    private _UIPurposeChoices: PurposeOption[] = [];
    private _UIVendorChoices: VendorOption[] = [];
    private _UILegitimateInterestsPurposeChoices: PurposeOption[] = [];
    private _UILegitimateInterestsVendorChoices: VendorOption[] = [];
    private _UIGoogleVendorOptions: GoogleVendorOption[] = [];

    /**
     * Constructor.
     *
     * @param {TCModel} tcModel
     * @param {ACModel} acModel
     * @private
     */
    private constructor(tcModel: TCModel, acModel: ACModel) {

        this.buildUIPurposeChoices(tcModel);
        this.buildUIVendorChoices(tcModel);
        this.buildLegitimateInterestsChoices(tcModel);
        this.buildUIGoogleVendorOptions(acModel);

    }

    /**
     * Retrieve the instance or build it if is not instantiated.
     *
     * @param {TCModel|null} tcModel
     * @param {ACModel|null} acModel
     *
     * @return {ChoicesStateHandler}
     */
    public static getInstance(tcModel: TCModel | null = null, acModel: ACModel | null = null): ChoicesStateHandler {

        if (!ChoicesStateHandler.instance && tcModel === null) {

            throw new Error('ChoicesStateHandler, you must provide the TCModel.');

        }

        if (!ChoicesStateHandler.instance && acModel === null) {

            throw new Error('ChoicesStateHandler, you must provide the ACModel.');

        }

        if (!ChoicesStateHandler.instance) {

            if (tcModel && acModel) {

                ChoicesStateHandler.instance = new ChoicesStateHandler(tcModel, acModel);

            }

        }

        return ChoicesStateHandler.instance;

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
                expanded: false,
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
                expanded: false,
                features: ChoicesStateHandler.buildVendorFeatures(vendor.features, tcModel.gvl.features),
                flexiblePurposes: vendor.flexiblePurposes,
                id: vendor.id,
                legIntPurposes: vendor.legIntPurposes,
                name: vendor.name,
                policyUrl: vendor.policyUrl,
                cookieMaxAgeSeconds: cookieMaxAgeSeconds,
                purposes: ChoicesStateHandler.buildVendorPurposes(vendor.purposes, tcModel.gvl.purposes),
                specialFeatures: ChoicesStateHandler.buildVendorFeatures(
                    vendor.specialFeatures,
                    tcModel.gvl.specialFeatures,
                ),
                specialPurposes: ChoicesStateHandler.buildVendorPurposes(
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
    private buildLegitimateInterestsChoices(tcModel: TCModel): void {

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

                legitimateInterestsPurposesOptions.push({
                    state: tcModel.purposeLegitimateInterests.has(purpose.id),
                    expanded: false,
                    id: purpose.id,
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

            legitimateInterestsVendorOption.push({
                state: tcModel.vendorLegitimateInterests.has(vendor.id),
                expanded: false,
                features: ChoicesStateHandler.buildVendorFeatures(vendor.features, tcModel.gvl.features),
                flexiblePurposes: vendor.flexiblePurposes,
                id: Number(vendor.id),
                legIntPurposes: vendor.legIntPurposes,
                name: vendor.name,
                policyUrl: vendor.policyUrl,
                cookieMaxAgeSeconds: cookieMaxAgeSeconds,
                purposes: ChoicesStateHandler.buildVendorPurposes(vendor.purposes, tcModel.gvl.purposes),
                specialFeatures: ChoicesStateHandler.buildVendorFeatures(
                    vendor.specialFeatures,
                    tcModel.gvl.specialFeatures,
                ),
                specialPurposes: ChoicesStateHandler.buildVendorPurposes(
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
                id: purpose.id,
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
                id: feature.id,
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

        // Clone the array
        this._UIGoogleVendorOptions = Array.from(acModel.googleVendorOptions);

    }

    get UIPurposeChoices(): PurposeOption[] {
        return this._UIPurposeChoices;
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

export default ChoicesStateHandler;

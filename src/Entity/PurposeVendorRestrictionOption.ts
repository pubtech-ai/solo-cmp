import {VendorFeature} from './VendorFeature';
import {VendorPurpose} from './VendorPurpose';
import {UIChoice} from './UIChoice';

/**
 * PurposeVendorRestrictionOption.
 */
export interface PurposeVendorRestrictionOption extends UIChoice {
    features: VendorFeature[];
    flexiblePurposes: number[];
    id: number;
    legIntPurposes: number[];
    name: string;
    cookieMaxAgeSeconds: number;
    policyUrl: string;
    purposes: VendorPurpose[];
    specialFeatures: VendorFeature[];
    specialPurposes: VendorPurpose[];
}

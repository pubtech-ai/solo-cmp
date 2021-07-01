import VendorFeature from './VendorFeature';
import VendorPurpose from './VendorPurpose';
import UIChoice from './UIChoice';

/**
 * VendorOption.
 */
interface VendorOption extends UIChoice {
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

export default VendorOption;

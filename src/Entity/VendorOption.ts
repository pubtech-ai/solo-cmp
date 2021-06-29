import VendorFeature from './VendorFeature';
import VendorPurpose from './VendorPurpose';

/**
 * VendorOption.
 */
interface VendorOption {
    state: boolean;
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
    expanded: boolean;
}

export default VendorOption;

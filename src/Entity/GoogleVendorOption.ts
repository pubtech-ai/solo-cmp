import UIChoice from './UIChoice';

/**
 * GoogleVendorOption.
 */
interface GoogleVendorOption extends UIChoice {
    id: number;
    name: string;
    policyUrl: string;
    domains: string;
}

export default GoogleVendorOption;

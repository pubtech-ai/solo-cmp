/**
 * GoogleVendorOption.
 */
interface GoogleVendorOption {
    state: boolean;
    id: number;
    name: string;
    policyUrl: string;
    domains: string;
    expanded: boolean;
}

export default GoogleVendorOption;

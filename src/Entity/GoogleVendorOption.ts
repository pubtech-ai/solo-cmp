import UIChoices from "./UIChoices";

/**
 * GoogleVendorOption.
 */
interface GoogleVendorOption extends UIChoices {
    id: number;
    name: string;
    policyUrl: string;
    domains: string;
}

export default GoogleVendorOption;

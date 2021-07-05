import {UIChoice} from './UIChoice';

/**
 * GoogleVendorOption.
 */
export interface GoogleVendorOption extends UIChoice {
    id: number;
    name: string;
    policyUrl: string;
    domains: string;
}

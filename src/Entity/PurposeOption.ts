import {UIChoice} from './UIChoice';
import {PurposeVendorRestrictionOption} from './PurposeVendorRestrictionOption';

/**
 * PurposeOption.
 */
export interface PurposeOption extends UIChoice {
    id: number;
    title: string;
    description: string;
    legalDescription: string;
    vendorsRestriction: PurposeVendorRestrictionOption[];
}

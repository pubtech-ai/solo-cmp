import {UIChoice} from './UIChoice';
import {IntMap, Vendor} from '@iabtcf/core';

/**
 * PurposeLegitimateInterestOption.
 */
export interface PurposeLegitimateInterestOption extends UIChoice {
    id: number;
    title: string;
    description: string;
    legalDescription: string;
    vendors: IntMap<Vendor>;
}

import {IntMap, Vendor} from '@iabtcf/core';
import {UIChoice} from './UIChoice';

/**
 * SpecialFeatureOption.
 */
export interface SpecialFeatureOption extends UIChoice {
    id: number;
    title: string;
    description: string;
    legalDescription: string;
    vendors: IntMap<Vendor>;
}

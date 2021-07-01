import {IntMap, Vendor} from '@iabtcf/core';
import UIChoice from './UIChoice';

/**
 * PurposeOption.
 */
interface PurposeOption extends UIChoice {
    id: number;
    title: string;
    description: string;
    legalDescription: string;
    vendors: IntMap<Vendor>;
}

export default PurposeOption;

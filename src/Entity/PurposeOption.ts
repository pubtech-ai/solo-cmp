import {IntMap, Vendor} from '@iabtcf/core';

/**
 * PurposeOption.
 */
interface PurposeOption {
    state: boolean;
    id: number;
    title: string;
    description: string;
    legalDescription: string;
    vendors: IntMap<Vendor>;
    expanded: boolean;
}

export default PurposeOption;

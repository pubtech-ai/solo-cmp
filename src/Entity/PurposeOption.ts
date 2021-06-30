import {IntMap, Vendor} from '@iabtcf/core';

/**
 * PurposeOption.
 */
interface PurposeOption {
    expanded: boolean;
    state: boolean;
    id: number;
    title: string;
    description: string;
    legalDescription: string;
    vendors: IntMap<Vendor>;
}

export default PurposeOption;

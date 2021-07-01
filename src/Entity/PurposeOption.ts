import {IntMap, Vendor} from '@iabtcf/core';
import UIChoices from "./UIChoices";

/**
 * PurposeOption.
 */
interface PurposeOption extends UIChoices {
    id: number;
    title: string;
    description: string;
    legalDescription: string;
    vendors: IntMap<Vendor>;
}

export default PurposeOption;

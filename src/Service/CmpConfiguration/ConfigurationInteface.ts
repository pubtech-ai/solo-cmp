import {ConsentReadyEvent} from '../../Event';
import {TCModel} from '@iabtcf/core';

/**
 * ConfigurationInterface.
 */
export interface ConfigurationInterface {
    isAmp: boolean;
    onConsentAds: (event: ConsentReadyEvent, tcModel: TCModel) => void;
}

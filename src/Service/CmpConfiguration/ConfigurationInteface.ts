import {ConsentReadyEvent} from '../../Event';

/**
 * ConfigurationInterface.
 */
export interface ConfigurationInterface {
    isAmp: boolean;
    onConsentAds: (event: ConsentReadyEvent) => void;
    debug: boolean;
}

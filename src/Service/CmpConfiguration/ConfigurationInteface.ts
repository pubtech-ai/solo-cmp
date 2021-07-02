import ConsentReadyEvent from '../../Event/ConsentReadyEvent';

/**
 * ConfigurationInterface.
 */
interface ConfigurationInterface {
    isAmp: boolean;
    onConsentAds: (event: ConsentReadyEvent) => void;
    debug: boolean;
}

export default ConfigurationInterface;

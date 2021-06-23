/**
 * ConfigurationInterface.
 */
interface ConfigurationInterface {
    isAmp: boolean;
    onConsentAds: (consents: number[]) => void;
    debug: boolean;
}

export default ConfigurationInterface;

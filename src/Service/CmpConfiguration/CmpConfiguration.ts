import ConfigurationInterface from './ConfigurationInteface';

/**
 * CmpConfiguration.
 */
class CmpConfiguration {

    private _isAmp: boolean;
    private _onConsentAdsCallBack: (consents: number[]) => void;
    private _debug: boolean;

    /**
     * Constructor.
     *
     * @param {ConfigurationInterface} configuration
     */
    constructor(configuration: ConfigurationInterface) {

        this._onConsentAdsCallBack = configuration.onConsentAds;
        this._isAmp = configuration.isAmp;
        this._debug = configuration.debug;

    }

    get isAmp(): boolean {

        return this._isAmp;

    }

    get onConsentAdsCallBack(): any {

        return this._onConsentAdsCallBack;

    }

    get debug(): boolean {

        return this._debug;

    }

}

export default CmpConfiguration;

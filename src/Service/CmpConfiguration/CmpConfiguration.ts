import ConfigurationInterface from './ConfigurationInteface';
import ConsentReadyEvent from '../../Event/ConsentReadyEvent';

/**
 * CmpConfiguration.
 */
class CmpConfiguration {

    private readonly _isAmp: boolean;
    private readonly _onConsentAdsCallBack: (event: ConsentReadyEvent) => void;
    private readonly _debug: boolean;

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

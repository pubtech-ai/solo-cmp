import {ConfigurationInterface} from './ConfigurationInteface';
import {ConsentReadyEvent} from '../../Event';
import {TCModel} from '@iabtcf/core';

/**
 * CmpConfiguration.
 */
export class CmpConfiguration {

    private readonly _isAmp: boolean;
    private readonly _onConsentAdsCallBack: (event: ConsentReadyEvent, tcModel: TCModel) => void;

    /**
     * Constructor.
     *
     * @param {ConfigurationInterface} configuration
     */
    constructor(configuration: ConfigurationInterface) {

        this._onConsentAdsCallBack = configuration.onConsentAds;
        this._isAmp = configuration.isAmp;

    }

    get isAmp(): boolean {

        return this._isAmp;

    }

    get onConsentAdsCallBack(): any {

        return this._onConsentAdsCallBack;

    }

    static getClassName(): string {

        return 'CmpConfiguration';

    }

}

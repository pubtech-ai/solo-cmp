import {CmpConfiguration} from './CmpConfiguration/';
import {ConfigurationInterface} from './CmpConfiguration/';

/**
 * CmpConfigurationProvider.
 */
export class CmpConfigurationProvider {

    private readonly _cmpConfiguration: CmpConfiguration;

    /**
     * Constructor.
     *
     * @param {object} configurationObject
     */
    constructor(configurationObject: any) {

        const cmpConfig = configurationObject;

        if (typeof cmpConfig !== 'object' || cmpConfig === null) {

            throw new Error('CmpConfig parameter must be provided, see docs!');

        }

        if (typeof cmpConfig.isAmp !== 'boolean') {

            throw new Error('CmpConfig, isAmp parameter must be a boolean.');

        }

        if (typeof cmpConfig.onConsentAds !== 'function') {

            throw new Error('CmpConfig, onConsentAds parameter must be a function.');

        }

        const configuration: ConfigurationInterface = {
            isAmp: cmpConfig.isAmp,
            onConsentAds: cmpConfig.onConsentAds,
        };

        this._cmpConfiguration = new CmpConfiguration(configuration);

    }

    /**
     * Retrieve the CmpConfiguration instance.
     *
     * @return {CmpConfiguration}
     */
    get cmpConfiguration(): CmpConfiguration {

        return this._cmpConfiguration;

    }

    static getClassName(): string {

        return 'CmpConfigurationProvider';

    }

}

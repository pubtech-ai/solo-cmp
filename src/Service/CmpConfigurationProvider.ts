import CmpConfiguration from './CmpConfiguration/CmpConfiguration';
import ConfigurationInterface from './CmpConfiguration/ConfigurationInteface';

/**
 * CmpConfigurationProvider.
 */
class CmpConfigurationProvider {

    private cmpConfiguration: CmpConfiguration;

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

        if (typeof cmpConfig.debug !== 'boolean') {

            throw new Error('CmpConfig, debug parameter must be a boolean.');

        }

        const configuration: ConfigurationInterface = {
            isAmp: cmpConfig.isAmp,
            onConsentAds: cmpConfig.onConsentAds,
            debug: cmpConfig.debug,
        };

        this.cmpConfiguration = new CmpConfiguration(configuration);

    }

    /**
     * Retrieve the CmpConfiguration instance.
     *
     * @return {CmpConfiguration}
     */
    getCmpConfiguration(): CmpConfiguration {

        return this.cmpConfiguration;

    }

}

export default CmpConfigurationProvider;

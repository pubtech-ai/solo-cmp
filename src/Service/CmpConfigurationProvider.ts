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

            throw new Error('CmpConfig object must be provided, see docs!');

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

import { expect } from 'chai';
import CmpConfigurationProvider from '../../src/Service/CmpConfigurationProvider';
import CmpConfiguration from '../../src/Service/CmpConfiguration/CmpConfiguration';

describe('CmpConfigurationProvider suit test', () => {
    it('CmpConfigurationProvider construction test', () => {
        const cmpConfig = {
            isAmp: false,
            onConsentAds: (purposesAccepted) => {
                purposesAccepted.includes(1);
            },
            debug: true,
        };

        const cmpConfigurationProvider: CmpConfigurationProvider = new CmpConfigurationProvider(cmpConfig);

        const cmpConfiguration: CmpConfiguration = cmpConfigurationProvider.cmpConfiguration;

        expect(cmpConfiguration.debug).to.be.true;
        expect(cmpConfiguration.isAmp).to.be.false;
        expect(cmpConfiguration.onConsentAdsCallBack).to.deep.equal(cmpConfig.onConsentAds);
    });

    it('CmpConfigurationProvider construction thrown if wrong config parameter is null test', () => {
        const construction = function () {
            new CmpConfigurationProvider(null);
        };

        expect(construction).to.throw('CmpConfig parameter must be provided, see docs!');
    });

    it('CmpConfigurationProvider construction thrown if wrong isAmp parameter is provided test', () => {
        const cmpConfig = {
            isAmp: 'false',
            onConsentAds: () => {},
            debug: true,
        };

        const construction = function () {
            new CmpConfigurationProvider(cmpConfig);
        };

        expect(construction).to.throw('CmpConfig, isAmp parameter must be a boolean.');
    });

    it('CmpConfigurationProvider construction thrown if wrong onConsentAds parameter is provided test', () => {
        const cmpConfig = {
            isAmp: false,
            onConsentAds: false,
            debug: true,
        };

        const construction = function () {
            new CmpConfigurationProvider(cmpConfig);
        };

        expect(construction).to.throw('CmpConfig, onConsentAds parameter must be a function.');
    });

    it('CmpConfigurationProvider construction thrown if wrong debug parameter is provided test', () => {
        const cmpConfig = {
            isAmp: false,
            onConsentAds: () => {},
            debug: 'true',
        };

        const construction = function () {
            new CmpConfigurationProvider(cmpConfig);
        };

        expect(construction).to.throw('CmpConfig, debug parameter must be a boolean.');
    });
});

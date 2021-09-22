import {expect} from 'chai';
const sinon = require('sinon');
import {LoggerService, ACStringService, ACModelService, HttpRequestService} from '../../src/Service';

describe('ACModelService suit test', () => {

    const loggerService: LoggerService = new LoggerService(false);

    const localStorage: Storage = {
        length: 0,
        setItem(key, value): string {

            return value;

        },
        clear() {},
        key(index: number): string | null {

            return null;

        },
        removeItem(key: string): void {},
        getItem(key: string): string | null {

            return null;

        },
    };

    const mockLocalStorage = sinon.mock(localStorage);

    it('ACModelService construction fail test', () => {

        const acStringService = new ACStringService(1, 'solo-cmp-ac-string', loggerService, mockLocalStorage, false);

        const construction = function() {

            new ACModelService('', acStringService, new HttpRequestService(), loggerService);

        };

        expect(construction).to.throw(
            'ACModelService, baseUrlVendorList must be a string with a length greater than zero.',
        );

    });

    it('ACModelService construction test', async () => {

        const acStringService = new ACStringService(1, 'solo-cmp-ac-string', loggerService, mockLocalStorage, false);

        const httpRequestService = new HttpRequestService();

        const jsonContent = [
            {
                provider_id: 39,
                provider_name: 'Digilant',
                policy_url: 'https://www.digilant.com/privacy-policy/',
                domains: 'wtp101.com',
            },
            {
                provider_id: 43,
                provider_name: 'AdPredictive',
                policy_url: 'http://adpredictive.com/optout/',
                domains: 'adpredictive.com platform.adpredictive.io',
            },
        ];

        sinon
            .stub(httpRequestService, 'makeRequest')
            .withArgs('GET', 'https://pubtech-ai-solo-cmp.com/google-vendor-list.json')
            .callsFake(function fakeMakeRequest() {

                return new Promise((resolve, reject) => {

                    const response = {
                        responseText: JSON.stringify(jsonContent),
                    };

                    resolve(response);

                });

            });

        const acModelService = new ACModelService(
            'https://pubtech-ai-solo-cmp.com',
            acStringService,
            httpRequestService,
            loggerService,
        );

        const acModel = await acModelService.fetchDataAndBuildACModel('1~39');

        expect(acModel.googleVendorOptions[0].id).to.equal(jsonContent[0].provider_id);
        expect(acModel.googleVendorOptions[0].name).to.equal(jsonContent[0].provider_name);
        expect(acModel.googleVendorOptions[0].policyUrl).to.equal(jsonContent[0].policy_url);
        expect(acModel.googleVendorOptions[0].domains).to.equal(jsonContent[0].domains);
        expect(acModel.googleVendorOptions[0].state).to.be.true;

        expect(acModel.googleVendorOptions[1].id).to.equal(jsonContent[1].provider_id);
        expect(acModel.googleVendorOptions[1].name).to.equal(jsonContent[1].provider_name);
        expect(acModel.googleVendorOptions[1].policyUrl).to.equal(jsonContent[1].policy_url);
        expect(acModel.googleVendorOptions[1].domains).to.equal(jsonContent[1].domains);
        expect(acModel.googleVendorOptions[1].state).to.be.false;

    });

    it('ACModelService construction request fail test', async () => {

        const acStringService = new ACStringService(1, 'solo-cmp-ac-string', loggerService, mockLocalStorage, false);

        const httpRequestService = new HttpRequestService();

        sinon
            .stub(httpRequestService, 'makeRequest')
            .withArgs('GET', 'https://pubtech-ai-solo-cmp.com/google-vendor-list.json')
            .callsFake(function fakeMakeRequest() {

                return new Promise((resolve, reject) => {

                    reject('Can\'t retrieve json');

                });

            });

        const acModelService = new ACModelService(
            'https://pubtech-ai-solo-cmp.com',
            acStringService,
            httpRequestService,
            loggerService,
        );

        const acModel = await acModelService.fetchDataAndBuildACModel('');

        expect(acModel.googleVendorOptions.length).to.equal(0);

    });

    it('ACModelService ACModel build fail without provider_id test', async () => {

        const acStringService = new ACStringService(1, 'solo-cmp-ac-string', loggerService, mockLocalStorage, false);

        const httpRequestService = new HttpRequestService();

        const jsonContent = [
            {
                provider_name: 'Digilant',
                policy_url: 'https://www.digilant.com/privacy-policy/',
                domains: 'wtp101.com',
            },
            {
                provider_name: 'AdPredictive',
                policy_url: 'http://adpredictive.com/optout/',
                domains: 'adpredictive.com platform.adpredictive.io',
            },
        ];

        sinon
            .stub(httpRequestService, 'makeRequest')
            .withArgs('GET', 'https://pubtech-ai-solo-cmp.com/google-vendor-list.json')
            .callsFake(function fakeMakeRequest() {

                return new Promise((resolve, reject) => {

                    const response = {
                        responseText: JSON.stringify(jsonContent),
                    };

                    resolve(response);

                });

            });

        const acModelService = new ACModelService(
            'https://pubtech-ai-solo-cmp.com',
            acStringService,
            httpRequestService,
            loggerService,
        );

        const acModel = await acModelService.fetchDataAndBuildACModel('');

        expect(acModel.googleVendorOptions.length).to.equal(0);

    });

    it('ACModelService ACModel build fail without policy_url test', async () => {

        const acStringService = new ACStringService(1, 'solo-cmp-ac-string', loggerService, mockLocalStorage, false);

        const httpRequestService = new HttpRequestService();

        const jsonContent = [
            {
                provider_id: 34,
                provider_name: 'Digilant',
                domains: 'wtp101.com',
            },
            {
                provider_id: 35,
                provider_name: 'AdPredictive',
                domains: 'adpredictive.com platform.adpredictive.io',
            },
        ];

        sinon
            .stub(httpRequestService, 'makeRequest')
            .withArgs('GET', 'https://pubtech-ai-solo-cmp.com/google-vendor-list.json')
            .callsFake(function fakeMakeRequest() {

                return new Promise((resolve, reject) => {

                    const response = {
                        responseText: JSON.stringify(jsonContent),
                    };

                    resolve(response);

                });

            });

        const acModelService = new ACModelService(
            'https://pubtech-ai-solo-cmp.com',
            acStringService,
            httpRequestService,
            loggerService,
        );

        const acModel = await acModelService.fetchDataAndBuildACModel('');

        expect(acModel.googleVendorOptions.length).to.equal(0);

    });

});

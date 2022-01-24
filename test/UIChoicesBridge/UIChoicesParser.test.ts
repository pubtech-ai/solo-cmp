import {expect} from 'chai';
// @ts-ignore
import {getACModelByFixture, getTCModelByFixture} from './UIChoicesBridgeDtoBuilder.test';
import {TCModel} from '@iabtcf/core';
import {ACModel} from '../../src/Entity';
import {UIChoicesBridgeDtoBuilder, UIChoicesParser} from '../../src/UIChoicesBridge';

describe('UIChoicesParser suit test', () => {

    /**
     * Test the condition for the expiration days for partial consent.
     */
    const testFixtureForParsingLogic = [
        {
            title: 'UIChoicesParser parsing logic with leg int disabled validation test',
            isLegitimateInterestDisabled: true,
            legitimateMirror: false,
            firstTimeConsentRequest: true,
            expectations: {
                purposeConsents: 0,
                googleVendorOptions: 2,
                enabled: {
                    publisherConsents: 10,
                    publisherLegitimateInterests: 0,
                    purposeConsents: 10,
                    vendorConsents: 736,
                    purposeLegitimateInterests: 0,
                    vendorLegitimateInterests: 0,
                    specialFeatureOptins: 1,
                    googleVendorOptions: 1,
                    allSpecialFeatureOptins: 2,
                },
            },
        },
        {
            title: 'UIChoicesParser parsing logic with leg int disabled and mirror enabled validation test',
            isLegitimateInterestDisabled: true,
            legitimateMirror: true,
            firstTimeConsentRequest: true,
            expectations: {
                purposeConsents: 0,
                googleVendorOptions: 2,
                enabled: {
                    publisherConsents: 10,
                    publisherLegitimateInterests: 9,
                    purposeConsents: 10,
                    vendorConsents: 736,
                    purposeLegitimateInterests: 9,
                    vendorLegitimateInterests: 736,
                    specialFeatureOptins: 1,
                    googleVendorOptions: 1,
                    allSpecialFeatureOptins: 2,
                },
            },
        },
        {
            title: 'UIChoicesParser parsing logic with leg int enabled and mirror disabled validation test',
            isLegitimateInterestDisabled: false,
            legitimateMirror: false,
            firstTimeConsentRequest: true,
            expectations: {
                purposeConsents: 0,
                googleVendorOptions: 2,
                enabled: {
                    publisherConsents: 10,
                    publisherLegitimateInterests: 9,
                    purposeConsents: 10,
                    vendorConsents: 736,
                    purposeLegitimateInterests: 9,
                    vendorLegitimateInterests: 290,
                    specialFeatureOptins: 1,
                    googleVendorOptions: 1,
                    allSpecialFeatureOptins: 2,
                },
            },
        },
        {
            title: 'UIChoicesParser parsing logic with leg int enabled and mirror enabled validation test',
            isLegitimateInterestDisabled: false,
            legitimateMirror: true,
            firstTimeConsentRequest: true,
            expectations: {
                purposeConsents: 0,
                googleVendorOptions: 2,
                enabled: {
                    publisherConsents: 10,
                    publisherLegitimateInterests: 9,
                    purposeConsents: 10,
                    vendorConsents: 736,
                    purposeLegitimateInterests: 9,
                    vendorLegitimateInterests: 736,
                    specialFeatureOptins: 1,
                    googleVendorOptions: 1,
                    allSpecialFeatureOptins: 2,
                },
            },
        },
        {
            title: 'UIChoicesParser parsing logic with leg int enabled and mirror enabled validation test',
            isLegitimateInterestDisabled: false,
            legitimateMirror: true,
            firstTimeConsentRequest: false,
            expectations: {
                purposeConsents: 0,
                googleVendorOptions: 2,
                enabled: {
                    publisherConsents: 10,
                    publisherLegitimateInterests: 9,
                    purposeConsents: 10,
                    vendorConsents: 2,
                    purposeLegitimateInterests: 9,
                    vendorLegitimateInterests: 2,
                    specialFeatureOptins: 1,
                    googleVendorOptions: 1,
                    allSpecialFeatureOptins: 2,
                },
            },
        },
        {
            title: 'UIChoicesParser parsing logic with leg int enabled and mirror disabled validation not first time consent test',
            isLegitimateInterestDisabled: true,
            legitimateMirror: false,
            firstTimeConsentRequest: false,
            expectations: {
                purposeConsents: 0,
                googleVendorOptions: 2,
                enabled: {
                    publisherConsents: 10,
                    publisherLegitimateInterests: 0,
                    purposeConsents: 10,
                    vendorConsents: 2,
                    purposeLegitimateInterests: 0,
                    vendorLegitimateInterests: 0,
                    specialFeatureOptins: 1,
                    googleVendorOptions: 1,
                    allSpecialFeatureOptins: 2,
                },
            },
        },
    ];

    testFixtureForParsingLogic.forEach((testData) => {

        it(testData.title, () => {

            const tcModelInit: TCModel = getTCModelByFixture();
            const acModelInit: ACModel = getACModelByFixture();

            const uiChoicesParser = new UIChoicesParser(
                tcModelInit,
                acModelInit,
                testData.isLegitimateInterestDisabled,
                testData.legitimateMirror,
            );

            const choicesStateHandler = new UIChoicesBridgeDtoBuilder(
                tcModelInit,
                acModelInit,
                testData.firstTimeConsentRequest,
                testData.isLegitimateInterestDisabled,
            ).createUIChoicesBridgeDto();

            // Simulate User choices changes
            choicesStateHandler.UIPurposeChoices.forEach((purposeChoice) => (purposeChoice.state = true));
            choicesStateHandler.UISpecialFeatureChoices[0].state = true;

            expect(
                [...uiChoicesParser.tcModel.purposeConsents.values()].length,
                '[...uiChoicesParser.tcModel.purposeConsents.values()].length',
            ).to.equal(testData.expectations.purposeConsents);
            expect(
                uiChoicesParser.acModel.googleVendorOptions.length,
                'uiChoicesParser.acModel.googleVendorOptions.length',
            ).to.equal(testData.expectations.googleVendorOptions);

            let tcModel = uiChoicesParser.parseTCModel(choicesStateHandler);

            expect(
                [...tcModel.publisherConsents.values()].length,
                '[...tcModel.publisherConsents.values()].length',
            ).to.equal(testData.expectations.enabled.publisherConsents);

            expect(
                [...tcModel.publisherLegitimateInterests.values()].length,
                '[...tcModel.publisherLegitimateInterests.values()].length',
            ).to.equal(testData.expectations.enabled.publisherLegitimateInterests);

            expect([...tcModel.purposeConsents.values()].length, '[...tcModel.purposeConsents.values()].length').to.equal(
                testData.expectations.enabled.purposeConsents,
            );
            expect([...tcModel.vendorConsents.values()].length, '[...tcModel.vendorConsents.values()].length').to.equal(
                testData.expectations.enabled.vendorConsents,
            );
            expect([...tcModel.purposeLegitimateInterests.values()].length, '[...tcModel.purposeLegitimateInterests.values()].length').to.equal(
                testData.expectations.enabled.purposeLegitimateInterests,
            );
            expect(
                [...tcModel.vendorLegitimateInterests.values()].length,
                '[...tcModel.vendorLegitimateInterests.values()].length',
            ).to.equal(testData.expectations.enabled.vendorLegitimateInterests);

            let acModel = uiChoicesParser.parseACModel(choicesStateHandler);

            expect(
                [...acModel.googleVendorOptions.filter((option) => option.state)].length,
                '[...acModel.googleVendorOptions.filter(option => option.state)].length',
            ).to.equal(testData.expectations.enabled.googleVendorOptions);

            acModel = uiChoicesParser.buildACModelAllEnabled();

            expect(
                [...acModel.googleVendorOptions.filter((option) => option.state)].length,
                'enabled all [...acModel.googleVendorOptions.filter(option => option.state)].length',
            ).to.equal(acModel.googleVendorOptions.length);

            expect(
                [...tcModel.specialFeatureOptins.values()].length,
                '[...tcModel.specialFeatureOptins.values()].length',
            ).to.equal(testData.expectations.enabled.specialFeatureOptins);

            tcModel = uiChoicesParser.buildTCModelAllEnabled();

            expect(
                [...tcModel.specialFeatureOptins.values()].length,
                '[...tcModel.specialFeatureOptins.values()].length',
            ).to.equal(testData.expectations.enabled.allSpecialFeatureOptins);

        });

    });

});

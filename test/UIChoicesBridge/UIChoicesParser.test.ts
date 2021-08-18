import { expect } from 'chai';
//@ts-ignore
import { getACModelByFixture, getTCModelByFixture } from './UIChoicesBridgeDtoBuilder.test';
import { TCModel } from '@iabtcf/core';
import { ACModel } from '../../src/Entity';
import { UIChoicesBridgeDtoBuilder, UIChoicesParser } from '../../src/UIChoicesBridge';

describe('UIChoicesParser suit test', () => {
    it('UIChoicesParser parsing logic validation test', () => {
        const tcModelInit: TCModel = getTCModelByFixture();
        const acModelInit: ACModel = getACModelByFixture();

        const uiChoicesParser = new UIChoicesParser(tcModelInit, acModelInit);

        const choicesStateHandler = new UIChoicesBridgeDtoBuilder(
            tcModelInit,
            acModelInit,
            true,
        ).createUIChoicesBridgeDto();

        // Simulate User choices changes
        choicesStateHandler.UIPurposeChoices.forEach((purposeChoice) => (purposeChoice.state = true));
        choicesStateHandler.UILegitimateInterestsPurposeChoices[0].state = true;
        choicesStateHandler.UISpecialFeatureChoices[0].state = true;

        expect(
            [...uiChoicesParser.tcModel.purposeConsents.values()].length,
            '[...uiChoicesParser.tcModel.purposeConsents.values()].length',
        ).to.equal(0);
        expect(
            uiChoicesParser.acModel.googleVendorOptions.length,
            'uiChoicesParser.acModel.googleVendorOptions.length',
        ).to.equal(2);

        const tcModel = uiChoicesParser.parseTCModel(choicesStateHandler);

        expect(
            [...tcModel.publisherConsents.values()].length,
            '[...tcModel.publisherConsents.values()].length',
        ).to.equal(10);

        expect(
            [...tcModel.publisherLegitimateInterests.values()].length,
            '[...tcModel.publisherLegitimateInterests.values()].length',
        ).to.equal(9);

        expect([...tcModel.purposeConsents.values()].length, '[...tcModel.purposeConsents.values()].length').to.equal(
            10,
        );
        expect([...tcModel.vendorConsents.values()].length, '[...tcModel.vendorConsents.values()].length').to.equal(
            736,
        );
        expect(
            [...tcModel.vendorLegitimateInterests.values()].length,
            '[...tcModel.vendorLegitimateInterests.values()].length',
        ).to.equal(290);

        const acModel = uiChoicesParser.parseACModel(choicesStateHandler);

        expect(
            [...acModel.googleVendorOptions.filter((option) => option.state)].length,
            '[...acModel.googleVendorOptions.filter(option => option.state)].length',
        ).to.equal(1);

        expect(
            [...tcModel.specialFeatureOptins.values()].length,
            '[...tcModel.specialFeatureOptins.values()].length',
        ).to.equal(1);
    });
});

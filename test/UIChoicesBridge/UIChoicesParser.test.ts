import { expect } from 'chai';
import UIChoicesParser from '../../src/UIChoicesBridge/UIChoicesParser';

// @ts-ignore
import { getUIChoicesStateHandler } from './UIChoicesStateHandler.test';

describe('UIChoicesParser suit test', () => {

    it('UIChoicesParser parsing logic validation test', () => {
        const uiChoicesParser = UIChoicesParser.getInstance();

        const choicesStateHandler = getUIChoicesStateHandler();

        //Simulate User choices changes
        choicesStateHandler.UIPurposeChoices.forEach((purposeChoice) => (purposeChoice.state = true));

        expect(
            [...uiChoicesParser.tcModel.purposeConsents.values()].length,
            '[...uiChoicesParser.tcModel.purposeConsents.values()].length',
        ).to.equal(2);
        expect(
            uiChoicesParser.acModel.googleVendorOptions.length,
            'uiChoicesParser.acModel.googleVendorOptions.length',
        ).to.equal(2);

        const tcModel = uiChoicesParser.parseTCModel(choicesStateHandler);

        expect([...tcModel.purposeConsents.values()].length, '[...tcModel.purposeConsents.values()].length').to.equal(
            10,
        );
        expect([...tcModel.vendorConsents.values()].length, '[...tcModel.vendorConsents.values()].length').to.equal(2);
        expect(
            [...tcModel.vendorLegitimateInterests.values()].length,
            '[...tcModel.vendorLegitimateInterests.values()].length',
        ).to.equal(2);

        const acModel = uiChoicesParser.parseACModel(choicesStateHandler);

        expect(
            [...acModel.googleVendorOptions.filter((option) => option.state)].length,
            '[...acModel.googleVendorOptions.filter(option => option.state)].length',
        ).to.equal(1);
    });
});

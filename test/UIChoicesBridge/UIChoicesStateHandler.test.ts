import UIChoicesBridgeBuilder from '../../src/UIChoicesBridge/UIChoicesBridgeBuilder';
import { expect } from 'chai';
import { GVL, TCModel } from '@iabtcf/core';
import ACModel from '../../src/Entity/ACModel';
import vendorList from '../Fixtures/vendor-list';
import UIChoicesBridgeDto from '../../src/UIChoicesBridge/UIChoicesBridgeDto';

const getTCModelByFixture = function () {
    // @ts-ignore
    const gvl = new GVL(vendorList);

    const tcModel = new TCModel(gvl);
    tcModel.vendorLegitimateInterests.set([8, 46]);
    tcModel.vendorConsents.set([8, 46]);
    tcModel.purposeConsents.set([1, 2]);

    return tcModel;
};

const getACModelByFixture = function () {
    return new ACModel([
        {
            id: 1,
            name: 'ac1',
            policyUrl: 'urlPolicy',
            domains: 'solo-cmp-ac.com',
            state: true,
            expanded: false,
        },
        {
            id: 2,
            name: 'ac2',
            policyUrl: 'urlPolicy',
            domains: 'solo-cmp-ac.com',
            state: false,
            expanded: false,
        },
    ]);
};

describe('UIChoicesStateHandler suit test', () => {
    it('UIChoicesStateHandler test entity built with getInstance singleton test', () => {
        const uiChoicesBridgeDto: UIChoicesBridgeDto = new UIChoicesBridgeBuilder(
            getTCModelByFixture(),
            getACModelByFixture(),
        ).createUIChoicesBridgeDto();

        const tcModel = getTCModelByFixture();
        const acModel = getACModelByFixture();

        expect(uiChoicesBridgeDto.UIPurposeChoices.length, 'choicesStateHandler.UIPurposeChoices.length').to.equal(
            Object.keys(tcModel.gvl.purposes).length,
        );
        expect(uiChoicesBridgeDto.UIVendorChoices.length, 'choicesStateHandler.UIVendorChoices.length').to.equal(
            Object.keys(tcModel.gvl.vendors).length,
        );
        expect(
            uiChoicesBridgeDto.UIGoogleVendorOptions.length,
            'choicesStateHandler.UIGoogleVendorOptions.length',
        ).to.equal(2);

        //Check UILegitimateInterestsPurposeChoices
        const countLegIntPurposeChoicesEnabled = uiChoicesBridgeDto.UILegitimateInterestsPurposeChoices.filter(
            (choice) => choice.state,
        ).length;
        expect(countLegIntPurposeChoicesEnabled, 'countLegIntPurposeChoicesEnabled').to.equal(
            [...tcModel.purposeLegitimateInterests.values()].length,
        );

        //Check UILegitimateInterestsVendorChoices
        const countLegIntVendorsChoicesEnabled = uiChoicesBridgeDto.UILegitimateInterestsVendorChoices.filter(
            (choice) => choice.state,
        ).length;
        expect(countLegIntVendorsChoicesEnabled, 'countLegIntVendorsChoicesEnabled').to.equal(
            [...tcModel.vendorLegitimateInterests.values()].length,
        );

        //Check UIVendorChoices
        const countVendorsChoicesEnabled = uiChoicesBridgeDto.UIVendorChoices.filter((choice) => choice.state).length;
        expect(countVendorsChoicesEnabled, 'countVendorsChoicesEnabled').to.equal(
            [...tcModel.vendorConsents.values()].length,
        );

        //Check UIPurposeChoices
        const countPurposeChoicesEnabled = uiChoicesBridgeDto.UIPurposeChoices.filter((choice) => choice.state).length;
        expect(countPurposeChoicesEnabled, 'countPurposeChoicesEnabled').to.equal(
            [...tcModel.purposeConsents.values()].length,
        );

        //Check UIGoogleVendorOptions
        const countGoogleVendorOptionsChoicesEnabled = uiChoicesBridgeDto.UIGoogleVendorOptions.filter(
            (choice) => choice.state,
        ).length;
        expect(countGoogleVendorOptionsChoicesEnabled, 'countGoogleVendorOptionsChoicesEnabled').to.equal(
            acModel.googleVendorOptions.filter((option) => option.state).length,
        );
    });
});

export { getTCModelByFixture, getACModelByFixture };

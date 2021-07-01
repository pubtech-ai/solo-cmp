import UIChoicesStateHandler from '../../src/UIChoicesBridge/UIChoicesStateHandler';
import { expect } from 'chai';
import { GVL, TCModel } from '@iabtcf/core';
import ACModel from '../../src/Entity/ACModel';
import vendorList from '../Fixtures/vendor-list';

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

const getUIChoicesStateHandler = function () {
    const tcModel = getTCModelByFixture();
    const acModel = getACModelByFixture();

    return UIChoicesStateHandler.getInstance(tcModel, acModel, true);
};

describe('UIChoicesStateHandler suit test', () => {
    it('UIChoicesStateHandler test entity built with getInstance singleton test', () => {
        const choicesStateHandler = getUIChoicesStateHandler();

        const tcModel = getTCModelByFixture();
        const acModel = getACModelByFixture();

        expect(choicesStateHandler.UIPurposeChoices.length, 'choicesStateHandler.UIPurposeChoices.length').to.equal(
            Object.keys(tcModel.gvl.purposes).length,
        );
        expect(choicesStateHandler.UIVendorChoices.length, 'choicesStateHandler.UIVendorChoices.length').to.equal(
            Object.keys(tcModel.gvl.vendors).length,
        );
        expect(
            choicesStateHandler.UIGoogleVendorOptions.length,
            'choicesStateHandler.UIGoogleVendorOptions.length',
        ).to.equal(2);

        //Check UILegitimateInterestsPurposeChoices
        const countLegIntPurposeChoicesEnabled = choicesStateHandler.UILegitimateInterestsPurposeChoices.filter(
            (choice) => choice.state,
        ).length;
        expect(countLegIntPurposeChoicesEnabled, 'countLegIntPurposeChoicesEnabled').to.equal(
            [...tcModel.purposeLegitimateInterests.values()].length,
        );

        //Check UILegitimateInterestsVendorChoices
        const countLegIntVendorsChoicesEnabled = choicesStateHandler.UILegitimateInterestsVendorChoices.filter(
            (choice) => choice.state,
        ).length;
        expect(countLegIntVendorsChoicesEnabled, 'countLegIntVendorsChoicesEnabled').to.equal(
            [...tcModel.vendorLegitimateInterests.values()].length,
        );

        //Check UIVendorChoices
        const countVendorsChoicesEnabled = choicesStateHandler.UIVendorChoices.filter((choice) => choice.state).length;
        expect(countVendorsChoicesEnabled, 'countVendorsChoicesEnabled').to.equal(
            [...tcModel.vendorConsents.values()].length,
        );

        //Check UIPurposeChoices
        const countPurposeChoicesEnabled = choicesStateHandler.UIPurposeChoices.filter((choice) => choice.state).length;
        expect(countPurposeChoicesEnabled, 'countPurposeChoicesEnabled').to.equal(
            [...tcModel.purposeConsents.values()].length,
        );

        //Check UIGoogleVendorOptions
        const countGoogleVendorOptionsChoicesEnabled = choicesStateHandler.UIGoogleVendorOptions.filter(
            (choice) => choice.state,
        ).length;
        expect(countGoogleVendorOptionsChoicesEnabled, 'countGoogleVendorOptionsChoicesEnabled').to.equal(
            acModel.googleVendorOptions.filter((option) => option.state).length,
        );
    });

    it('UIChoicesStateHandler singleton getInstance test', () => {
        expect(UIChoicesStateHandler.getInstance() instanceof UIChoicesStateHandler).to.be.true;
    });
});

export { getUIChoicesStateHandler, getTCModelByFixture, getACModelByFixture };

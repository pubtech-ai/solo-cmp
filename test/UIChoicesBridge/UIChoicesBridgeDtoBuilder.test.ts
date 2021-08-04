import { expect } from 'chai';
import { GVL, TCModel } from '@iabtcf/core';
import vendorList from '../Fixtures/vendor-list';
import { ACModel } from '../../src/Entity';
import { UIChoicesBridgeDto, UIChoicesBridgeDtoBuilder } from '../../src/UIChoicesBridge';

const getTCModelByFixture = function () {
    // @ts-ignore
    const gvl = new GVL(vendorList);

    const tcModel = new TCModel(gvl);
    tcModel.isServiceSpecific = true;
    tcModel.vendorLegitimateInterests.set([8, 46]);
    tcModel.vendorConsents.set([8, 46]);
    tcModel.purposeConsents.set([1, 2]);

    return tcModel;
};

const getACModelByFixture = function (): ACModel {
    return new ACModel([
        {
            id: 1,
            name: 'ac1',
            policyUrl: 'urlPolicy',
            domains: 'solo-cmp-ac.com',
            state: true,
        },
        {
            id: 2,
            name: 'ac2',
            policyUrl: 'urlPolicy',
            domains: 'solo-cmp-ac.com',
            state: false,
        },
    ]);
};

describe('UIChoicesBridgeDtoBuilder suit test', () => {
    it('UIChoicesBridgeDtoBuilder test entity built with getInstance singleton test', () => {
        const tcModel = getTCModelByFixture();
        const acModel = getACModelByFixture();

        const uiChoicesBridgeDto: UIChoicesBridgeDto = new UIChoicesBridgeDtoBuilder(
            tcModel,
            acModel,
            true,
        ).createUIChoicesBridgeDto();


        expect(uiChoicesBridgeDto.UIPurposeChoices.length, 'choicesStateHandler.UIPurposeChoices.length').to.equal(
            Object.keys(tcModel.gvl.purposes).length,
        );
        expect(
            uiChoicesBridgeDto.UIPurposeChoices[0].vendorsRestriction.length,
            'uiChoicesBridgeDto.UIPurposeChoices[0].vendorsRestriction.length',
        ).to.equal(
            Object.keys(tcModel.gvl.getVendorsWithConsentPurpose(uiChoicesBridgeDto.UIPurposeChoices[0].id)).length,
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
            9,
        );

        //Check UILegitimateInterestsVendorChoices
        const countLegIntVendorsChoicesEnabled = uiChoicesBridgeDto.UILegitimateInterestsVendorChoices.filter(
            (choice) => choice.state,
        ).length;
        expect(countLegIntVendorsChoicesEnabled, 'countLegIntVendorsChoicesEnabled').to.equal(
            290,
        );

        //Check PurposeVendorRestrictionOption
        const countPurposeVendorRestrictionOptionEnabled = uiChoicesBridgeDto.UIPurposeChoices[0].vendorsRestriction.filter(
            (choice) => choice.state,
        ).length;
        expect(countPurposeVendorRestrictionOptionEnabled, 'countPurposeVendorRestrictionOptionEnabled').to.equal(0);

        //Check UIPurposeChoices
        const countPurposeChoicesEnabled = uiChoicesBridgeDto.UIPurposeChoices.filter((choice) => choice.state).length;
        expect(countPurposeChoicesEnabled, 'countPurposeChoicesEnabled').to.equal(
            [...tcModel.purposeConsents.values()].length,
        );

        //Check UISpecialFeatureChoices
        const countSpecialFeatureChoicesEnabled = uiChoicesBridgeDto.UISpecialFeatureChoices.filter(
            (choice) => choice.state,
        ).length;
        expect(countSpecialFeatureChoicesEnabled, 'countSpecialFeatureChoicesEnabled').to.equal(0);

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

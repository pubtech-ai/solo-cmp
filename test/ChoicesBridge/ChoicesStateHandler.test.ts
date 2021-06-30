import ChoicesStateHandler from '../../src/ChoicesBridge/ChoicesStateHandler';
import { expect } from 'chai';
import { GVL, TCModel } from '@iabtcf/core';
import ACModel from '../../src/Entity/ACModel';
import vendorList from '../Fixtures/vendor-list';

describe('ChoicesStateHandler suit test', () => {
    const getTCModelByFixture = function () {
        // @ts-ignore
        const gvl = new GVL(vendorList);

        const tcModel = new TCModel(gvl);
        tcModel.vendorLegitimateInterests.set([8, 46]);
        tcModel.vendorConsents.set([8, 46]);
        tcModel.purposeConsents.set([1, 2]);

        return tcModel;
    };

    it('ChoicesStateHandler construction fail for first time with getInstance test', () => {
        const constructionFail = function () {
            ChoicesStateHandler.getInstance();
        };

        expect(constructionFail).to.throw('ChoicesStateHandler, you must provide the TCModel.');
    });

    it('ChoicesStateHandler construction fail for first time with getInstance test', () => {
        const constructionFail = function () {
            ChoicesStateHandler.getInstance(getTCModelByFixture());
        };

        expect(constructionFail).to.throw('ChoicesStateHandler, you must provide the ACModel.');
    });

    it('ChoicesStateHandler construction valid getInstance test', () => {
        const choicesStateHandler = ChoicesStateHandler.getInstance(getTCModelByFixture(), new ACModel([]));

        expect(choicesStateHandler instanceof ChoicesStateHandler).to.be.true;
    });

    it('ChoicesStateHandler test entity built with getInstance test', () => {
        const tcModel = getTCModelByFixture();
        const acModel = new ACModel([]);

        const choicesStateHandler = ChoicesStateHandler.getInstance(tcModel, acModel);

        expect(choicesStateHandler.UIPurposeChoices.length, 'choicesStateHandler.UIPurposeChoices.length').to.equal(
            Object.keys(tcModel.gvl.purposes).length,
        );
        expect(choicesStateHandler.UIVendorChoices.length, 'choicesStateHandler.UIVendorChoices.length').to.equal(
            Object.keys(tcModel.gvl.vendors).length,
        );
        expect(
            choicesStateHandler.UIGoogleVendorOptions.length,
            'choicesStateHandler.UIGoogleVendorOptions.length',
        ).to.equal(0);

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
            acModel.googleVendorOptions.length,
        );
    });
});

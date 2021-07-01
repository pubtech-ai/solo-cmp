import {TCModel} from '@iabtcf/core';
import ACModel from '../Entity/ACModel';
import UIChoicesStateHandler from './UIChoicesStateHandler';
import PurposeOption from '../Entity/PurposeOption';
import VendorOption from '../Entity/VendorOption';

/**
 * UIChoicesParser.
 */
class UIChoicesParser {

    private static instance: UIChoicesParser;

    private readonly _tcModel: TCModel;
    private readonly _acModel: ACModel;

    /**
     * Constructor.
     *
     * @param {TCModel} tcModel
     * @param {ACModel} acModel
     * @private
     */
    private constructor(tcModel: TCModel, acModel: ACModel) {

        this._tcModel = tcModel.clone();
        this._tcModel.unsetAll();
        this._acModel = acModel;

    }

    /**
     * Retrieve the instance or build it if is not instantiated.
     *
     * @param {TCModel} tcModel
     * @param {ACModel} acModel
     *
     * @return {UIChoicesParser}
     */
    public static getInstance(tcModel: TCModel | null = null, acModel: ACModel | null = null): UIChoicesParser {

        if (!UIChoicesParser.instance && tcModel === null) {

            throw new Error('UIChoicesParser, you must provide the TCModel.');

        }

        if (!UIChoicesParser.instance && acModel === null) {

            throw new Error('UIChoicesParser, you must provide the ACModel.');

        }

        if (!UIChoicesParser.instance) {

            if (tcModel && acModel) {

                UIChoicesParser.instance = new UIChoicesParser(tcModel, acModel);

            }

        }

        return UIChoicesParser.instance;

    }

    /**
     * Parse the choices to build the
     * TCModel with all choices applied.
     *
     * @param {UIChoicesStateHandler} choicesStateHandler
     *
     * @return {TCModel}
     */
    public parseTCModel(choicesStateHandler: UIChoicesStateHandler): TCModel {

        this._tcModel.purposeConsents.set(this.filterEnabledChoicesId(choicesStateHandler.UIPurposeChoices));
        this._tcModel.vendorConsents.set(this.filterEnabledChoicesId(choicesStateHandler.UIVendorChoices));
        this._tcModel.purposeLegitimateInterests.set(
            this.filterEnabledChoicesId(choicesStateHandler.UILegitimateInterestsPurposeChoices),
        );
        this._tcModel.vendorLegitimateInterests.set(
            this.filterEnabledChoicesId(choicesStateHandler.UILegitimateInterestsVendorChoices),
        );

        return this._tcModel;

    }

    /**
     * Parse the choices to build the
     * ACModel with all choices applied.
     *
     * @param {UIChoicesStateHandler} choicesStateHandler
     *
     * @return {ACModel}
     */
    public parseACModel(choicesStateHandler: UIChoicesStateHandler): ACModel {

        this._acModel.googleVendorOptions = choicesStateHandler.UIGoogleVendorOptions;

        return this._acModel;

    }

    /**
     * Return the enabled choices id.
     *
     * @param {PurposeOption[] | VendorOption[]} choices
     * @private
     *
     * @return {number[]}
     */
    private filterEnabledChoicesId(choices: PurposeOption[] | VendorOption[]): number[] {

        const allChoices = [...choices];

        const enabledChoices = allChoices.filter((choice) => choice.state && !isNaN(choice.id));

        return enabledChoices.map((choice) => Number(choice.id));

    }

    get tcModel(): TCModel {

        return this._tcModel;

    }

    get acModel(): ACModel {

        return this._acModel;

    }

}

export default UIChoicesParser;

import {BaseEvent} from '../EventDispatcher';
import {TCModel} from '@iabtcf/core';
import {ACModel} from '../Entity';

/**
 * BeforeBuildStringsEvent.
 */
export class BeforeBuildStringsEvent implements BaseEvent {

    readonly EVENT_NAME = 'BeforeBuildStrings';
    static readonly EVENT_NAME = 'BeforeBuildStrings';

    private _tcModel: TCModel;
    private _acModel: ACModel;

    /**
     * Constructor.
     *
     * @param {TCModel} tcModel
     * @param {ACModel} acModel
     */
    constructor(tcModel: TCModel, acModel: ACModel) {

        this._tcModel = tcModel;
        this._acModel = acModel;

    }

    get tcModel(): TCModel {

        return this._tcModel;

    }

    set tcModel(value: TCModel) {

        this._tcModel = value;

    }

    get acModel(): ACModel {

        return this._acModel;

    }

    set acModel(value: ACModel) {

        this._acModel = value;

    }

}

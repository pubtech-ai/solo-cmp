import {GoogleVendorOption} from './GoogleVendorOption';

/**
 * ACModel.
 */
export class ACModel {

    private _googleVendorOptions: GoogleVendorOption[] = [];

    /**
     * Constructor.
     *
     * @param {GoogleVendorOption[]} googleVendorOption
     */
    constructor(googleVendorOption: GoogleVendorOption[]) {

        this._googleVendorOptions = googleVendorOption;

    }

    /**
     * Return an array of GoogleVendorOption.
     *
     * @return {GoogleVendorOption[]}
     */
    get googleVendorOptions(): GoogleVendorOption[] {

        return this._googleVendorOptions;

    }

    /**
     * Set the provided array of GoogleVendorOption.
     *
     * @param {GoogleVendorOption[]} value
     */
    set googleVendorOptions(value: GoogleVendorOption[]) {

        this._googleVendorOptions = value;

    }

}

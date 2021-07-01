import UIChoicesBridgeDto from './UIChoicesBridge/UIChoicesBridgeDto';

/**
 * SoloCmpApi.
 */
class SoloCmpApi {

    private static instance: SoloCmpApi;
    private _uiChoicesBridgeDto: UIChoicesBridgeDto;

    /**
     * Singleton implementation to expose SoloCmpApi to CMP UI.
     *
     * @return {SoloCmpApi}
     */
    public static getInstance(): SoloCmpApi {

        if (!SoloCmpApi.instance) {

            SoloCmpApi.instance = new SoloCmpApi();

        }

        return SoloCmpApi.instance;

    }

    get uiChoicesBridgeDto(): UIChoicesBridgeDto {

        return this._uiChoicesBridgeDto;

    }

    set uiChoicesBridgeDto(value: UIChoicesBridgeDto) {

        this._uiChoicesBridgeDto = value;

    }

}

export default SoloCmpApi;

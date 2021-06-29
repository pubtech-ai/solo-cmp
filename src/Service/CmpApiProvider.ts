import {CmpApi} from '@iabtcf/cmpapi';
import ACStringService from './ACStringService';

/**
 * CmpApiProvider.
 */
class CmpApiProvider {

    private readonly _cmpApi: CmpApi;

    /**
     * Constructor.
     *
     * Build the cmpApi directly and enable getTCData command
     * to receive extra property, necessary for the ACString.
     *
     * @param {number} id
     * @param {number} version
     * @param {boolean} isServiceSpecific
     * @param {ACStringService} acStringService
     */
    constructor(id: number, version: number, isServiceSpecific: boolean, acStringService: ACStringService) {

        this._cmpApi = new CmpApi(id, version, isServiceSpecific, {
            getTCData: (next: any, tcData: any, success: any) => {

                tcData.reallyImportantExtraProperty = true;
                tcData.addtlConsent = acStringService.retrieveACString();

                next(tcData, success);

            },
        });

    }

    get cmpApi(): CmpApi {

        return this._cmpApi;

    }

}

export default CmpApiProvider;

import {UIConstructor} from '../UIConstructor';

/**
 * SoloCmpDto.
 */
export interface SoloCmpDto {
    uiConstructor: UIConstructor,
    isDebugEnabled: boolean,
    cmpConfig: any,
    supportedLanguages: string[],
    cmpVersion: number,
    cmpVendorListVersion: number,
    tcStringCookieName: string,
    acStringLocalStorageName: string,
    cmpId: number,
    isServiceSpecific: boolean,
    baseUrlVendorList: string,
    initialHeightAmpCmpUi: string | null,
    enableBorderAmpCmpUi: boolean | null,
}

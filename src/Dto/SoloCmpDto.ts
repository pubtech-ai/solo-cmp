import {UIConstructor} from '../UIConstructor';
import {ConsentReadyEvent} from '../Event';
import {TCModel} from '@iabtcf/core';

/**
 * SoloCmpDto.
 */
export interface SoloCmpDto {
    uiConstructor: UIConstructor;
    isDebugEnabled: boolean;
    isAmp: boolean;
    onConsentAds: (event: ConsentReadyEvent, tcModel: TCModel) => void;
    supportedLanguages: string[];
    userLanguage: string;
    cmpVersion: number;
    acStringVersion: number;
    cmpVendorListVersion: number;
    tcStringCookieName: string;
    acStringLocalStorageName: string;
    cmpId: number;
    isServiceSpecific: boolean;
    baseUrlVendorList: string;
    initialHeightAmpCmpUi: string | null;
    enableBorderAmpCmpUi: boolean | null;
    skipACStringCheck: boolean;
    isLegitimateInterestDisabled: boolean;
}

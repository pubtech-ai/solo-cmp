import { expect } from 'chai';
const sinon = require('sinon');
import { API_KEY, CmpApi, TCData, TCFCommand } from '@iabtcf/cmpapi';
import CmpApiProvider from '../../src/Service/CmpApiProvider';
import ACStringService from '../../src/Service/ACStringService';
import LoggerService from '../../src/Service/LoggerService';
import { TCStringFactory } from '@iabtcf/testing';

import * as stub from '@iabtcf/stub';

describe('CmpApiProvider suit test', () => {
    const getCmpApi = (isServiceSpecific = false): CmpApi => {
        const loggerService: LoggerService = new LoggerService(false);

        const localStorage: Storage = {
            length: 0,
            setItem(key, value): string {
                return value;
            },
            clear() {},
            key(index: number): string | null {
                return null;
            },
            removeItem(key: string): void {},
            getItem(key: string): string | null {
                return null;
            },
        };

        const mockLocalStorage = sinon.mock(localStorage);

        const cmpId = 100;
        const cmpVersion = 15;

        const acStringService = new ACStringService(1, 'solo-cmp-ac-string', loggerService, mockLocalStorage);

        const cmpApiProvider = new CmpApiProvider(100, 1, isServiceSpecific, acStringService);

        return cmpApiProvider.cmpApi;
    };

    const removeStub = (): void => {
        // clean up that junk
        if (typeof window[API_KEY] === 'function') {
            delete window[API_KEY];
        }

        const iframes = document.querySelectorAll('iframe');

        for (let i = 0; i < iframes.length; i++) {
            const frame: HTMLElement = iframes[i];

            if (frame !== null && frame.parentNode) {
                frame.parentNode.removeChild(frame);
            }
        }
    };

    beforeEach((): void => {
        stub.default();
    });
    afterEach((): void => {
        removeStub();
    });

    it.only('When TCString is set the command should get also the ACString', (done: () => void): void => {
        const tcString = TCStringFactory.base();

        window[API_KEY](TCFCommand.GET_TC_DATA, 2, (tcData: TCData, success: boolean): void => {
            expect(success).to.be.true;
            expect(tcData.tcString, 'tcString').to.equal(tcString);
            //@ts-ignore Disable because ts check if the property exists in TCData but it supports this property
            expect(tcData.reallyImportantExtraProperty, 'extra property').to.be.true;
            //@ts-ignore Disable because ts check if the property exists in TCData but it supports this property
            expect(tcData.addtlConsent, 'acString').to.equal('1~');
            done();
        });

        const cmpApi = getCmpApi();

        cmpApi.update(tcString);
    });
});

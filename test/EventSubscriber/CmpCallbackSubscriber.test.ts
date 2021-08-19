import {expect} from 'chai';
const sinon = require('sinon');
import {ConsentReadyEvent, CmpConfigurationProvider, CmpCallbackSubscriber} from '../../src';
import {TCModel} from '@iabtcf/core';

describe('CmpCallbackSubscriber suit test', () => {

    it('CmpCallbackSubscriber getSubscribedEvents registered for ConsentReadyEvent test', () => {

        const mock = sinon.mock(Object.create(CmpConfigurationProvider));

        const cmpCallbackSubscriber = new CmpCallbackSubscriber(mock);

        expect(cmpCallbackSubscriber.getSubscribedEvents()).to.have.own.property(ConsentReadyEvent.name);

    });

    it('CmpCallbackSubscriber call callback stored inside CmpConfiguration test', (done) => {

        const tcString = 'CPKMzMdPKMzMdFgACAITBjCsAP_AAH_AAAAAIEtf_X__bX9j-_59f_t0eY1P9_r_v-Qzjhfdt-8N2L_W_L0X42E7NF36pq4KuR4Eu3LBIQNlHMHUTUmw6okVrzPsak2Mr7NKJ7LEmnMZO2dYGHtfn91TuZKY7_78_9fz3z-v_v___9f3r-3_3__59X---_e_V399zLv9_____9nN__4ICAEmGpfQBdiWODJtGlUKIEYVhIdAKACigGFomsIGBwU7KwCPUELABCagIwIgQYgoxYBAAIBAEhEQEgB4IBEARAIAAQAqQEIACJgEFgBYGAQACgGhYgRQBCBIQZHBUcpgQESLRQT2VgCUXexphCGUWAFAo_oqMBEoQQLAyEhYOY4AkAAA.YAAAAAAAAAAA';

        const cmpConfig = {
            isAmp: false,
            onConsentAds: (eventData, iabConsentsObject) => {

                if (
                    iabConsentsObject instanceof TCModel &&
                    iabConsentsObject.purposeConsents.has(1) &&
                    eventData.tcString === tcString
                ) {

                    done();

                }

            },
            debug: true,
        };

        const cmpConfigurationProvider: CmpConfigurationProvider = new CmpConfigurationProvider(cmpConfig);

        const cmpCallbackSubscriber = new CmpCallbackSubscriber(cmpConfigurationProvider);

        const consentReadyEvent = new ConsentReadyEvent(tcString, 'cba');

        cmpCallbackSubscriber[cmpCallbackSubscriber.getSubscribedEvents()[ConsentReadyEvent.name]](consentReadyEvent);

    });

});

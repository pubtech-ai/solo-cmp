import { expect } from 'chai';
const sinon = require('sinon');
import ConsentReadyEvent from '../../src/Event/ConsentReadyEvent';
import CmpConfigurationProvider from '../../src/Service/CmpConfigurationProvider';
import CmpCallbackSubscriber from '../../src/EventSubscriber/CmpCallbackSubscriber';

describe('CmpCallbackSubscriber suit test', () => {
    it('CmpCallbackSubscriber getSubscribedEvents registered for ConsentReadyEvent test', () => {
        const mock = sinon.mock(Object.create(CmpConfigurationProvider));

        const cmpCallbackSubscriber = new CmpCallbackSubscriber(mock);

        expect(cmpCallbackSubscriber.getSubscribedEvents()).to.have.own.property(ConsentReadyEvent.name);
    });

    it('CmpCallbackSubscriber call callback stored inside CmpConfiguration test', (done) => {
        const cmpConfig = {
            isAmp: false,
            onConsentAds: (event) => {
                if (event.tcString === 'abc') {
                    done();
                }
            },
            debug: true,
        };

        const cmpConfigurationProvider: CmpConfigurationProvider = new CmpConfigurationProvider(cmpConfig);

        const cmpCallbackSubscriber = new CmpCallbackSubscriber(cmpConfigurationProvider);

        const consentReadyEvent = new ConsentReadyEvent('abc', 'cba');

        cmpCallbackSubscriber[cmpCallbackSubscriber.getSubscribedEvents()[ConsentReadyEvent.name]](consentReadyEvent);
    });
});

import {CmpApiProvider} from '../../src/Service';
import {expect} from 'chai';
const sinon = require('sinon');
import {CmpApiSubscriber} from '../../src/EventSubscriber';
import {ConsentReadyEvent, ConsentRequiredEvent} from '../../src/Event';
// @ts-ignore
import {getCmpApiProvider} from '../Service/CmpApiProvider.test';

describe('CmpApiSubscriber suit test', () => {

    it('CmpApiSubscriber getSubscribedEvents registered for ConsentReadyEvent and ConsentRequiredEvent test', () => {

        const mock = sinon.mock(Object.create(CmpApiProvider));

        const cmpApiSubscriber = new CmpApiSubscriber(mock);

        expect(cmpApiSubscriber.getSubscribedEvents()).to.have.own.property(ConsentReadyEvent.name);
        expect(cmpApiSubscriber.getSubscribedEvents()).to.have.own.property(ConsentRequiredEvent.name);

    });

    it('CmpApiSubscriber call cmpApi update when for ConsentReadyEvent test', () => {

        const cmpApiProvider = getCmpApiProvider();

        const mock = sinon.mock(cmpApiProvider.cmpApi);

        const consentReadyEvent = new ConsentReadyEvent('abc', 'cba');

        mock.expects('update').once().withArgs(consentReadyEvent.tcString, false);

        const cmpApiSubscriber = new CmpApiSubscriber(cmpApiProvider);

        cmpApiSubscriber[cmpApiSubscriber.getSubscribedEvents()[ConsentReadyEvent.name]](consentReadyEvent);

        mock.verify();

    });

    it('CmpApiSubscriber call cmpApi update when for ConsentRequiredEvent test', () => {

        const cmpApiProvider = getCmpApiProvider();

        const mock = sinon.mock(cmpApiProvider.cmpApi);

        const consentRequiredEvent = new ConsentRequiredEvent();

        mock.expects('update').once().withArgs('', true);

        const cmpApiSubscriber = new CmpApiSubscriber(cmpApiProvider);

        cmpApiSubscriber[cmpApiSubscriber.getSubscribedEvents()[ConsentRequiredEvent.name]](consentRequiredEvent);

        mock.verify();

    });

});

import { expect } from 'chai';
import DependencyInjectionManager from '../../src/DependencyInjection/DependencyInjectionManager';

describe('DependencyInjectionManager suit test', () => {
    it('DependencyInjectionManager register service', () => {
        function ObjTest(name) {
            name;
        }

        ObjTest.prototype.printContainer = function () {
            console.log(this.container);
        };

        DependencyInjectionManager.addServiceProvider(ObjTest.name, () => {
            return new ObjTest('service');
        });

        expect(new ObjTest('service')).to.deep.equal(DependencyInjectionManager.getService(ObjTest.name));
    });

    it('DependencyInjectionManager register subscriber', () => {
        function ObjTest(name) {
            name;
        }

        ObjTest.prototype.getSubscribedEvents = function () {
            return { event: 'method' };
        };

        DependencyInjectionManager.addEventSubscriberProvider(ObjTest.name, () => {
            return new ObjTest('eventSubscriber');
        });

        expect(new ObjTest('eventSubscriber')).to.deep.equal(
            DependencyInjectionManager.getSubContainer('eventSubscriber')[ObjTest.name],
        );
    });
});

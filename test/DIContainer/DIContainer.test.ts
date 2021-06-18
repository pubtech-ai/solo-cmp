import { expect } from "chai";
import DIContainer from "../../src/DIContainer";

describe("DIContainer suit test", () => {

    it("DIContainer register service", () => {
        function ObjTest(name) {
            name;
        }

        ObjTest.prototype.printContainer = function () { console.log(this.container); }

        DIContainer.addServiceProvider(ObjTest.name, () => {
            return new ObjTest('service');
        });

        expect(new ObjTest('service')).to.deep.equal(DIContainer.getService(ObjTest.name));
    });

    it("DIContainer register subscriber", () => {
        function ObjTest(name) {
            name;
        }

        ObjTest.prototype.getSubscribedEvents = function () { return {'event': 'method'}; }

        DIContainer.addEventSubscriberProvider(ObjTest.name, () => {
            return new ObjTest('eventSubscriber');
        });

        expect(new ObjTest('eventSubscriber')).to.deep.equal(DIContainer.getContainer('eventSubscriber')[ObjTest.name]);
    });

});

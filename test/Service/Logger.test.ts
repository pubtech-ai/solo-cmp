import { expect } from "chai";
const sinon = require("sinon");
import Logger from "../../src/Service/Logger";

describe("Logger suit test", () => {

    before(() => {

        let debug = console.debug;
        sinon
            .stub(console, 'debug').callsFake(function () {
            // @ts-ignore
            return debug.apply(debug, arguments);
        });

        let trace = console.trace;
        sinon
            .stub(console, 'trace').callsFake(function () {
            // @ts-ignore
            return trace.apply(trace, arguments);
        });
    });

    it("Logger construction should log debug enabled message test", () => {
        new Logger(true);

        //@ts-ignore
        expect( console.debug.calledOnce ).to.be.true;
        //@ts-ignore
        expect( console.debug.calledWith('%c SOLO-CMP DEBUG: ENABLED', Logger.debugStyle) ).to.be.true;

    });

    it("Logger error should log error message test", () => {
        const debugService = new Logger(true);

        debugService.error('Test');

        //@ts-ignore
        expect( console.trace.calledOnce ).to.be.true;
        //@ts-ignore
        expect( console.trace.calledWith('%c SOLO-CMP ERROR: Test', Logger.errorStyle) ).to.be.true;

    });
});

import { expect } from 'chai';
const sinon = require('sinon');
import { LoggerService } from '../../src/Service';

describe('Logger suit test', () => {
    before(() => {
        let debug = console.debug;
        sinon.stub(console, 'debug').callsFake(function () {
            // @ts-ignore
            return debug.apply(debug, arguments);
        });

        let trace = console.trace;
        sinon.stub(console, 'trace').callsFake(function () {
            // @ts-ignore
            return trace.apply(trace, arguments);
        });
    });

    it('Logger construction should log debug enabled message test', () => {
        new LoggerService(true);

        //@ts-ignore
        expect(console.debug.calledOnce).to.be.true;
        //@ts-ignore
        expect(console.debug.calledWith('%c SOLO-CMP DEBUG: ENABLED', LoggerService.debugStyle)).to.be.true;
    });

    it('Logger error should log error message test', () => {
        const debugService = new LoggerService(true);

        debugService.error('Test');

        //@ts-ignore
        expect(console.trace.calledOnce).to.be.true;
        //@ts-ignore
        expect(console.trace.calledWith('%c SOLO-CMP ERROR: Test', LoggerService.errorStyle)).to.be.true;
    });
});

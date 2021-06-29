import { expect } from 'chai';
import UIConstructor from "../../src/UIConstructor";
const sinon = require('sinon');

describe('UIConstructor suit test', () => {

    it('UIConstructor construction test', () => {
        const construction = function () {
            const mockDocument = sinon.mock({});
            new UIConstructor(mockDocument, ' \t\n', () => {}, () => {});
        };

        expect(construction).to.throw('UIConstructor, domElementId must be a string with length greater than zero and contains only letters and numbers.');
    });

    it('UIConstructor construction test', done => {
        const uiConstructor = new UIConstructor(document, 'ciccio', done, () => {});

        uiConstructor.buildUIAndRender();
    });

    it('UIConstructor construction test', done => {
        const uiConstructor = new UIConstructor(document, 'ciccio', () => {}, done);

        uiConstructor.buildOpenCmpButtonAndRender();
    });
});

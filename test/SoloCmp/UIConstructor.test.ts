import {expect} from 'chai';
import {SoloCmpDataBundle, UIChoicesBridgeDto, UIConstructor} from '../../src';
// @ts-ignore
import {getACModelByFixture, getTCModelByFixture} from '../UIChoicesBridge/UIChoicesBridgeDtoBuilder.test';
const sinon = require('sinon');

describe('UIConstructor suit test', () => {

    it('UIConstructor construction test', () => {

        const construction = function() {

            const mockDocument = sinon.mock({});
            new UIConstructor(
                mockDocument,
                ' \t\n',
                () => {},
                () => {},
            );

        };

        expect(construction).to.throw(
            'UIConstructor, domElementId must be a string with length greater than zero and contains only letters and numbers.',
        );

    });

    it('UIConstructor build and render complete CMP UI test', (done) => {

        const cmpBuildUIAndRenderCallback = function(element: HTMLElement) {

            done();

        };

        const uiConstructor = new UIConstructor(document, 'solo-cmp-dom-id', cmpBuildUIAndRenderCallback, () => {});

        uiConstructor.buildUIAndRender(
            new SoloCmpDataBundle(
                new UIChoicesBridgeDto([], [], [], [], []),
                getTCModelByFixture(),
                getACModelByFixture(),
            ),
        );

    });

    it('UIConstructor build and render CMP open button UI test', (done) => {

        const cmpButtonBuildUIAndRenderCallback = function(element: HTMLElement) {

            done();

        };

        const uiConstructor = new UIConstructor(
            document,
            'solo-cmp-dom-id',
            () => {},
            cmpButtonBuildUIAndRenderCallback,
        );

        uiConstructor.buildOpenCmpButtonAndRender();

    });

    it('UIConstructor build and render complete CMP UI error handling test', () => {

        const cmpBuildUIAndRenderCallback = function(element: HTMLElement) {

            throw new Error('Something doesn\'t work!');

        };

        const uiConstructor = new UIConstructor(document, 'solo-cmp-dom-id', cmpBuildUIAndRenderCallback, () => {});

        const buildUIAndRenderError = function() {

            uiConstructor.buildUIAndRender(
                new SoloCmpDataBundle(
                    new UIChoicesBridgeDto([], [], [], [], []),
                    getTCModelByFixture(),
                    getACModelByFixture(),
                ),
            );

        };

        expect(buildUIAndRenderError).to.throw(
            'UIConstructor, renderCmpCallback error: Error: Something doesn\'t work!',
        );

    });

    it('UIConstructor build and render CMP open button UI error handling test', () => {

        const cmpButtonBuildUIAndRenderCallback = function(element: HTMLElement) {

            throw new Error('Something doesn\'t work!');

        };

        const uiConstructor = new UIConstructor(
            document,
            'solo-cmp-dom-id',
            () => {},
            cmpButtonBuildUIAndRenderCallback,
        );

        const buildUIAndRenderError = function() {

            uiConstructor.buildOpenCmpButtonAndRender();

        };

        expect(buildUIAndRenderError).to.throw(
            'UIConstructor, renderOpenCmpButtonCallback error: Error: Something doesn\'t work!',
        );

    });

});

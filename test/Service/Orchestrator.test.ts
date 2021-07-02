const sinon = require('sinon');
import { TCModel, TCString } from '@iabtcf/core';
import { TCModelFactory } from '@iabtcf/testing';
import CmpSupportedLanguageProvider from '../../src/Service/CmpSupportedLanguageProvider';
import TCStringService from '../../src/Service/TCStringService';
import LoggerService from '../../src/Service/LoggerService';
import CookieService from '../../src/Service/CookieService';
import ACStringService from '../../src/Service/ACStringService';
import Orchestrator from '../../src/Service/Orchestrator';
import UIConstructor from '../../src/UIConstructor';
import EventDispatcher from '../../src/EventDispatcher/EventDispatcher';
import OpenCmpUIEvent from '../../src/Event/OpenCmpUIEvent';
import ConsentReadyEvent from '../../src/Event/ConsentReadyEvent';

describe('Orchestrator suit test', () => {
    const tcModel = (TCModelFactory.withGVL() as unknown) as TCModel;

    const getTCStringService = () => {
        const loggerService: LoggerService = new LoggerService(false);

        const document = {
            cookie: '',
        };

        const mockDocument = sinon.mock(document);
        const cookieService: CookieService = new CookieService(loggerService, 'solocmp.com', mockDocument);

        const cmpSupportedLanguageProvider = new CmpSupportedLanguageProvider(
            ['it', 'fr', 'en'],
            tcModel.consentLanguage,
        );

        return new TCStringService(
            cookieService,
            loggerService,
            cmpSupportedLanguageProvider,
            Number(tcModel.cmpVersion),
            Number(tcModel.vendorListVersion),
            'solo-cmp-tc-string',
        );
    };

    const getACStringService = () => {
        const loggerService: LoggerService = new LoggerService(false);

        return new ACStringService(
            Number(tcModel.cmpVersion),
            'solo-cmp-ac-string',
            loggerService,
            global.localStorage,
        );
    };

    it('Orchestrator initCmp with valid consent strings render only cmp button ui test', (done) => {
        const tcStringService = getTCStringService();

        sinon.stub(tcStringService, 'retrieveTCString').callsFake(function fakeMakeRequest() {
            return TCString.encode(tcModel);
        });

        const acStringService = getACStringService();

        sinon.stub(acStringService, 'retrieveACString').callsFake(function fakeMakeRequest() {
            return `${tcModel.cmpVersion}~`;
        });

        const cmpBuildUIAndRenderCallback = function (element: HTMLElement) {
            done();
        };

        const uiConstructor = new UIConstructor(document, 'solo-cmp', () => {}, cmpBuildUIAndRenderCallback);

        const eventDispatcher = EventDispatcher.getInstance();

        var mock = sinon.mock(eventDispatcher);
        mock.expects('dispatch')
            .once()
            .withExactArgs(new ConsentReadyEvent(TCString.encode(tcModel), `${tcModel.cmpVersion}~`));

        const orchestrator = new Orchestrator(tcStringService, acStringService, uiConstructor, eventDispatcher);

        orchestrator.initCmp();
        mock.verify();
    });

    it('Orchestrator initCmp with invalid consent tcString dispatch OpenCmpUIEvent test', () => {
        const tcStringService = getTCStringService();

        sinon.stub(tcStringService, 'retrieveTCString').callsFake(function fakeMakeRequest() {
            return '';
        });

        const acStringService = getACStringService();

        sinon.stub(acStringService, 'retrieveACString').callsFake(function fakeMakeRequest() {
            return `${tcModel.cmpVersion}~`;
        });

        const uiConstructor = new UIConstructor(
            document,
            'solo-cmp',
            () => {},
            () => {},
        );

        const eventDispatcher = EventDispatcher.getInstance();

        var mock = sinon.mock(eventDispatcher);
        mock.expects('dispatch').once().withExactArgs(new OpenCmpUIEvent());

        const orchestrator = new Orchestrator(tcStringService, acStringService, uiConstructor, eventDispatcher);

        orchestrator.initCmp();
        mock.verify();
    });

    it('Orchestrator initCmp with invalid consent tcString remove tcString and acString test', () => {
        const tcStringService = getTCStringService();

        sinon.stub(tcStringService, 'retrieveTCString').callsFake(function fakeMakeRequest() {
            return 'Somethings!';
        });

        const acStringService = getACStringService();

        sinon.stub(acStringService, 'retrieveACString').callsFake(function fakeMakeRequest() {
            return `${tcModel.cmpVersion}~`;
        });

        const uiConstructor = new UIConstructor(
            document,
            'solo-cmp',
            () => {},
            () => {},
        );

        var mockTCStringService = sinon.mock(tcStringService);
        mockTCStringService.expects('removeTCString').once();
        var mockACStringService = sinon.mock(acStringService);
        mockACStringService.expects('removeACString').once();

        const orchestrator = new Orchestrator(
            tcStringService,
            acStringService,
            uiConstructor,
            EventDispatcher.getInstance(),
        );

        orchestrator.initCmp();
        mockTCStringService.verify();
        mockACStringService.verify();
    });
});

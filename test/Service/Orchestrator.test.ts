import {
    ACStringService,
    CmpSupportedLanguageProvider,
    CookieService,
    LoggerService,
    Orchestrator,
    TCStringService,
} from '../../src/Service';

const sinon = require('sinon');
import {TCModel, TCString} from '@iabtcf/core';
import {TCModelFactory} from '@iabtcf/testing';
import {ConsentReadyEvent, EventDispatcher, OpenCmpUIEvent, UIConstructor} from '../../src';

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

        const cmpBuildUIAndRenderCallback = function(element: HTMLElement) {

            done();

        };

        const uiConstructor = new UIConstructor(document, 'solo-cmp', () => {}, cmpBuildUIAndRenderCallback);

        const eventDispatcher = EventDispatcher.getInstance();

        const mock = sinon.mock(eventDispatcher);
        mock.expects('dispatch')
            .once()
            .withExactArgs(new ConsentReadyEvent(TCString.encode(tcModel), `${tcModel.cmpVersion}~`));

        const loggerService: LoggerService = new LoggerService(false);

        const orchestrator = new Orchestrator(
            tcStringService,
            acStringService,
            uiConstructor,
            eventDispatcher,
            loggerService,
        );

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

        const mock = sinon.mock(eventDispatcher);
        mock.expects('dispatch').once().withExactArgs(new OpenCmpUIEvent());

        const loggerService: LoggerService = new LoggerService(false);

        const orchestrator = new Orchestrator(
            tcStringService,
            acStringService,
            uiConstructor,
            eventDispatcher,
            loggerService,
        );

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

        const mockTCStringService = sinon.mock(tcStringService);
        mockTCStringService.expects('removeTCString').once();
        const mockACStringService = sinon.mock(acStringService);
        mockACStringService.expects('removeACString').once();

        const loggerService: LoggerService = new LoggerService(false);

        const orchestrator = new Orchestrator(
            tcStringService,
            acStringService,
            uiConstructor,
            EventDispatcher.getInstance(),
            loggerService,
        );

        orchestrator.initCmp();
        mockTCStringService.verify();
        mockACStringService.verify();

    });

});

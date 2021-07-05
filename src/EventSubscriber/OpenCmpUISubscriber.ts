import {EventSubscriberInterface} from '../EventDispatcher';
import {OpenCmpUIEvent} from '../Event';
import {CmpPreparatoryService} from '../Service';

/**
 * OpenCmpUISubscriber.
 */
export class OpenCmpUISubscriber implements EventSubscriberInterface {

    private cmpPreparatoryService: CmpPreparatoryService;

    /**
     * Constructor.
     *
     * @param {CmpPreparatoryService} cmpPreparatoryService
     */
    constructor(cmpPreparatoryService: CmpPreparatoryService) {

        this.cmpPreparatoryService = cmpPreparatoryService;

    }

    /**
     * @inheritDoc
     */
    public getSubscribedEvents(): Record<string, string> {

        return {
            [OpenCmpUIEvent.EVENT_NAME]: 'onOpenCmpUI',
        };

    }

    /**
     * Fetch the data required to build the state and also
     * build the CMP UI, in base of the callback provided
     * in UIConstructor.
     *
     * @param {OpenCmpUIEvent} event
     */
    public onOpenCmpUI(event: OpenCmpUIEvent): void {

        this.cmpPreparatoryService.prepareAndRender(event.tcString, event.acString);

    }

    static getClassName(): string {

        return 'OpenCmpUISubscriber';

    }

}

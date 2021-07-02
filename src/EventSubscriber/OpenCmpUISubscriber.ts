import EventSubscriberInterface from '../EventDispatcher/EventSubscriberInterface';
import OpenCmpUIEvent from '../Event/OpenCmpUIEvent';
import CmpPreparatoryService from '../Service/CmpPreparatoryService';

/**
 * OpenCmpUISubscriber.
 */
class OpenCmpUISubscriber implements EventSubscriberInterface {

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
            [OpenCmpUIEvent.name]: 'onOpenCmpUI',
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

}

export default OpenCmpUISubscriber;

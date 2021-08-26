import {EventSubscriberInterface} from '../EventDispatcher';
import {ConsentPersistEvent} from '../Event';
import {TCStringService, ACStringService} from '../Service';

/**
 * ConsentsPersistSubscriber.
 */
export class ConsentsPersistSubscriber implements EventSubscriberInterface {

    private tcStringService: TCStringService;
    private acStringService: ACStringService;

    /**
     * Constructor.
     *
     * @param {TCStringService} tcStringService
     * @param {ACStringService} acStringService
     */
    constructor(tcStringService: TCStringService, acStringService: ACStringService) {

        this.tcStringService = tcStringService;
        this.acStringService = acStringService;

    }

    /**
     * @inheritDoc
     */
    public getSubscribedEvents(): Record<string, string> {

        return {
            [ConsentPersistEvent.EVENT_NAME]: 'onConsentPersist',
        };

    }

    /**
     * When the user has chosen the consents, the data must be saved,
     * this method saves TCString and ACString.
     *
     * @param {ConsentPersistEvent} event
     */
    public onConsentPersist(event: ConsentPersistEvent): void {

        this.tcStringService.persistTCString(event.getTcString());
        this.acStringService.persistACString(event.getAcString());

    }

    static getClassName(): string {

        return 'ConsentsPersistSubscriber';

    }

}

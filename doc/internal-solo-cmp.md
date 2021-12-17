# Internal SoloCmp documentation

1. [Introduction](#introduction)
1. [General Explanation](#general-explanation)
1. [Events flow and purpose](#main-events)
    1. [OpenCmpUIEvent](#open-cmp-ui-event)
    1. [ConsentRequiredEvent](#consent-required-event)
    1. [ApplyConsentEvent](#apply-consent-event)
    1. [AcceptAllEvent](#accept-all-event)
    1. [BeforeBuildStringsEvent](#before-build-strings-event)
    1. [ConsentReadyEvent](#consent-ready-event)
    1. [ConsentPersistedEvent](#consent-persisted-event)
    1. [MoreChoicesEvent](#more-choices-event)

## Introduction

The purpose of this guide is to provide more details about the flow and the purpose of events that
may have arisen from the CMP UI which uses solo-cmp as the basis for the project.

## General Explanation

SoloCmp is mainly based on events.
That is the operations that the end user can carry out through the use of a CMP on the user interface side.
Mainly the use of the SoloCmp library requires the use of 4 events:
- ApplyConsentEvent (If you need to persist the consents choices choosen by the user and mapped inside the SoloCmpDataBundle).
- AcceptAllEvent (If the final user click on "Accept All" button then the SoloCmp library persist consents with all enabled).
- MoreChoicesEvent (If you need an AMP version of the CMP and the final user click on "Customize" button you can dispatch this event to handle some logic of the AMP integration).
- OpenCmpUIEvent (If the final user need to change their preferences previously persisted)
Other events are internal but the developer using the SoloCmp library can implement and add Subscribers and also Services within the SoloCmp instance.
This can be done because the library uses a dependency injection container that can handle one of these,
this gives you the possibility to develop a plugin for the SoloCmp library to integrate some logic into the basic flow.

## Events flow and purpose

### OpenCmpUIEvent

Normally this event dispatched when the SoloCmp.init() method called and, which checks if all consents handled by the library are valid. 
If there are consent strings that are not valid, send OpenCmpUIEvent and remove for security all consents persisted inside the user browser.
This logic allows you to check only the validity of the consensus strings without having to download the vendor list and all the other data 
each time to show all the information to the user.
This allows you to speed up the release time for the services on the publisher's site.

This event can however be dispatched by the UI layer of the CMP for example when the user wants to change the consents
he has previously applied. For example if you need to implement an open CMP button.

Here is the complete flow of when the event dispatched:

![OpenCmpUIEvent diagram](https://github.com/pubtech-ai/solo-cmp/blob/main/doc/sequence-diagrams/img/open-cmp-ui-event-flow.svg?raw=true)

### ConsentRequiredEvent

This event is dispatched when the user's consent is requested, this always happens together with the opening cmp once 
all data has been taken and you can render the user interface of the cmp.
Normally the subscribers present in this library are sufficient, because they cover all the necessary requirements 
for the CmpApi IAB and the AMP integration of the CMP.

Here is the complete flow of when the event dispatched:

![ConsentRequiredEvent diagram](https://github.com/pubtech-ai/solo-cmp/blob/main/doc/sequence-diagrams/img/consent-required-event-flow.svg?raw=true)

### ApplyConsentEvent

This event essentially dispatched by the UI of the CMP implemented as the dto must be inserted in the event 
to transmit the consents that the user has modified and then allow the library to do the manipulation work, 
persist and call any event subscribers that depend on ConsentReadyEvent.

Here is the complete flow of when the event dispatched:

![ApplyConsentEvent diagram](https://github.com/pubtech-ai/solo-cmp/blob/main/doc/sequence-diagrams/img/apply-consent-event-flow.svg?raw=true)


### AcceptAllEvent

This event looks a lot like the ApplyConsentEvent event, but no changes to the choices DTO are required.
The only parameter required is the SoloCmpDataBundle object that is passed during the creation of the
CMP UI (by the UIConstructor).

Essentially a subscriber linked to that event that automatically generates and persists the consents
with all possible choices enabled

Here is the complete flow of when the event dispatched:

![AcceptAllEvent diagram](https://github.com/pubtech-ai/solo-cmp/blob/main/doc/sequence-diagrams/img/accept-all-event-flow.svg?raw=true)

### BeforeBuildStringsEvent

This event is fired just before the IAB's TCString is generated. Currently version 2.0.0 is dispatched to the ConsentsGeneratorService. 
As can also be seen from the AcceptAllEvent and ApplyConsentEvent graphs.
Essentially this event is dispatched to give the user the possibility to customize the TCModel by applying rules 
based on the choices the user has made. 
For example they could create a subscriber to add PublisherRestrictions based on their business logic.

### ConsentReadyEvent

This event is dispatched when the TCString and ACString are created and before these strings will be persisted.
To listen after these strings are persisted use the ConsentPersistedEvent.

### ConsentPersistedEvent

This event is dispatched when the TCString and ACString are saved in the end user's browser. 
This event is useful if you want to collect proof of consent.

### MoreChoicesEvent

This event must be dispatched by the user of this library, to launch the necessary logics for the AMP implementation.
In fact, it must be dispatched when the user opens the configuration panel with the consent choices.
The logics performed are found inside the AmpSubscriber.

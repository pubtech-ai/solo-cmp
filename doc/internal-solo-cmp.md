# Internal SoloCmp documentation

1. [Introduction](#introduction)
1. [Main events flows](#main-events-flows)
    1. [OpenCmpUIEvent flow](#open-cmp-ui-event-flow)
    1. [ConsentRequiredEvent flow](#consent-required-event-flow)
    1. [ApplyConsentEvent flow](#apply-consent-event-flow)
    1. [AcceptAllEvent flow](#accept-all-event-flow)

## Introduction

The purpose of this guide is to provide more details about the flow of events that
may have arisen from the CMP UI which uses solo-cmp as the basis for the project.

Currently, there are explanations of not all flows, soon we will add all the necessary documentation.
Meanwhile, you are starting to see the more "complex" flows.

The hardest part!

## Main events flows

### OpenCmpUIEvent flow

Normally this event dispatched when the SoloCmp.init() method called and, the Orchestrator which checks
if all consents handled by the library are valid. If there are consent strings that are not valid, send OpenCmpUIEvent.

This event can however be dispatched by the UI layer of the CMP for example when the user wants to change the consents
he has previously applied.

Here is the complete flow of when the event dispatched:
<p>
    <img src="doc/sequence-diagrams/img/open-cmp-ui-event-flow.svg" />
</p>

### ConsentRequiredEvent flow

This event dispatched when the consent requested from the user, this always happens together with the opening
 of the cmp once all the data has been taken and it is possible to render the UI of the cmp.

Here is the complete flow of when the event dispatched:
<p>
    <img src="doc/sequence-diagrams/img/consent-required-event-flow.svg" />
</p>

### ApplyConsentEvent flow

This event essentially dispatched by the UI of the CMP implemented as the dto must be inserted in the event 
to transmit the consents that the user has modified and then allow the library to do the manipulation work, 
persist and call any event subscribers that depend on ConsentReadyEvent.

Here is the complete flow of when the event dispatched:
<p>
    <img src="doc/sequence-diagrams/img/apply-consent-event-flow.svg" />
</p>


### AcceptAllEvent flow

This event looks a lot like the ApplyConsentEvent event, but no changes to the choices DTO are required.
The only parameter required is the SoloCmpDataBundle object that is passed during the creation of the
CMP UI (by the UIConstructor).

Essentially a subscriber linked to that event that automatically generates and persists the consents
with all possible choices enabled

Here is the complete flow of when the event dispatched:
<p>
    <img src="doc/sequence-diagrams/img/accept-all-event-flow.svg" />
</p>

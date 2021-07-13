# solo-cmpsa

This library is a wrapper of the [IAB's Transparency and Consent Framework (TCF)](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework) library with the intention of simplifying and adding more ways of customization of the whole flow that starts from the view of the CMP banner at the release of the user's consent. This library is completely framework agnostic, so feel free to implement your CMP with any framework such as Vue, React and others.
So what you have to do is only the graphical implementation and if necessary add plugins to execute logic based on the event flows mapped by the library.

  - [Installation](#installation)
  - [Using](#using)
  - [Contribution](#contribution)

#### Installation

npm
```
npm install @pubtech/solo-cmp --save
```

#### Using

This example demonstrates the basic use case of a CMP UI using our library.
```javascript
/** IAB CMP STUB. */
import cmpstub from '@iabtcf/stub';
cmpstub();

import {
    SoloCmp, 
    UIConstructor,
    OpenCmpUIEvent,                               
    EventDispatcher,
    TCStringService,
    ACStringService
} from "@pubtech/solo-cmp";

import DependencyInjectionManager from "@pubtech/solo-cmp/lib/DependencyInjection/DependencyInjectionManager";

const uiConstructor = new UIConstructor(document, 'your-cmp-html-element-id-container', (rootElement, soloCmpDataBundle) => {
    
    //Call render CMP UI and provide it the SoloCmpDataBundle that contains a UIChoicesBridgeDto with the status
    //of consents applied by the user, of course if is the first time all is disabled by default.

}, (rootElement) => {
    //Call render OPEN CMP UI BUTTON you should render a button that dispatch
    const eventDispatcher = DependencyInjectionManager.getService(EventDispatcher.getClassName());
    const tcStringService = DependencyInjectionManager.getService(TCStringService.getClassName());
    const acStringService = DependencyInjectionManager.getService(ACStringService.getClassName());

    //At the click of the button then dispatch this event!
    eventDispatcher.dispatch(new OpenCmpUIEvent(
        tcStringService.retrieveTCString(),
        acStringService.retrieveACString()
    ));

});

const cmpVersion = 1;
/**
This parameter is used for an optimization of the CMP itself since if a consent is present in the user's browser, 
it is checked if the version managed by your cmp is the same, otherwise if it is different, 
the library will automatically launch requests to download the vendor-list and the google-vendor-list and then start the cmp UI again
**/
const cmpVendorListVersion = 79;
const cmpId = 100000; //Here you should use your cmpId provided by IAB.

const soloCmp = new SoloCmp(
    uiConstructor,
    true, //Debug flag that enable and disable the debug method of LoggerService, this feature should help you to debug some 'bugs'.
    {//Store that object inside the CmpConfigurationProvider service that can be used by your plugin.
        isAmp: true, //This feature is experimental it will dispatch some specific events to implement the AMP version of your CMP.
        onConsentAds: () => {
            //Execute some logic when the consents are already present or the user has given his consent.
        },
        debug: true 
    },
    ['it', 'en'], //Here you can specify all the languages that your CMP supports and consequently the case in which a certain language is not supported will be automatically handled and there will be a fallback to 'en'
    cmpVersion,
    cmpVendorListVersion,
    'euconsent-v2', //Cookie name used to save TCString in browser
    'ac_euconsent-v2', //Key name used to save ACString in browser (local storage)
    cmpId,
    true, //isServiceSpecific flag this should be used to configure exactly the library of IAB.
    "https://cdn.pubtech.ai/vendorList", //The url where vendorlist.json if fetched and also for google-vendor-list.json (used to create an ACString).
    '30vh', //Amp configuration this configure the initial height of the CMP running in an AMP environment.
    false //Amp configuration this configure the border of the CMP running in an AMP environment.
);

//This starts the library, now you should only worry about implementing the UI of the CMP you want to make! See below!
soloCmp.init();

```
After this first initialization what needs to be done is to render all the choices available within the 
UIChoicesBridgeDto object exposed by the SoloCmpDataBundle which is injected by the first callback provided during the creation of the UIConstructor.

```javascript
const uiChoicesBridgeDto = soloCmpDataBundle.uiChoicesBridgeDto; //This contains all the possible choices the user can make.

//All of these are arrays containing the user's possible choices, each choice has a 'state' attribute. Your UI must change the state based on what the user chooses.
const uiPurposes = uiChoicesBridgeDto.UIPurposeChoices;
const uiVendors = uiChoicesBridgeDto.UIVendorChoices;
const uiLegIntPurposes = uiChoicesBridgeDto.UILegitimateInterestsPurposeChoices;
const uiLegIntVendors = uiChoicesBridgeDto.UILegitimateInterestsVendorChoices;
const uiGoogleVendors = uiChoicesBridgeDto.UIGoogleVendorOptions;

//After you have correctly configured the uiChoicesBridgeDto object you can dispatch the events.
//Mainly the events that your UI will need to dispatch will be:
import {
    AcceptAllEvent,
    ApplyConsentEvent,
    EventDispatcher,
    MoreChoicesEvent,
} from "@pubtech/solo-cmp-try";


/** MoreChoicesEvent
Before dispatching 'ApplyConsentEvent', make sure you dispatch the event 'MoreChoicesEvent'
This is necessary to indicate to the library that the consent customization panel has been 
opened so that the various subscribers can perform the appropriate logics.
**/
EventDispatcher.getInstance().dispatch(new MoreChoicesEvent());

/** ApplyConsentEvent **/
EventDispatcher
    .getInstance()
    .dispatch(
        new ApplyConsentEvent(
            soloCmpDataBundle.uiChoicesBridgeDto,
            soloCmpDataBundle
        )
    );

/** AcceptAllEvent
In this case, when the user clicks accept everything, it is not necessary to dispatch the event 'MoreChoicesEvent'
**/
EventDispatcher
    .getInstance()
    .dispatch(
        new AcceptAllEvent(
            soloCmpDataBundle
        )
    );

```

That's all, create your CMP, show consents and give the user the ability to choose which things to enable and disable and dispatch the above events.
Note: Closing the CMP UI is your responsibility, so once the user has done something to dispatch ApplyConsentEvent or AcceptAllEvent, don't show the CMP, or destroy it.

#### Contribution

In order to contribute to the improvement of the project, below you will find the project development flow.
Before being able to open a PR with changes to be applied or bug fixes to be solved, it is necessary to open an issue 
and explain the reason and a possible solution. You can open each PR by forking the project and creating the PR directly from 
your project to the project of our library.

Main rules:
- Open issue
- Create PR from forked project
- Link your PR to the issue

## Development Flow

All development work occurs on the `develop` branch.
The `main` branch is used to create new releases by merging current head of the `develop` branch.
You should create a feature-branch, branching from `develop`, whenever you need to add some changes to the `main` branch.
If those changes are accepted they will be merged by the repository maintainer.

## Dependencies

This application is based on:
- Node.js:14.15.4
- IAB TCF Modules
- BottleJs

## Development environment

To ease local development you have to install these tools:

* [Node.js](https://nodejs.org/)

### Install dependencies

To install dependencies, execute these commands:
```sh
npm install
```

When the process is complete, a Browser tab is automatically opened.

### Compile and minify for production

To create a production version, execute this command:
```sh
npm run build
```

### Test project

To run tests, execute this command:
```sh
npm run test
```

### Lint project

To lint the project files, execute this command:
```sh
npm run lint
```

### Disclaimer
This SOFTWARE PRODUCT is provided by THE PROVIDER "as is" and "with all faults." THE PROVIDER makes no representations 
or warranties of any kind concerning the safety, suitability, lack of viruses, inaccuracies, typographical errors, or 
other harmful components of this SOFTWARE PRODUCT. There are inherent dangers in the use of any software, and you are 
solely responsible for determining whether this SOFTWARE PRODUCT is compatible with your equipment, gdpr compliance and 
other software installed on your equipment. You are also solely responsible for the protection of your equipment and 
backup of your data, and THE PROVIDER will not be liable for any damages you may suffer in connection with using, 
modifying, or distributing this SOFTWARE PRODUCT.

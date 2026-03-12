# Label Printing

> Note, the information here is written with the Test and Tag application in mind, as at the time of writing it is the only app using this component.

## Introduction

The Label Printer suite of components and hooks allow a website to print directly to a connected printer. There are some important configuration steps that must be followed in order for the complete print functionality to operate correctly, both when the website is running locally (localhost) and has been published.

### Configuration

#### Local testing

In order to leverage the features of the Label Printing component locally via localhost, you must have a 3rd party application running on your system.

> Note: you do not need a physical printer to test or use the Label Printing components under localhost

1. Clone the "ZplEscPrinter" repo [from GitHub](https://github.com/erikn69/ZplEscPrinter)
1. Build the project to an App that you can easily run later
1. Start the app and configure the settings as so:

* Print density: 8dpmm (203dpi)
* Unit size: millimeters (mm)
* Label width: 100mm
* Label height: 50mm
* Host: 127.0.0.1
* Port: 9102
* Buffer size: 1024
* TCP socket kept alive

 Ensure ZPL and ON are selected on the main screen. Leave the app running in the background.

 When you send ZPL to the Emulator, the App will show the label on screen and you may optionally save to a local image file.

#### Remote testing

 In order to test label printing functionality within your website once it has been deployed to a server, you will need another 3rd party application on your system.

 > Note: the following information assumes you are using a Zebra label printer. Different printers will require different testing approaches.
 >
 > You do not need both the local and remote applications running at the same time. Choose the one appropriate to your situation.

 1. Download and install the [Browser Print](https://www.zebra.com/ap/en/support-downloads/software/printer-software/browser-print.html) app from the Zebra website.

 1. Run the app. It will place a small icon in the system tray. 

> The next steps are optional, but serve as a useful communication test between the app and your printer, and will be required if you intend to use the Label Printer code with a "default" printer.

 1. Click the tray icon and select "Settings".
 1. Ensure you have connected your label printer to your computer and it is turned on
 1. From the Browser Print Settings window, ensure both "Broadcast Search" and "Driver Search" checkboxes are checked.
 1. Click the Default Devices "Change" button. Allow the app some time to scan for printers.
 1. Accept any prompt requesting access to the local network.
 1. All detected printers will be shown on screen. Select the printer you wish to use and click "Set".
 1. You should now see the chosen printer in the Default Devices window of the main App UI.

If your website is hosted under the HTTPS protocol, you will also need to accept a 3rd party certificate that will allow secure communication between website and the Browser Print app (which must be running):

1. Open you web browser and navigate to https://localhost:9101/ssl_support
1. An "Unsafe address" page should appear, the wording of which will differ between browsers. The next steps will depend on the browser you are using:
    1. Safari on MacOs, click the "View Certificate" link and from the resulting Certificate popup, drag the image of the certificate from the popup to a location on your hard drive. This will save the certificate to a BrowserPrint.cer file.
        1. Open Key Chain on your Mac, and drag the exported BrowserPrint.cer file in to the "login" group within Key Chain.
        1. Locate the new certificate within Key Chain that you just created, double click, and from the resulting popup, expand the "Trust" group and select "Always Trust" from the "When using this certificate" select box.
        1. Quit Key Chain, go back to your browser, and reload the https://localhost:9101/ssl_support page. You should now see a message on screen "SSL Certificate Has been accepted. Retry connection.".
    1. For Chrome, Firefox, Edge etc, you may be able to "view the certificate" from the "Unsafe address" page, and from the popup, set the trust level to "Always trust", close the popup, then click the "Visit website" link. If this doesn't work for you, try a process similar to the one for Safari.

### Code usage

Label Printing is separated in to three main areas:
- printers
- hooks
- UI elements

#### Printers

For the MVP first version of this component, it was not expected that there would be a significant number of different printer makes and models in use, and therefore only the most common printer & models have been defined within this component: Zebra.

Printers, in the coding sense, are defined as functions. Each printer must return an expected set of properties and functions in order to be useable to the calling code base. See the definition of printers/ZebraClass for more information. They are enumerated in to a collection of known printers called a "printer registry", which also defines which method exported from the printer class to instantiate. 

For Zebra printers, a 3rd party wrapper package [zebra-browser-print-wrapper-https](https://github.com/PavelKaraivanov/zebra-browser-print-wrapper-https) has been used to simplify communication to an underlying series of printer protocols.

> Note: the use of `zebra-browser-print-wrapper-https` is to enable communication between a website running under https, as in this scenario all communications to the Browser Print app will also be made over https.
If your site is not running under https, you may need to use an alternative package [zebra-browser-print-wrapper-https](https://github.com/lhilario/zebra-browser-print-wrapper), which will require some changes to this component.

 While this wrapper returns functions after instantiation, the Printer Registry has been designed to also allow hook-based 3rd party libraries to be used. At the time of writing, this custom hook has been declared as "useCreatePrinter" and defined within each printer class, but the printer functionality could also be used directly without this hook if desired.

In addition to Zebra, a bare-bones "Emulator" printer class has also been included. This exists purely for localhost testing, and requires the ZPLEscPrinter app to be running to act as a physical printer. See above for more information on ZplEscPrinter. The Emulator class will automatically be used by the useLabelPrinter hook, if the appropriate flag is set and the current environment is determined to be local.

#### Templates

This component makes no assumptions over which printer language is to be used, but for this MVP implementation, all templates are written in ZPL commands with variances included for different model requirements.

> Note: it is up to you to define the expected printer model names and the templates each should use. These are not provided by this component, however you may wish to refer to the Test and Tag code for an example implementation.

When a printer has been selected and is ready to print, use a print "template" to define your label output. Export this template, and any others, as a collection "store", keyed on the name of the printer or model as it will be detected by the Browser Printer app.

> Note: the actual names of detected printers, even the physically same printers, can differ across operating systems. Ensure you account for these variations when creating your own templates. Include an "emulator" template if you'll be testing it locally.

A template defines variable placeholders using the string format `{{PLACEHOLDER}}` (must be upper-case). It is important to remember that the name of the placeholders you use *must* match a key for the value it will be replaced with, or it will not be replaced at all. For example, when passing in data to transform a template to the `getLabelPrinterTemplate` method of the `useLabelPrinterTemplate` hook:

Template:

```javascript
export default `some zpl code here {{UQLID}}`
```

The data object supplied should include a matching placeholder key:
```json
{
    uqlid: 'okay' // data object key does not need to be uppercase
}
```

otherwise the {{UQLID}} key will remain verbatim.

##### Template Store

The template store only needs to be an object with keys that match the expected printer names, with each key value containing the actual template content.
Where you may have multiple templates, it is advised to export each template in a separate file, then export all templates as a single "store" object, for example:

```Javascript
export { default as emulator } from './emulator';
export { default as gk420t } from './gk420t';
export { default as _29j120602579 } from './gk420t';
export { default as gk888t } from './gk888t';
export { default as _19j153101586 } from './gk888t';
```

This approach neatly defines where template code is located, as well as providing an importable object encapsulating all tempaltes as key/value pairs when imported as:

```Javascript
import * as labelPrintertemplates from './labelPrinterTemplates';
```

> Important: do note that any printer name starting with a numerical character should be prepended in the template store with an underscore. The code will account for this when matching with available printers.

### Hooks

Two hooks are provided by this component. Their intended usage is as follows:

1. `useLabelPrinter`: The core custom hook for utilising label printing. Use this hook to instantiate the relevant printer library you're using, set the template store, and set flags that control if printers with no names are removed, or those that do not have a defined template are disabled, in the returned availablePrinters object.

    Example usage:

    ```javascript
    const { printer, availablePrinters } = useLabelPrinter({
        printerCode: 'zebra',
        templateStore: myTemplateStore,
        shouldOverridePrinterDevEnv: true, // will force use of Emulator printer in localhost envs
    });
    ```

1. `useLabelPrinterTemplate`: handles the transformation of a template using provided data, and provides a function to determine if a given printer name has a template available.

    Example usage:

    ```javascript
    const { getLabelPrinterTemplate } = useLabelPrinterTemplate(labelPrintertemplates);
    // etc
    const template = getLabelPrinterTemplate('emulator', {
        userId: '1234',
        assetId: 'UQABC123',
        // etc.
    });
    ```

### UI Components

1. `LabelPrinterSelector`: a basic UI component that wraps an AutoComplete. Use to allow the user to select a printer from a provided list:

```html
<LabelPrinterSelector
    id={'mySelector'}
    list={[{
        name: 'Emulator',
        deviceType: 'printer',
        connection: 'network',
        uid: '127.0.0.1',
        provider: 'com.zebra.ds.webdriver.desktop.provider.DefaultDeviceProvider',
        manufacturer: 'Zebra Technologies',
        version: 0,
    },{
        name: 'GK888t',
        deviceType: 'printer',
        connection: 'network',
        uid: '192.168.0.20',
        provider: 'com.zebra.ds.webdriver.desktop.provider.DefaultDeviceProvider',
        manufacturer: 'Zebra Technologies',
        version: 0,
    }]}
    value={{
        name: 'Emulator',
        deviceType: 'printer',
        connection: 'network',
        uid: '127.0.0.1',
        provider: 'com.zebra.ds.webdriver.desktop.provider.DefaultDeviceProvider',
        manufacturer: 'Zebra Technologies',
        version: 0,
    }}
    onChange={_onPrinterSelectionChange}
    disableUnknownPrinters={true}
    locale={locale}
    error={true}
/>
```
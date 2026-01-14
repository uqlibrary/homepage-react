// Tested working settings:
// Print density: 8dpmm (203dpi)
// Label width: 100mm
// Label height: 50mm
// Host: 127.0.0.1
// Port: 9101
// Buffer size: 1024 and TCP socket kept alive

const printerAddress = 'http://127.0.0.1:9101';

const printerDescriptor = {
    name: 'Emulator',
    deviceType: 'printer',
    connection: 'network',
    uid: '127.0.0.1',
    provider: 'com.zebra.ds.webdriver.desktop.provider.DefaultDeviceProvider',
    manufacturer: 'Zebra Technologies',
    version: 0,
};

/**
 * An Emulated label printer class to use during localhost testing.
 * Requires a locally running ZPL Printer emulator
 * built from https://github.com/erikn69/ZplEscPrinter
 *
 * @returns object with the shape:
 * {
 *  code: string - the printer being used e.g. 'zebra',
 *  getAvailablePrinters: Function, returns array of available printers
 *  getConnectionStatus: Function, returns object with shape { ready: boolean, error: boolean, errors: array }
 *  setPrinter: Function, sets the selected printer
 *  print: Function, sends data to the printer
 * }
 *
 */
export const createPrinter = () => {
    const code = 'emulator';

    const getAvailablePrinters = async () => {
        return await [printerDescriptor, { ...printerDescriptor, name: 'Unregistered Printer' }];
    };

    const getConnectionStatus = async () => {
        return await {
            ready: true,
            error: false,
            errors: [],
        };
    };

    const setPrinter = async selectedPrinter => {
        return await selectedPrinter;
    };

    const print = async data => {
        await fetch(printerAddress, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/zpl',
            },
            body: data,
        }).then(response => {
            return response;
        });
    };

    return {
        code,
        getAvailablePrinters,
        getConnectionStatus,
        setPrinter,
        print,
    };
};

export const useCreatePrinter = () => {
    // const printerInstanceRef = useRef(null);
    // Custom hook that can be leveraged in the
    // future, for any printers that provide
    // a Hook based API
    // if (printerInstanceRef.current) return printerInstanceRef.current;

    const instance = createPrinter();
    // printerInstanceRef.current = instance;
    return instance;
};
export default useCreatePrinter;

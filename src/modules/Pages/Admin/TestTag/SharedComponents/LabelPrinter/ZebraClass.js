import ZebraBrowserPrintWrapper from 'zebra-browser-print-wrapper';

/**
 * An Zebra label printer class to use during localhost testing.
 * Requires a locally running ZPL Printer emulator
 * built from https://github.com/erikn69/ZplEscPrinter
 *
 * @returns object with the shape:
 * {
 *  code: string - the printer being used e.g. 'zebra',
 *  getAvailablePrinters: Function, returns array of available printers
 *  getDefaultPrinter: Function, returns the default printer object
 *  getConnectionStatus: Function, returns object with shape { ready: boolean, error: boolean, errors: array }
 *  selectDefaultPrinter: Function, selects and sets the default printer, returns the default printer object
 *  setPrinter: Function, sets the selected printer
 *  print: Function, sends data to the printer
 *  debug: Function, returns printer descriptor for debugging
 * }
 *
 */

export const createPrinter = () => {
    const code = 'zebra';
    const printer = new ZebraBrowserPrintWrapper();

    const getAvailablePrinters = async () => {
        return await printer.getAvailablePrinters();
    };

    const getDefaultPrinter = async () => {
        return await printer.getDefaultPrinter();
    };

    const getConnectionStatus = async () => {
        const status = await printer.checkPrinterStatus();
        return {
            ready: status.isReadyToPrint || false,
            error: status.isError || false,
            errors: status.errors,
        };
    };

    const setPrinter = async selectedPrinter => {
        await printer.setPrinter(selectedPrinter);
    };

    const selectDefaultPrinter = async () => {
        const defaultPrinter = await getDefaultPrinter();
        if (defaultPrinter) {
            await setPrinter(defaultPrinter);
            return defaultPrinter;
        }
        throw new Error('No default printer found');
    };

    const print = async data => {
        console.log('Sending print data to printer...');
        await printer.print(data);
    };

    const debug = () => {
        return printer;
    };

    return {
        code,
        getAvailablePrinters,
        getDefaultPrinter,
        getConnectionStatus,
        selectDefaultPrinter,
        setPrinter,
        print,
        debug,
    };
};

/**
 * A Hook wrapper around the ZebraClass printer functional class
 * that could be leveraged in the future, for any printers that provide
 * a Hook based API.
 * @returns the same shape as createPrinter.
 */

export const useCreatePrinter = () => {
    const instance = createPrinter();
    return instance;
};
export default useCreatePrinter;

import ZebraBrowserPrintWrapper from 'zebra-browser-print-wrapper';

/**
 * A Zebra label printer class to use with Zebra Browser Print wrapper.
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

    const print = async data => {
        console.log('Sending print data to printer...');
        await printer.print(data);
    };

    return {
        code,
        getAvailablePrinters,
        getConnectionStatus,
        getDefaultPrinter,
        setPrinter,
        print,
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

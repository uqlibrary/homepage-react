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
        try {
            return await printer.getAvailablePrinters();
        } catch (error) {
            console.warn('Zebra Browser Print not available:', error.message);
            return [];
        }
    };

    const getDefaultPrinter = async () => {
        try {
            return await printer.getDefaultPrinter();
        } catch (error) {
            console.warn('Zebra Browser Print not available:', error.message);
            return null;
        }
    };

    const getConnectionStatus = async () => {
        try {
            const status = await printer.checkPrinterStatus();
            return {
                ready: status.isReadyToPrint || false,
                error: status.isError || false,
                errors: status.errors,
            };
        } catch (error) {
            console.warn('Zebra Browser Print not available:', error.message);
            return {
                ready: false,
                error: true,
                errors: ['Zebra Browser Print application is not running'],
            };
        }
    };

    const setPrinter = async selectedPrinter => {
        try {
            await printer.setPrinter(selectedPrinter);
        } catch (error) {
            console.warn('Failed to set printer:', error.message);
        }
    };

    const print = async data => {
        try {
            console.log('Sending print data to printer...');
            await printer.print(data);
        } catch (error) {
            console.error('Failed to print:', error.message);
            throw new Error('Unable to print. Please ensure Zebra Browser Print is running.');
        }
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

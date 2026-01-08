import { useRef, useEffect } from 'react';
import ZebraBrowserPrintWrapper from 'zebra-browser-print-wrapper';

const code = 'zpl';
/** *
 * Custom hook to interact with Zebra Browser Print Wrapper (ZPL)
 * Provides methods to get available printers, check connection status, and set the printer.
 * @returns {object} - An object containing
 * printerRef, getAvailablePrinters, getConnectionStatus, and setPrinter methods.
 */
const ZplWrapper = async () => {
    // Hook logic specific to ZPL printer
    const printerRef = useRef(null);
    useEffect(() => {
        printerRef.current = new ZebraBrowserPrintWrapper();
    }, []);

    const getAvailablePrinters = async () => {
        return await printerRef.current.getAvailablePrinters();
    };

    const getConnectionStatus = async () => {
        const status = await printerRef.current.checkPrinterStatus();
        return { ready: status.isReadyToPrint || false, error: status.isError || false, errors: status.errors || [] };
    };

    const setPrinter = async printer => {
        await printerRef.current.setPrinter(printer);
    };

    const print = async data => {
        await printerRef.current.print(data);
    };

    return {
        printerRef: printerRef.current,
        code,
        getAvailablePrinters,
        getConnectionStatus,
        setPrinter,
        print,
    };
};

export default ZplWrapper;

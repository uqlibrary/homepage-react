import { useEffect, useState, useMemo } from 'react';

import printerRegistry from '../printers';

import { isLocal, isTest } from 'helpers/general';

export const removeNoNamePrinters = async (printersList = [], shouldRemoveNoNamePrinters) => {
    if (!shouldRemoveNoNamePrinters) return printersList;
    return printersList.filter(printer => !!printer?.name);
};

export const getAvailablePrinters = async printerInstance => {
    return (await printerInstance?.getAvailablePrinters()) || [];
};

/**
 * A Hook to manage label printer selection and preferences.
 *
 * @param {string} printerCode - The code of the printer to use (e.g., 'zebra', 'emulator'). Default 'zebra'.
 * @param {boolean} shouldRemoveNoNamePrinters - Flag to remove printers without a name. Default true.
 * @param {boolean} shouldOverridePrinterDevEnv - Flag to force use of Emulator printer in
 * development environment. Default false.
 *
 * @returns {object} An object containing:
 *  - printerCode: The code of the selected printer.
 *  - printer: The printer instance.
 *  - availablePrinters: Array of available printers after applying filters.
 */
const useLabelPrinter = ({
    printerCode = 'zebra',
    shouldRemoveNoNamePrinters = true,
    shouldOverridePrinterDevEnv = false,
}) => {
    const [availablePrinters, setAvailablePrinters] = useState([]);

    const printerInstance = useMemo(() => {
        const isLocalEnvironment = isLocal();
        const isTestEnvironment = isTest();
        const shouldUsePrinterEmulator = shouldOverridePrinterDevEnv && (isLocalEnvironment || isTestEnvironment);

        return !shouldUsePrinterEmulator ? printerRegistry[printerCode]?.() : printerRegistry.emulator?.();
    }, [printerCode, shouldOverridePrinterDevEnv]);

    useEffect(() => {
        getAvailablePrinters(printerInstance)
            .then(printers => {
                if (!Array.isArray(printers)) return Promise.reject('Printer list is not an array');
                return removeNoNamePrinters(printers, shouldRemoveNoNamePrinters);
            })
            .then(setAvailablePrinters)
            .catch(error => {
                console.error('Error fetching available printers:', error);
                setAvailablePrinters([]);
            });
    }, [printerInstance, shouldRemoveNoNamePrinters]);

    return {
        printerCode,
        printer: printerInstance,
        availablePrinters,
    };
};

export default useLabelPrinter;

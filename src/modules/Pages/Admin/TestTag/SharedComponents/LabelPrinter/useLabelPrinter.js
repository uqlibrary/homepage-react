import { useEffect, useState, useMemo, useCallback } from 'react';
import { useCookies } from 'react-cookie';

import { printerRegistry } from './LabelPrinterRegister';
import labelPrinterTemplate from './LabelPrinterTemplate';

export const COOKIE_PRINTER_PREFERENCE = 'TNT_LABEL_PRINTER_PREFERENCE';

export const isKnownPrinter = (printerName = '') => {
    return Object.keys(labelPrinterTemplate).includes(printerName);
};

export const disabledUnknownPrinters = async (printersList = [], shouldDisableUnknownPrinters) => {
    if (!shouldDisableUnknownPrinters) return printersList;
    return printersList.map(printer => ({
        ...printer,
        noconfig: !isKnownPrinter(printer.name),
    }));
};

export const removeNoNamePrinters = async (printersList = [], shouldRemoveNoNamePrinters) => {
    if (!shouldRemoveNoNamePrinters) return printersList;
    return printersList.filter(printer => !!printer?.name);
};

const getAvailablePrinters = async printerInstance => {
    return (await printerInstance?.getAvailablePrinters()) || [];
};

/**
 * A Hook to manage label printer selection and preferences.
 *
 * @param {string} printerCode - The code of the printer to use (e.g., 'zebra', 'emulator'). Default 'zebra'.
 * @param {boolean} shouldRemoveNoNamePrinters - Flag to remove printers without a name. Default true.
 * @param {boolean} shouldDisableUnknownPrinters - Flag to disable printers that are not
 * configured in the registry. Default true.
 *
 * @returns {object} An object containing:
 *  - printerCode: The code of the selected printer.
 *  - printer: The printer instance.
 *  - printerPreference: The user's preferred printer code from cookies, or null.
 *  - setPrinterPreference: Function to set the user's preferred printer code in cookies.
 *  - availablePrinters: Array of available printers after applying filters.
 */
const useLabelPrinter = ({
    printerCode = 'zebra',
    shouldRemoveNoNamePrinters = true,
    shouldDisableUnknownPrinters = true,
}) => {
    const [availablePrinters, setAvailablePrinters] = useState([]);
    const [cookies, setCookie] = useCookies([COOKIE_PRINTER_PREFERENCE]);
    const setPrinterPreference = useCallback(
        code => {
            setCookie(COOKIE_PRINTER_PREFERENCE, code, { path: '/' });
        },
        [setCookie],
    );

    const printerPreference = useMemo(() => {
        return cookies[COOKIE_PRINTER_PREFERENCE] || null;
    }, [cookies]);

    const printerInstance = useMemo(() => {
        return printerRegistry[printerCode]?.();
    }, [printerCode]);

    useEffect(() => {
        getAvailablePrinters(printerInstance)
            .then(printers => removeNoNamePrinters(printers, shouldRemoveNoNamePrinters))
            .then(printers => disabledUnknownPrinters(printers, shouldDisableUnknownPrinters))
            .then(setAvailablePrinters);
    }, [printerInstance, shouldDisableUnknownPrinters, shouldRemoveNoNamePrinters]);

    return {
        printerCode,
        printer: printerInstance,
        printerPreference,
        setPrinterPreference,
        availablePrinters,
    };
};

export default useLabelPrinter;

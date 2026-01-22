import { useEffect, useState, useMemo, useCallback } from 'react';

import { printerRegistry } from '../LabelPrinterRegister';
import useLabelPrinterTemplate from './useLabelPrinterTemplate';

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
 * @param {boolean} shouldDisableUnknownPrinters - Flag to disable printers that are not
 * configured in the registry. Default true.
 *
 * @returns {object} An object containing:
 *  - printerCode: The code of the selected printer.
 *  - printer: The printer instance.
 *  - availablePrinters: Array of available printers after applying filters.
 */
const useLabelPrinter = ({
    printerCode = 'zebra',
    templateStore = {},
    shouldRemoveNoNamePrinters = true,
    shouldDisableUnknownPrinters = true,
}) => {
    const [availablePrinters, setAvailablePrinters] = useState([]);
    const { hasLabelPrinterTemplate } = useLabelPrinterTemplate(templateStore);

    const disabledUnknownPrinters = useCallback(
        (printersList = [], shouldDisableUnknownPrinters) => {
            if (!shouldDisableUnknownPrinters) return printersList;
            return printersList.map(printer => ({
                ...printer,
                noconfig: !hasLabelPrinterTemplate(printer.name),
            }));
        },
        [hasLabelPrinterTemplate],
    );
    const printerInstance = useMemo(() => {
        return printerRegistry[printerCode]?.();
    }, [printerCode]);

    useEffect(() => {
        getAvailablePrinters(printerInstance)
            .then(printers => removeNoNamePrinters(printers, shouldRemoveNoNamePrinters))
            .then(printers => disabledUnknownPrinters(printers, shouldDisableUnknownPrinters))
            .then(setAvailablePrinters);
    }, [disabledUnknownPrinters, printerInstance, shouldDisableUnknownPrinters, shouldRemoveNoNamePrinters]);

    return {
        printerCode,
        printer: printerInstance,
        availablePrinters,
    };
};

export default useLabelPrinter;

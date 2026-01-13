import { useEffect, useState, useMemo, useCallback } from 'react';
import { useCookies } from 'react-cookie';

import { printerRegistry } from './LabelPrinterRegister';
import labelPrinterTemplate from './LabelPrinterTemplate';
export const COOKIE_PRINTER_PREFERENCE = 'tnt_label_printer_preference';

const useLabelPrinter = ({ printerCode = 'zebra', shouldDisableUnknownPrinters = true }) => {
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
        const getAvailablePrinters = async () => {
            const allPrinterList = (await printerInstance?.getAvailablePrinters()) || null;
            if (!allPrinterList) return [];
            if (shouldDisableUnknownPrinters) {
                allPrinterList.forEach(
                    printer => (printer.noconfig = !Object.keys(labelPrinterTemplate).includes(printer.name)),
                );
            }
            return allPrinterList;
        };
        getAvailablePrinters().then(setAvailablePrinters);
    }, [printerInstance, shouldDisableUnknownPrinters]);

    return {
        printerCode,
        printer: printerInstance,
        printerPreference,
        setPrinterPreference,
        availablePrinters,
    };
};

export default useLabelPrinter;

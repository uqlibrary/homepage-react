import { useMemo, useCallback } from 'react';
import { useCookies } from 'react-cookie';

export const extractCorePrinterName = printerName => {
    // We assume the printer name is at the start of the full printer string
    // followed by a whitespace. This will have to be revisited if it changes in the future.
    const parts = printerName.split(' ');
    return parts[0];
};

export const printerToCookieString = printerName => {
    const printerNameShort = extractCorePrinterName(printerName);
    return JSON.stringify({ name: printerName, shortName: printerNameShort });
};

export const parsePrinterFromCookieString = cookieValue => {
    try {
        if (typeof cookieValue !== 'string') return cookieValue;
        const parsed = JSON.parse(cookieValue);
        return parsed || null;
    } catch (e) {
        return null;
    }
};

const useLabelPrinterPreference = cookieName => {
    const [cookies, setCookie] = useCookies([cookieName]);
    const setPrinterPreference = useCallback(
        printerName => {
            const encodedPrinter = printerToCookieString(printerName);
            setCookie(cookieName, encodedPrinter, { path: '/' });
        },
        [cookieName, setCookie],
    );
    const printerPreference = useMemo(() => {
        const parsed = parsePrinterFromCookieString(cookies[cookieName]);
        return parsed;
    }, [cookieName, cookies]);

    return [printerPreference, setPrinterPreference];
};

export default useLabelPrinterPreference;

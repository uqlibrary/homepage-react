import { useMemo } from 'react';

import { printerRegistry } from './LabelPrinterConfig';

const useLabelPrinter = ({ printerCode = 'zebra' }) => {
    const printerInstance = useMemo(() => {
        return printerRegistry[printerCode]?.();
    }, [printerCode]);
    return {
        printerCode,
        printer: printerInstance,
    };
};

export default useLabelPrinter;

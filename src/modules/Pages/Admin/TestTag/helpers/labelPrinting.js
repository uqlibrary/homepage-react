import { LABEL_PRINTING } from '../config/labelPrinting';

export const getDeptLabelPrintingEnabled = userDept => {
    if (!LABEL_PRINTING.enabled) return false;
    return LABEL_PRINTING[userDept]?.enabled ?? false;
};

export const getDefaultDeptPrinter = userDept => {
    if (!LABEL_PRINTING.enabled) return null;
    return LABEL_PRINTING[userDept]?.defaultPrinter || null;
};

export const hasPrinterError = (printerPreference, availablePrinters = []) => {
    return (
        !!!printerPreference ||
        availablePrinters?.length === 0 ||
        availablePrinters?.every(printer => !!!printer?.name) ||
        availablePrinters?.findIndex(printer => printer?.name === printerPreference?.name) === -1
    );
};

export const hasTemplateError = printerPreference => {
    const pref = !!!printerPreference ? {} : printerPreference;
    return !Object.hasOwn(pref, 'templateId') || !!!pref.templateId;
};

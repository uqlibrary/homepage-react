import { LABEL_PRINTING } from '../config/labelPrinting';

export const getDeptLabelPrintingEnabled = userDept => {
    if (!LABEL_PRINTING.enabled) return false;
    return LABEL_PRINTING[userDept]?.enabled ?? false;
};

export const getDefaultDeptPrinter = userDept => {
    if (!LABEL_PRINTING.enabled) return null;
    return LABEL_PRINTING[userDept]?.defaultPrinter || null;
};

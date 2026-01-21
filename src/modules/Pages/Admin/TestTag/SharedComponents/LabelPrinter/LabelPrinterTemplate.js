import * as templates from './templates';

export const normaliseExportKey = key => key.toUpperCase();
export const normalisePrinterNameKey = key => key.toLowerCase();

export const formatTemplateString = (template, data) => {
    let formattedTemplate = template;
    Object.keys(data).forEach(key => {
        const normalKey = normaliseExportKey(key);
        const regex = new RegExp(`{{${normalKey}}}`, 'g');
        formattedTemplate = formattedTemplate.replace(regex, data[key]);
    });
    return formattedTemplate;
};

export const hasTemplate = key => {
    const normalisedKey = normalisePrinterNameKey(key);
    return Object.keys(templates).includes(normalisedKey);
};

/**
 * Returns a formatted string that can be sent directly to a label printer.
 * If the printerKey is not found, returns null.
 * @param {*} printerKey Printer model to use e.g. 'emulator', 'gk420t', 'gk888t'
 * @param {*} data An object containing values to substitute in the printer template. Keys MUST
 * match the placeholders in the template (case-insensitive). e.g.
 * {
 *  logo,
 *  userId,
 *  assetId,
 *  testDate,
 *  dueDate
 * }
 * @returns object with shape { name: string, formattedTemplate: string },
 * where 'formattedTemplate' is the formatted printer template for the specified printerKey, or null if not found
 */
const getTemplate = (printerKey, data) => {
    const normalisedKey = normalisePrinterNameKey(printerKey);
    const printerTemplate = templates?.[normalisedKey];
    if (printerTemplate) {
        const formattedTemplate = formatTemplateString(printerTemplate, data);
        return { name: printerKey, formattedTemplate: formattedTemplate };
    }
    return null;
};

export default getTemplate;

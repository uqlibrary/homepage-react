import { useCallback } from 'react';

import { normalisePlaceholderKey } from './utils/helpers';

export const formatTemplateString = (template, data) => {
    let formattedTemplate = template;
    Object.keys(data).forEach(key => {
        const normalKey = normalisePlaceholderKey(key);
        const regex = new RegExp(`\\{\\*${normalKey}\\*\\}`, 'g');
        formattedTemplate = formattedTemplate.replace(regex, data[key]);
    });
    return formattedTemplate;
};

export const useLabelPrinterTemplate = templateStore => {
    const getLabelPrinterFormattedTemplate = useCallback(
        (templateId, data) => {
            const printerTemplate = templateStore?.find?.(template => template.id === templateId)?.code;

            if (printerTemplate) {
                const formattedTemplate = formatTemplateString(printerTemplate, data);
                return { id: templateId, formattedTemplate: formattedTemplate };
            }
            return null;
        },
        [templateStore],
    );

    const getAllLabelTemplatesForPrinter = useCallback(
        printerName => {
            return templateStore?.filter?.(template => template.printers.includes(printerName));
        },
        [templateStore],
    );

    return {
        getLabelPrinterFormattedTemplate,
        getAllLabelTemplatesForPrinter,
    };
};

export default useLabelPrinterTemplate;

import { useState, useCallback } from 'react';
import { normalisePrinterNameKey, normalisePlaceholderKey } from './utils/helpers';

export const formatTemplateString = (template, data) => {
    let formattedTemplate = template;
    Object.keys(data).forEach(key => {
        const normalKey = normalisePlaceholderKey(key);
        const regex = new RegExp(`{{${normalKey}}}`, 'g');
        formattedTemplate = formattedTemplate.replace(regex, data[key]);
    });
    return formattedTemplate;
};

const useLabelPrinterTemplate = templates => {
    const [templateStore] = useState(templates || {});

    const getLabelPrinterTemplate = useCallback(
        (printerKey, data) => {
            const normalisedKey = normalisePrinterNameKey(printerKey);
            const printerTemplate = templateStore?.[normalisedKey];
            if (printerTemplate) {
                const formattedTemplate = formatTemplateString(printerTemplate, data);
                return { name: printerKey, formattedTemplate: formattedTemplate };
            }
            return null;
        },
        [templateStore],
    );

    const hasLabelPrinterTemplate = useCallback(
        key => {
            const normalisedKey = normalisePrinterNameKey(key);
            return Object.keys(templateStore).some(storeKey => {
                const regex = new RegExp(storeKey, 'i');
                return regex.test(normalisedKey);
            });
        },
        [templateStore],
    );

    return {
        getLabelPrinterTemplate,
        hasLabelPrinterTemplate,
    };
};

export default useLabelPrinterTemplate;

import { useMemo, useEffect, useCallback } from 'react';

import { useSelector } from 'react-redux';

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

export const transformTemplateListToStore = templateList => {
    return templateList.map(template => ({
        id: template.printer_template_id,
        name: template.printer_template_name,
        code: template.printer_template_rendered,
        printers: template.identifiers.map(identifier => identifier.printer_template_identifier_value),
    }));
};

export const useLabelPrinterTemplateStore = actions => {
    const { printerTemplateList, printerTemplateListLoading, printerTemplateListError } = useSelector(state =>
        state.get?.('testTagPrinterTemplateReducer'),
    );

    useEffect(() => {
        if ((!printerTemplateList?.length || printerTemplateList?.length === 0) && !printerTemplateListLoading) {
            actions.loadPrinterTemplateList();
        }
    }, [printerTemplateList, printerTemplateListLoading, actions]);

    const transformedTemplateStore = useMemo(() => transformTemplateListToStore(printerTemplateList), [
        printerTemplateList,
    ]);
    return { printerTemplateList: transformedTemplateStore, printerTemplateListLoading, printerTemplateListError };
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

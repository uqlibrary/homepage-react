import { useMemo, useEffect } from 'react';

import { useSelector } from 'react-redux';

export const transformTemplateListToStore = templateList => {
    return templateList.map(template => ({
        id: template.printer_template_id,
        name: template.printer_template_name,
        code: template.printer_template_rendered,
        printers: template.identifiers.map(identifier => identifier.printer_template_identifier_value),
    }));
};

export const useLabelPrinterTemplateStore = (actions, printingEnabled) => {
    const { printerTemplateList, printerTemplateListLoading, printerTemplateListLoaded, printerTemplateListError } =
        useSelector(state => state.get?.('testTagPrinterTemplateReducer'));

    useEffect(() => {
        if (printingEnabled && !printerTemplateListLoaded && !printerTemplateListLoading) {
            actions.loadPrinterTemplateList();
        }
    }, [printerTemplateList, printerTemplateListLoading, printerTemplateListLoaded, actions, printingEnabled]);

    const transformedTemplateStore = useMemo(
        () => transformTemplateListToStore(printerTemplateList),
        [printerTemplateList],
    );
    return { printerTemplateList: transformedTemplateStore, printerTemplateListLoading, printerTemplateListError };
};

export default useLabelPrinterTemplateStore;

import { isEmptyStr } from '../../../helpers/helpers';

export const randomId = rows =>
    Math.max(...(rows?.length > 0 ? rows.map(row => row.printer_template_var_id) : [0])) + 1;
export const getCleanVarName = name => {
    const varName = name;
    return varName?.replaceAll(/[\s{}]/g, '').toUpperCase() ?? '';
};
export const getUserVariablePlaceholder = name => `{{${name}}}`;
export const getSafeUserVariableNamePlaceholder = name => getUserVariablePlaceholder(getCleanVarName(name));
export const getSafeUserVariableValuePlaceholder = value => (typeof value === 'string' ? value : `${value}`);

export const transformRow = row => {
    return row?.map(line => ({
        ...line,
        identifiers_str: line?.identifiers?.map(identifier => identifier.printer_template_identifier_value).join(', '),
        printer_template_current_flag_cb: line?.printer_template_current_flag === 1,
        printer_template_current_flag: line?.printer_template_current_flag === 1 ? 'Yes' : 'No',
    }));
};

export const emptyActionState = { isAdd: false, isEdit: false, isDelete: false, title: '', row: {}, key: null };

export const transformUpdateRequest = request => {
    request.printer_template_current_flag = request?.printer_template_current_flag_cb ? 1 : 0;

    // clean up identifiers array
    const identifiers = request?.identifiers ?? [];
    request.identifiers = identifiers.map(identifier => ({
        ...(typeof identifier === 'string' ? { printer_template_identifier_value: identifier } : identifier),
    }));

    // clean up vars array
    const vars = request?.vars ?? [];
    request.vars = vars.map(variable => {
        delete variable.error;
        delete variable.isNew;
        if (variable.hasOwnProperty('isAdded')) {
            delete variable.isAdded;
            delete variable.printer_template_var_id;
        }
        variable.printer_template_var_name = getSafeUserVariableNamePlaceholder(variable.printer_template_var_name);
        variable.printer_template_var_value = getSafeUserVariableValuePlaceholder(variable.printer_template_var_value);
        return variable;
    });

    delete request.identifiers_str;
    delete request.printer_template_department_slug;
    delete request.printer_template_current_flag_cb;
    delete request.created_at;
    delete request.updated_at;
    return request;
};

export const transformAddRequest = request => {
    // Assign team Current flag.
    request.printer_template_current_flag = request?.printer_template_current_flag_cb ? 1 : 0;

    // clean up identifiers array
    const identifiers = request?.identifiers ?? [];
    request.identifiers = identifiers.map(identifier => ({
        printer_template_identifier_value: identifier,
    }));

    // clean up vars array
    const vars = request?.vars ?? [];
    request.vars = vars.map(variable => {
        delete variable.error;
        delete variable.isNew;
        delete variable.isAdded;
        delete variable.printer_template_var_id;

        variable.printer_template_var_name = getSafeUserVariableNamePlaceholder(variable.printer_template_var_name);
        variable.printer_template_var_value = getSafeUserVariableValuePlaceholder(variable.printer_template_var_value);
        return variable;
    });
    // clear data not required from UI for request.
    delete request.printer_template_current_flag_cb;

    return request;
};

export const actionReducer = (_, action) => {
    const { type, row, title, ...props } = action;
    switch (type) {
        case 'add':
            return {
                isAdd: true,
                isEdit: false,
                isDelete: false,
                row: {
                    printer_template_name: '',
                    identifiers: [],
                    vars: [],
                    printer_template_current_flag_cb: true,
                },
                title,
                props: { ...props },
                key: `add-${Date.now()}`,
            };
        case 'edit':
            return {
                isAdd: false,
                isEdit: true,
                isDelete: false,
                title,
                row: { ...row, id: row.printer_template_id },
                props: { ...props },
                key: `edit-${row.printer_template_id}-${Date.now()}`,
            };
        case 'delete':
            return { isAdd: false, isEdit: false, isDelete: true, title, row, props: { ...props } };
        case 'clear':
            return { ...emptyActionState };
        default:
            throw `Unknown action '${type}'`;
    }
};

export const validateTemplateUserVariable = row => {
    const nameInvalid = isEmptyStr(row.printer_template_var_name) || row.printer_template_var_name?.length > 255;
    const labelInvalid = row.printer_template_var_label?.length > 255;
    const valueInvalid =
        row.printer_template_var_value === null ||
        row.printer_template_var_value === undefined ||
        row.printer_template_var_value === '' ||
        !Number.isInteger(Number(row.printer_template_var_value));

    return nameInvalid || labelInvalid || valueInvalid;
};

export const formatTemplate = (template, templateData, inspectionData) => {
    let result = template;

    /* istanbul ignore else */
    if (Array.isArray(templateData)) {
        for (const item of templateData) {
            const placeholder = item.printer_template_var_name;
            const value = item.printer_template_var_value;

            /* istanbul ignore else */
            if (placeholder) {
                result = result.replaceAll(placeholder, value);
            }
        }
    }

    /* istanbul ignore else */
    if (inspectionData && typeof inspectionData === 'object') {
        for (const [key, value] of Object.entries(inspectionData)) {
            result = result.replaceAll(`{*${key.toLocaleUpperCase()}*}`, value);
        }
    }

    return result;
};

export const getLabelDates = date => {
    const testDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
    const nextYear = new Date(date);
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const dueDate = nextYear.toISOString().split('T')[0]; // YYYY-MM-DD + 1 year
    return { testDate, dueDate };
};

export const getUserVariablesFromRow = row =>
    row?.vars?.reduce?.((acc, variable) => [...acc, variable.printer_template_var_name], []) ??
    /* istanbul ignore next */ [];

export const getMissingUserVarsInCode = (userVariables, printerTemplateCode) =>
    userVariables.filter(varName => !printerTemplateCode.includes(getSafeUserVariableNamePlaceholder(varName)));

export const getMissingUserVarsInPastedCode = (rows, printerTemplatePasteValue) => {
    const existingNames = rows.map(row => row.printer_template_var_name);
    const placeholders = [...new Set(printerTemplatePasteValue.match(/\{\{[^}]+\}\}/g) ?? [])];
    return placeholders.filter(p => !existingNames.includes(p));
};
export const getUniqueTemplateIds = row => {
    const usedIds = new Set(row.map(row => row.printer_template_var_id));
    return usedIds;
};
export const getRowsToAddForMissingVars = (missingVars, currentRows) => {
    const unavailableIds = getUniqueTemplateIds(currentRows);
    let nextId = 1;
    const newRows = missingVars.map(name => {
        while (unavailableIds.has(nextId)) nextId++;
        const id = nextId++;
        unavailableIds.add(id);
        return {
            printer_template_var_id: id,
            printer_template_var_label: '',
            printer_template_var_name: name,
            printer_template_var_value: '',
        };
    });
    return newRows;
};

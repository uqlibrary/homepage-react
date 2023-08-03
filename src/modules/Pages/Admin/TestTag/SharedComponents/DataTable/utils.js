export const getDataFieldParams = (row, dataFieldKeys) => {
    const { valueKey } = dataFieldKeys;
    const dataFieldName = valueKey ?? null;
    const dataFieldValue = row?.[valueKey] ?? null;

    return { dataFieldName, dataFieldValue };
};

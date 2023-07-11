export const componentProps = {
    default: ['id', 'name', 'label', 'value', 'onChange', 'inputProps'],
    textfield: ['InputLabelProps', 'fullWidth', 'error'],
    checkbox: ['checked'],
};
export const filterComponentProps = ({ type = 'textfield', ...props }) => {
    const fullProps = [...componentProps.default, ...componentProps[type]];
    Object.keys(props).forEach(key => {
        if (!fullProps.includes(key)) delete props[key];
    });
    return props;
};

export const getDataFieldParams = (row, dataFieldKeys) => {
    const { valueKey } = dataFieldKeys;
    const dataFieldName = valueKey ?? null;
    const dataFieldValue = row?.[valueKey] ?? null;

    return { dataFieldName, dataFieldValue };
};

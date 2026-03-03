import PropTypes from 'prop-types';
import {
    commonPropNames,
    textfieldPropNames,
    checkboxPropNames,
    autocompletePropNames,
    overrides,
} from './componentProps';

export const componentProps = {
    textfield: textfieldPropNames,
    checkbox: checkboxPropNames,
    autocomplete: autocompletePropNames,
};
const componentPropKeys = Object.keys(componentProps);

export const filterComponentProps = ({ type = 'textfield', ...props }) => {
    if (!componentPropKeys.includes(type)) return props;

    const fullProps = [...commonPropNames, ...componentProps[type], ...(overrides?.[type] ? overrides?.[type] : [])];
    Object.keys(props).forEach(key => {
        if (!fullProps.includes(key)) delete props[key];
    });
    return props;
};
filterComponentProps.propTypes = {
    type: PropTypes.oneOf(componentPropKeys),
    props: PropTypes.object.isRequired,
};

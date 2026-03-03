import PropTypes from 'prop-types';
import {
    commonPropNames,
    textfieldPropNames,
    checkboxPropNames,
    autocompletePropNames,
    renderInputPropNames,
} from './componentProps';

export const componentProps = {
    textfield: textfieldPropNames,
    checkbox: checkboxPropNames,
    autocomplete: autocompletePropNames,
};
const componentPropKeys = Object.keys(componentProps);

export const filterComponentProps = ({ type = 'textfield', hasRenderInput = false, ...props }) => {
    if (!componentPropKeys.includes(type)) return props;

    const fullProps = [...commonPropNames, ...componentProps[type], ...(hasRenderInput ? renderInputPropNames : [])];
    Object.keys(props).forEach(key => {
        if (!fullProps.includes(key)) delete props[key];
    });
    return props;
};
filterComponentProps.propTypes = {
    type: PropTypes.oneOf(componentPropKeys),
    hasRenderInput: PropTypes.bool,
    props: PropTypes.object.isRequired,
};

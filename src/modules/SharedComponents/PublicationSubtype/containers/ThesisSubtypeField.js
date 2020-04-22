import { connect } from 'react-redux';
import { GenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { THESIS_SUBTYPES } from 'config/general';

const mapStateToProps = (state, props) => {
    return {
        value: props.input ? props.input.value : props.value,
        itemsList: props.itemsList || THESIS_SUBTYPES,
        itemsLoading: false,
        hideLabel: props.hideLabel || false,
        label: props.label || (props.locale && props.locale.label) || '',
        placeholder: props.placeholder,
        required: props.required,
        itemsLoadingHint: props.loadingHint || 'Loading..',
        errorText: (!!props.meta && props.meta.error) || (props.error && !!props.errorText && props.errorText) || '',
        error: (!!props.meta && !!props.meta.error) || props.error || false,
        ...props,
    };
};

const mapDispatchToProps = (dispatch, props) => {
    return {
        onChange: (!!props.input && props.input.onChange) || (!!props.onChange && props.onChange),
    };
};

export const ThesisSubtypeField = connect(mapStateToProps, mapDispatchToProps)(GenericSelectField);

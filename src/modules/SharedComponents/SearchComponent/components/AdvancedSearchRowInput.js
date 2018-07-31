import {PureComponent} from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import * as validationRules from 'config/validation';
import {SubTypeField, ThesisTypeField, CollectionsField} from './Fields';
import {AuthorIdField, PublisherField, OrgUnitNameField} from 'modules/SharedComponents/LookupFields';

class AdvancedSearchRowInput extends PureComponent {
    static propTypes = {
        children: PropTypes.func.isRequired,
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array,
            PropTypes.number
        ]),
        label: PropTypes.string,
        onChange: PropTypes.func,
        inputField: PropTypes.shape({
            type: PropTypes.string.isRequired,
            validation: PropTypes.array.isRequired,
            hint: PropTypes.string,
            multiple: PropTypes.bool,
            errorHint: PropTypes.string,
            loadingHint: PropTypes.string,
        })
    };

    constructor(props) {
        super(props);
        this.state = {
            InputComponent: TextField,
            inputProps: {}
        };
    }

    componentWillMount() {
        this.setState({
            InputComponent: this.getInputComponent(),
            inputProps: this.getInputProps()
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            ...this.state,
            inputProps: {
                ...this.state.inputProps,
                'errorText': this.runValidationRules(nextProps.value)
            }
        });
    }

    getInputComponent = () => {
        switch (this.props.inputField.type) {
            case 'TextField':
                return TextField;
            case 'PublisherLookup':
                return PublisherField;
            case 'SubTypeLookup':
                return SubTypeField;
            case 'ThesisTypeLookup':
                return ThesisTypeField;
            case 'CollectionsLookup':
                return CollectionsField;
            case 'AuthorIdLookup':
                return AuthorIdField;
            case 'OrgUnitLookup':
                return OrgUnitNameField;
            default:
                return TextField;
        }
    };

    getInputProps = () => {
        const defaultProps = {
            'hintText': this.props.inputField.hint,
            'aria-label': this.props.inputField.hint,
            'errorText': this.runValidationRules(this.props.value)
        };

        const lookupDefaultProps = {
            ...defaultProps,
            'floatingLabelText': null,
            'value': this.props.label || this.props.value,
        };

        const selectDefaultProps = {
            ...defaultProps,
            'floatingLabelText': null,
            'onChange': this.props.onChange
        };

        switch (this.props.inputField.type) {
            case 'TextField':
                return {
                    ...defaultProps,
                    'autoComplete': 'off',
                    'onChange': (event, value) => this.props.onChange(value)
                };
            case 'PublisherLookup':
            case 'OrgUnitLookup':
                return {
                    ...lookupDefaultProps,
                    'onChange': (item) => this.props.onChange(item.value, item.value)
                };
            case 'AuthorIdLookup':
                return {
                    ...lookupDefaultProps,
                    'onChange': (item) => this.props.onChange(item.id, item.text)
                };
            case 'SubTypeLookup':
            case 'ThesisTypeLookup':
                return {
                    ...selectDefaultProps,
                    onChange: (item) => this.props.onChange(item, item)
                };
            case 'CollectionsLookup':
                return {
                    ...selectDefaultProps,
                    'loadingHint': this.props.inputField.loadingHint,
                    'errorHint': this.props.inputField.errorHint,
                    'multiple': this.props.inputField.multiple
                };
            default: return {};
        }
    };

    runValidationRules = (value) => {
        const rules = !!this.props.inputField.validation && this.props.inputField.validation;
        return !!rules &&
            rules.reduce((errors, rule) => ([...errors, validationRules[rule](value)]), [])
                .filter(error => error)
                .join(', ') || undefined;
    };

    render() {
        return this.props.children(this.state.InputComponent, this.state.inputProps);
    }
}

export default AdvancedSearchRowInput;

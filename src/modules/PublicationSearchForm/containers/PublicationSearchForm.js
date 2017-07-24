import {connect} from 'react-redux';
import {reduxForm, getFormValues, stopSubmit} from 'redux-form/immutable'; // SubmissionError
import Immutable from 'immutable';
import PublicationSearchForm from '../components/PublicationSearchForm';
import {validation, locale} from 'config';

const FORM_NAME = 'PublicationSearchForm';

const validate = (values) => {
    // reset global errors, eg form submit failure
    stopSubmit(FORM_NAME, null);

    const errors = {};
    const fieldValue = values.get('searchQuery');

    if (!validation.required(fieldValue)
        && !validation.isValidDOIValue(fieldValue)
        && !validation.isValidPubMedValue(fieldValue)
        && (fieldValue.trim().length === 0 || !validation.isValidPublicationTitle(fieldValue))) {
        errors.searchQuery = locale.validationErrors.publicationSearch;
    }
    return errors;
};

let PublicationSearchFormContainer = reduxForm({
    form: FORM_NAME,
    validate
})(PublicationSearchForm);

const mapStateToProps = (state) => {
    return {
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({})
    };
};

PublicationSearchFormContainer = connect(mapStateToProps)(PublicationSearchFormContainer);

export default PublicationSearchFormContainer;

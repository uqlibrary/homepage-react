import {connect} from 'react-redux';
import {reduxForm, getFormValues} from 'redux-form/immutable';
import ClaimPublicationForm from '../components/ClaimPublicationForm';
import {claimPublication} from '../actions';
import Immutable from 'immutable';

let ClaimPublicationFormContainer = reduxForm({
    form: 'ClaimPublicationForm'
})(ClaimPublicationForm);

ClaimPublicationFormContainer = connect((state) => {
    const claimPublication = state.get('claimPublication');
    const fileUploadState = state.get('fileUpload');
    return {
        acceptedFiles: fileUploadState.get('acceptedFiles'),
        claimPublicationResults: claimPublication.get('claimPublicationResults'),
        formValues: getFormValues('ClaimPublicationForm')(state) || Immutable.Map({}),
        isUploadCompleted: fileUploadState.get('isUploadCompleted'),
        recordClaimState: claimPublication.get('recordClaimState'),
        recordClaimErrorMessage: claimPublication.get('recordClaimErrorMessage'),
        selectedPublication: claimPublication.get('selectedPublication')
    };
}, dispatch => {
    return {
        claimPublication: (data) => dispatch(claimPublication(data))
    };
})(ClaimPublicationFormContainer);

export default ClaimPublicationFormContainer;

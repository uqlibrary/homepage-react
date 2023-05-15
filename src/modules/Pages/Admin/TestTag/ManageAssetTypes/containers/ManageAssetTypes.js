import { connect } from 'react-redux';
import ManageAssetTypes from '../components/ManageAssetTypes';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'data/actions';

const DEFAULT_FORM_VALUES = {
    asset_id_displayed: undefined,
    room_id: undefined,
    asset_type_id: undefined,
    action_date: undefined,
    inspection_status: undefined,
    inspection_device_id: undefined,
    inspection_fail_reason: undefined,
    inspection_notes: undefined,
    inspection_date_next: undefined,
    isRepair: false,
    repairer_contact_details: undefined,
    isDiscarded: false,
    discard_reason: undefined,
};

export const mapStateToProps = state => {
    return {
        ...state.get('testTagAssetTypesReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
        defaultFormValues: DEFAULT_FORM_VALUES,
    };
};

let ManageAssetTypesContainer = connect(mapStateToProps, mapDispatchToProps)(ManageAssetTypes);
ManageAssetTypesContainer = withRouter(ManageAssetTypesContainer);

export default ManageAssetTypesContainer;

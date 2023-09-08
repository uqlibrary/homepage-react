import { connect } from 'react-redux';
import Inspection from '../components/Inspection';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'data/actions';
import { withUser } from '../../helpers/withUser';

const currentAssetOwnersList = [{ value: 'UQL', label: 'UQ Library' }];

const DEFAULT_NEXT_TEST_DATE_VALUE = '12';

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
    isManualDate: false,
    isRepair: false,
    repairer_contact_details: undefined,
    isDiscarded: false,
    discard_reason: undefined,
};

export const mapStateToProps = state => {
    return {
        ...state.get('testTagOnLoadInspectionReducer'),
        ...state.get('testTagLocationReducer'),
        ...state.get('testTagAssetsReducer'),
        ...state.get('testTagSaveInspectionReducer'),
        ...state.get('testTagSaveAssetTypeReducer'),
        ...state.get('testTagUserReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
        defaultFormValues: DEFAULT_FORM_VALUES,
        currentAssetOwnersList,
        defaultNextTestDateValue: DEFAULT_NEXT_TEST_DATE_VALUE,
    };
};

let InspectionContainer = connect(mapStateToProps, mapDispatchToProps)(Inspection);
InspectionContainer = withRouter(InspectionContainer);
InspectionContainer = withUser(InspectionContainer);

export default InspectionContainer;

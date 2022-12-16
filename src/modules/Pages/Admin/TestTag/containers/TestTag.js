/* istanbul ignore file */
import { connect } from 'react-redux';
import TestTag from '../components/TestTag';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'data/actions';

const currentRetestList = [
    { value: '3', label: '3 months' },
    { value: '6', label: '6 months' },
    { value: '12', label: '1 year' },
    { value: '60', label: '5 years' },
];

const currentAssetOwnersList = [{ value: 'UQL', label: 'UQL-WSS' }];

const DEFAULT_NEXT_TEST_DATE_VALUE = 12;

const DEFAULT_FORM_VALUES = {
    asset_id_displayed: undefined,
    user_id: undefined,
    asset_department_owned_by: undefined,
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
        ...state.get('testTagOnLoadReducer'),
        ...state.get('testTagLocationReducer'),
        ...state.get('testTagAssetsReducer'),
        ...state.get('testTagSaveInspectionReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
        defaultFormValues: DEFAULT_FORM_VALUES,
        currentRetestList,
        currentAssetOwnersList,
        defaultNextTestDateValue: DEFAULT_NEXT_TEST_DATE_VALUE,
    };
};

let TestTagContainer = connect(mapStateToProps, mapDispatchToProps)(TestTag);
TestTagContainer = withRouter(TestTagContainer);

export default TestTagContainer;

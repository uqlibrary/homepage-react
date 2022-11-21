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

const currentAssetOwnersList = [{ value: 'UQL-WSS', label: 'UQL-WSS' }];

const DEFAULT_NEXT_TEST_DATE_VALUE = 12;

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
        currentRetestList,
        currentAssetOwnersList,
        defaultNextTestDateValue: DEFAULT_NEXT_TEST_DATE_VALUE,
    };
};

let TestTagContainer = connect(mapStateToProps, mapDispatchToProps)(TestTag);
TestTagContainer = withRouter(TestTagContainer);

export default TestTagContainer;

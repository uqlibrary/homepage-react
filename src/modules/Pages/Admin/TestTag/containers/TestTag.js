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

export const mapStateToProps = state => {
    return {
        ...state.get('siteListReducer'),
        ...state.get('floorListReducer'),
        ...state.get('roomListReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
        currentRetestList,
    };
};

let TestTagContainer = connect(mapStateToProps, mapDispatchToProps)(TestTag);
TestTagContainer = withRouter(TestTagContainer);

export default TestTagContainer;

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

import DLOFilterManage from 'modules/Pages/Admin/DigitalLearningObjects/Filters/DLOFilterManage';

const mapStateToProps = state => {
    return {
        ...state.get('accountReducer'),
        ...state.get('dlorFilterListReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

const DLOFilterManageContainer = connect(mapStateToProps, mapDispatchToProps)(DLOFilterManage);

export default DLOFilterManageContainer;

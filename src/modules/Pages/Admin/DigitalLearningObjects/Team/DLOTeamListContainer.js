import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'data/actions';

import DLOTeamList from 'modules/Pages/Admin/DigitalLearningObjects/Team/DLOTeamList';

const mapStateToProps = state => {
    return {
        ...state.get('accountReducer'),
        ...state.get('dlorTeamListReducer'),
        ...state.get('dlorTeamDeleteReducer'),
        ...state.get('dlorListReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

let DLOTeamListContainer = connect(mapStateToProps, mapDispatchToProps)(DLOTeamList);
DLOTeamListContainer = withRouter(DLOTeamListContainer);

export default DLOTeamListContainer;

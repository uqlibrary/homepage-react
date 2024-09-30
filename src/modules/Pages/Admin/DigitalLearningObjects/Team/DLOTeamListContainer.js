import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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

const DLOTeamListContainer = connect(mapStateToProps, mapDispatchToProps)(DLOTeamList);

export default DLOTeamListContainer;

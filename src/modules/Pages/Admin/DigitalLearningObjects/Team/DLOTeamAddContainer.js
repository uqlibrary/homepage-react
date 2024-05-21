import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'data/actions';

import DLOTeamAdd from 'modules/Pages/Admin/DigitalLearningObjects/Team/DLOTeamAdd';

const mapStateToProps = state => {
    return {
        ...state.get('accountReducer'),
        ...state.get('dlorCreateReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

let TeamListContainer = connect(mapStateToProps, mapDispatchToProps)(DLOTeamAdd);
TeamListContainer = withRouter(TeamListContainer);

export default TeamListContainer;

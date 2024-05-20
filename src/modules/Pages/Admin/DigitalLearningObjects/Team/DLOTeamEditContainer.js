import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'data/actions';

import DLOTeamEdit from 'modules/Pages/Admin/DigitalLearningObjects/Team/DLOTeamEdit';

const mapStateToProps = state => {
    return {
        ...state.get('accountReducer'),
        ...state.get('dlorTeamSingleReducer'),
        ...state.get('dlorUpdateReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

let TeamListContainer = connect(mapStateToProps, mapDispatchToProps)(DLOTeamEdit);
TeamListContainer = withRouter(TeamListContainer);

export default TeamListContainer;

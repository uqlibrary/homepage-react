import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'data/actions';

import TeamList from 'modules/Pages/Admin/DigitalLearningObjects/Team/TeamList';

const mapStateToProps = state => {
    return {
        ...state.get('accountReducer'),
        ...state.get('dlorTeamListReducer'),
        ...state.get('dlorTeamDeleteReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

let TeamListContainer = connect(mapStateToProps, mapDispatchToProps)(TeamList);
TeamListContainer = withRouter(TeamListContainer);

export default TeamListContainer;

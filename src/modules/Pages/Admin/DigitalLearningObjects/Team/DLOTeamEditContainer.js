import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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

const TeamListContainer = connect(mapStateToProps, mapDispatchToProps)(DLOTeamEdit);

export default TeamListContainer;

import { connect } from 'react-redux';
import Teams from '../components/Teams';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';
import { withUser } from '../../../helpers/withUser';

export const mapStateToProps = state => {
    return {
        ...state.get('testTagTeamListReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

let TeamsContainer = connect(mapStateToProps, mapDispatchToProps)(Teams);
TeamsContainer = withUser(TeamsContainer);

export default TeamsContainer;

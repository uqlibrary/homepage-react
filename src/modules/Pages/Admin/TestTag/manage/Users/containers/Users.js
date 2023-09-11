import { connect } from 'react-redux';
import Users from '../components/Users';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'data/actions';
import { withUser } from '../../../helpers/withUser';

export const mapStateToProps = state => {
    return {
        ...state.get('testTagUserListReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

let UsersContainer = connect(mapStateToProps, mapDispatchToProps)(Users);
UsersContainer = withRouter(UsersContainer);
UsersContainer = withUser(UsersContainer);

export default UsersContainer;

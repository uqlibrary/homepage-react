import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

import MembershipList from './MembershipList';

const mapStateToProps = state => {
    return {
        ...state.get('membershipListReducer'),
        ...state.get('membershipFormDataReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

const MembershipListContainer = connect(mapStateToProps, mapDispatchToProps)(MembershipList);

export default MembershipListContainer;

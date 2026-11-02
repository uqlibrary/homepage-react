import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

import MembershipReceived from './MembershipReceived';

const mapStateToProps = state => {
    return {
        ...state.get('membershipReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

const MembershipReceivedContainer = connect(mapStateToProps, mapDispatchToProps)(MembershipReceived);

export default MembershipReceivedContainer;

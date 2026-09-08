import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

import MembershipPaymentConfirmation from './MembershipPaymentConfirmation';

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

const MembershipPaymentConfirmationContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(MembershipPaymentConfirmation);

export default MembershipPaymentConfirmationContainer;

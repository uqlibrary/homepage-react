import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

import MembershipLanding from './MembershipLanding';

const mapStateToProps = state => {
    return {
        ...state.get('accountReducer'),
        ...state.get('membershipFormDataReducer'),
        ...state.get('membershipRenewingReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

const MembershipLandingContainer = connect(mapStateToProps, mapDispatchToProps)(MembershipLanding);

export default MembershipLandingContainer;

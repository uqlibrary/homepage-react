import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

import MembershipForm from './MembershipForm';

const mapStateToProps = state => {
    return {
        ...state.get('membershipFormDataReducer'),
        ...state.get('membershipReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

const MembershipFormContainer = connect(mapStateToProps, mapDispatchToProps)(MembershipForm);

export default MembershipFormContainer;

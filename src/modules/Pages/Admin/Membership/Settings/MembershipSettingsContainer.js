import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

import MembershipSettings from './MembershipSettings';

const mapStateToProps = state => {
    return {
        ...state.get('membershipTypesReducer'),
        ...state.get('membershipFormDataReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

const MembershipSettingsContainer = connect(mapStateToProps, mapDispatchToProps)(MembershipSettings);

export default MembershipSettingsContainer;

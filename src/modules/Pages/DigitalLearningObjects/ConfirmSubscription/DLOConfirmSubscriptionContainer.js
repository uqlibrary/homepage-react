import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

import DLOConfirmSubscription from './DLOConfirmSubscription';

const mapStateToProps = state => {
    return {
        // ...state.get('dlorGetSingleReducer'),
        ...state.get('dlorUpdateReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

const DLOConfirmSubscriptionContainer = connect(mapStateToProps, mapDispatchToProps)(DLOConfirmSubscription);

export default DLOConfirmSubscriptionContainer;

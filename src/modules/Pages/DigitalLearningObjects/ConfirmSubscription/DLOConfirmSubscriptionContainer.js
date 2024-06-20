import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
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

let DLOConfirmSubscriptionContainer = connect(mapStateToProps, mapDispatchToProps)(DLOConfirmSubscription);
DLOConfirmSubscriptionContainer = withRouter(DLOConfirmSubscriptionContainer);

export default DLOConfirmSubscriptionContainer;

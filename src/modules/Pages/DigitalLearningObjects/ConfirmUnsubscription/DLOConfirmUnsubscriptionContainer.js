import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'data/actions';

import DLOConfirmUnsubscription from './DLOConfirmUnsubscription';

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

let DLOConfirmUnsubscriptionContainer = connect(mapStateToProps, mapDispatchToProps)(DLOConfirmUnsubscription);
DLOConfirmUnsubscriptionContainer = withRouter(DLOConfirmUnsubscriptionContainer);

export default DLOConfirmUnsubscriptionContainer;

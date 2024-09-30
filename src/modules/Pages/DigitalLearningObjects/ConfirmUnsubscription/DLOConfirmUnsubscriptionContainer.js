import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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

const DLOConfirmUnsubscriptionContainer = connect(mapStateToProps, mapDispatchToProps)(DLOConfirmUnsubscription);

export default DLOConfirmUnsubscriptionContainer;

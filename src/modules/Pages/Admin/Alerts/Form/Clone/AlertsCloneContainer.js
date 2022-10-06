import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'data/actions';

import AlertsClone from 'modules/Pages/Admin/Alerts/Form/Clone/AlertsClone';

const mapStateToProps = state => {
    return {
        ...state.get('alertReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

let AlertsCloneContainer = connect(mapStateToProps, mapDispatchToProps)(AlertsClone);
AlertsCloneContainer = withRouter(AlertsCloneContainer);

export default AlertsCloneContainer;

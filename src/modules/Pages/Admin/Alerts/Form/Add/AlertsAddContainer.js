import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'actions';

import AlertsAdd from 'modules/Pages/Admin/Alerts/Form/Add/AlertsAdd';

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

let AlertsAddContainer = connect(mapStateToProps, mapDispatchToProps)(AlertsAdd);
AlertsAddContainer = withRouter(AlertsAddContainer);

export default AlertsAddContainer;

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

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

const AlertsAddContainer = connect(mapStateToProps, mapDispatchToProps)(AlertsAdd);

export default AlertsAddContainer;

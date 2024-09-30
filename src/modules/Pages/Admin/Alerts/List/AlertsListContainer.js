import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

import AlertsList from 'modules/Pages/Admin/Alerts/List/AlertsList';

const mapStateToProps = state => {
    return {
        ...state.get('alertsReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

const AlertsAdminContainer = connect(mapStateToProps, mapDispatchToProps)(AlertsList);

export default AlertsAdminContainer;

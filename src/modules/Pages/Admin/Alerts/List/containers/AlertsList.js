import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'actions';

import AlertsList from '../components/AlertsList';

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

let AlertsAdminContainer = connect(mapStateToProps, mapDispatchToProps)(AlertsList);
AlertsAdminContainer = withRouter(AlertsAdminContainer);

export default AlertsAdminContainer;

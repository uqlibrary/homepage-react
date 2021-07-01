import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'actions';

import AlertsAdmin from '../components/AlertsAdmin';

const mapStateToProps = state => {
    return {
        ...state.get('accountReducer'),
        ...state.get('alertsReducer'),
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

let AlertsAdminContainer = connect(mapStateToProps, mapDispatchToProps)(AlertsAdmin);
AlertsAdminContainer = withRouter(AlertsAdminContainer);

export default AlertsAdminContainer;

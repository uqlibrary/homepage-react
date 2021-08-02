import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'actions';

import AlertsView from '../components/AlertsView';

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

let AlertsViewContainer = connect(mapStateToProps, mapDispatchToProps)(AlertsView);
AlertsViewContainer = withRouter(AlertsViewContainer);

export default AlertsViewContainer;

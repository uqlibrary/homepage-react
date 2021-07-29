import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'actions';

console.log('###### EDIT ');

import AlertsEdit from '../components/AlertsEdit';

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

let AlertsEditContainer = connect(mapStateToProps, mapDispatchToProps)(AlertsEdit);
AlertsEditContainer = withRouter(AlertsEditContainer);

export default AlertsEditContainer;

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'actions';

import AlertsClone from '../components/AlertsClone';

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

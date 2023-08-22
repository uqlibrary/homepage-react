import { connect } from 'react-redux';
import Dashboard from '../components/Dashboard';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'data/actions';
import locale from '../../testTag.locale';

export const mapStateToProps = state => {
    return {
        ...state.get('testTagOnLoadDashboardReducer'),
        locale,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

let DashboardContainer = connect(mapStateToProps, mapDispatchToProps)(Dashboard);
DashboardContainer = withRouter(DashboardContainer);

export default DashboardContainer;

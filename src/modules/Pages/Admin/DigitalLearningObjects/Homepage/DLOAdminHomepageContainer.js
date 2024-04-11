import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'data/actions';

import DLOAdminHomepage from 'modules/Pages/Admin/DigitalLearningObjects/Homepage/DLOAdminHomepage';

const mapStateToProps = state => {
    return {
        ...state.get('accountReducer'),
        ...state.get('dlorListReducer'),
        ...state.get('dlorSingleReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

let DLOAdminHomepageContainer = connect(mapStateToProps, mapDispatchToProps)(DLOAdminHomepage);
DLOAdminHomepageContainer = withRouter(DLOAdminHomepageContainer);

export default DLOAdminHomepageContainer;

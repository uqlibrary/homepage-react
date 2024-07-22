import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

import DLOAdminHomepage from 'modules/Pages/Admin/DigitalLearningObjects/Homepage/DLOAdminHomepage';

const mapStateToProps = state => {
    return {
        ...state.get('accountReducer'),
        ...state.get('dlorListReducer'),
        ...state.get('dlorDeleteReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

const DLOAdminHomepageContainer = connect(mapStateToProps, mapDispatchToProps)(DLOAdminHomepage);

export default DLOAdminHomepageContainer;

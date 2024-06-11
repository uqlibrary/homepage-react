import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'data/actions';

import DLOEdit from './DLOEdit';

const mapStateToProps = state => {
    return {
        ...state.get('dlorFilterListReducer'),
        ...state.get('dlorGetSingleReducer'),
        ...state.get('dlorTeamListReducer'),
        ...state.get('dlorUpdateReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

let DLOEditContainer = connect(mapStateToProps, mapDispatchToProps)(DLOEdit);
DLOEditContainer = withRouter(DLOEditContainer);

export default DLOEditContainer;

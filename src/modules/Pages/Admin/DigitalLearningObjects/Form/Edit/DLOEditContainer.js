import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'data/actions';

import DLOEdit from './DLOEdit';

const mapStateToProps = state => {
    const newVar = {
        ...state.get('accountReducer'),
        // ...state.get('dlorListReducer'),
        ...state.get('dlorFilterListReducer'),
        ...state.get('dlorGetSingleReducer'),
    };
    console.log('mapStateToProps', newVar);
    return newVar;
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

let DLOEditContainer = connect(mapStateToProps, mapDispatchToProps)(DLOEdit);
DLOEditContainer = withRouter(DLOEditContainer);

export default DLOEditContainer;

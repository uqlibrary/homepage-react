import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'data/actions';

import DLOAdd from './DLOAdd';

const mapStateToProps = state => {
    const newVar = {
        ...state.get('accountReducer'),
        ...state.get('dlorListReducer'),
        ...state.get('dlorFilterListReducer'),
        ...state.get('dlorTeamReducer'),
        ...state.get('dlorCreateReducer'),
    };
    console.log('mapStateToProps', newVar);
    return newVar;
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

let DLOAddContainer = connect(mapStateToProps, mapDispatchToProps)(DLOAdd);
DLOAddContainer = withRouter(DLOAddContainer);

export default DLOAddContainer;

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

import DLOAdd from './DLOAdd';

const mapStateToProps = state => {
    return {
        ...state.get('accountReducer'),
        ...state.get('dlorListReducer'),
        ...state.get('dlorFileTypeListReducer'),
        ...state.get('dlorFilterListReducer'),
        ...state.get('dlorTeamListReducer'),
        ...state.get('dlorCreateReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

const DLOAddContainer = connect(mapStateToProps, mapDispatchToProps)(DLOAdd);

export default DLOAddContainer;

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

import DLOList from './DLOList';

const mapStateToProps = state => {
    return {
        ...state.get('accountReducer'),
        ...state.get('dlorListReducer'),
        ...state.get('dlorFilterListReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

const DLOListContainer = connect(mapStateToProps, mapDispatchToProps)(DLOList);

export default DLOListContainer;

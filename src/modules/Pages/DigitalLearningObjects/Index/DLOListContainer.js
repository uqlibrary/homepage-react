import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'data/actions';

import DLOList from './DLOList';

const mapStateToProps = state => {
    return {
        ...state.get('dlorReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

let DLOListContainer = connect(mapStateToProps, mapDispatchToProps)(DLOList);
DLOListContainer = withRouter(DLOListContainer);

export default DLOListContainer;

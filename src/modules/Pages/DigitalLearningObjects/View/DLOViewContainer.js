import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'data/actions';

import DLOView from './DLOView';

const mapStateToProps = state => {
    return {
        ...state.get('dlorSingleReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

let DLOViewContainer = connect(mapStateToProps, mapDispatchToProps)(DLOView);
DLOViewContainer = withRouter(DLOViewContainer);

export default DLOViewContainer;

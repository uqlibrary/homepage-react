import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'data/actions';

import DLOView from './DLOView';

const mapStateToProps = state => {
    console.log('DLOViewContainer mapStateToProps', state);
    return {
        ...state.get('dlorSingleReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    console.log('DLOViewContainer mapDispatchToProps dispatch', dispatch);
    console.log('DLOViewContainer mapDispatchToProps actions', actions);
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

let DLOViewContainer = connect(mapStateToProps, mapDispatchToProps)(DLOView);
DLOViewContainer = withRouter(DLOViewContainer);

export default DLOViewContainer;

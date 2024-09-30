import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

import DLOView from './DLOView';

const mapStateToProps = state => {
    return {
        ...state.get('dlorGetSingleReducer'),
        ...state.get('dlorUpdateReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

const DLOViewContainer = connect(mapStateToProps, mapDispatchToProps)(DLOView);

export default DLOViewContainer;

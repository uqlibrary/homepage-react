import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

import DLOEdit from '../../Admin/DigitalLearningObjects/Form/Edit/DLOEdit';

const mapStateToProps = state => {
    return {
        ...state.get('accountReducer'),
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

const DLOEditContainer = connect(mapStateToProps, mapDispatchToProps)(DLOEdit);

export default DLOEditContainer;

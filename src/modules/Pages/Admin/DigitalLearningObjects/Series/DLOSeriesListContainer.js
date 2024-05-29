import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'data/actions';

import DLOSeriesList from 'modules/Pages/Admin/DigitalLearningObjects/Series/DLOSeriesList';

const mapStateToProps = state => {
    return {
        ...state.get('accountReducer'),
        ...state.get('dlorSeriesListReducer'),
        ...state.get('dlorSeriesDeleteReducer'),
        ...state.get('dlorListReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

let DLOSeriesListContainer = connect(mapStateToProps, mapDispatchToProps)(DLOSeriesList);
DLOSeriesListContainer = withRouter(DLOSeriesListContainer);

export default DLOSeriesListContainer;

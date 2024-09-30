import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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

const DLOSeriesListContainer = connect(mapStateToProps, mapDispatchToProps)(DLOSeriesList);

export default DLOSeriesListContainer;

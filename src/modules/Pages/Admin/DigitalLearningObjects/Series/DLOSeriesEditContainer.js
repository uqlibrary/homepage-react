import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

import DLOSeriesEdit from 'modules/Pages/Admin/DigitalLearningObjects/Series/DLOSeriesEdit';

const mapStateToProps = state => {
    return {
        ...state.get('accountReducer'),
        ...state.get('dlorSeriesSingleReducer'),
        ...state.get('dlorUpdateReducer'),
        ...state.get('dlorListReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

const SeriesListContainer = connect(mapStateToProps, mapDispatchToProps)(DLOSeriesEdit);

export default SeriesListContainer;

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
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

let SeriesListContainer = connect(mapStateToProps, mapDispatchToProps)(DLOSeriesEdit);
SeriesListContainer = withRouter(SeriesListContainer);

export default SeriesListContainer;

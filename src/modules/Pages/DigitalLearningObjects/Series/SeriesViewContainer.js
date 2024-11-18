import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

import SeriesView from './SeriesView';

const mapStateToProps = state => {
    return {
        ...state.get('dlorSeriesSingleReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

const SeriesViewContainer = connect(mapStateToProps, mapDispatchToProps)(SeriesView);

export default SeriesViewContainer;

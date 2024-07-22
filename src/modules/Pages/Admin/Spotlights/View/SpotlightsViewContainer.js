import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

import SpotlightsView from './SpotlightsView';

const mapStateToProps = state => {
    return {
        ...state.get('spotlightReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

const SpotlightsViewContainer = connect(mapStateToProps, mapDispatchToProps)(SpotlightsView);

export default SpotlightsViewContainer;

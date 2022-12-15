import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
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

let SpotlightsViewContainer = connect(mapStateToProps, mapDispatchToProps)(SpotlightsView);
SpotlightsViewContainer = withRouter(SpotlightsViewContainer);

export default SpotlightsViewContainer;

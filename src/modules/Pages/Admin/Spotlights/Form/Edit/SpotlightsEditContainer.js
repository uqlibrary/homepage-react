import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'actions';

import SpotlightsEdit from './SpotlightsEdit';

const mapStateToProps = state => {
    return {
        ...state.get('spotlightReducer'),
        ...state.get('publicFileUploadReducer'),
        ...state.get('spotlightsReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

let SpotlightsEditContainer = connect(mapStateToProps, mapDispatchToProps)(SpotlightsEdit);
SpotlightsEditContainer = withRouter(SpotlightsEditContainer);

export default SpotlightsEditContainer;

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'actions';

import SpotlightsClone from './SpotlightsClone';

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

let SpotlightsCloneContainer = connect(mapStateToProps, mapDispatchToProps)(SpotlightsClone);
SpotlightsCloneContainer = withRouter(SpotlightsCloneContainer);

export default SpotlightsCloneContainer;
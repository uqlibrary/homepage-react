import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

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

const SpotlightsCloneContainer = connect(mapStateToProps, mapDispatchToProps)(SpotlightsClone);

export default SpotlightsCloneContainer;

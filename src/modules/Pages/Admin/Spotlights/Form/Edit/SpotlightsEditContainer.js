import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

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

const SpotlightsEditContainer = connect(mapStateToProps, mapDispatchToProps)(SpotlightsEdit);

export default SpotlightsEditContainer;

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

import SpotlightsAdd from './SpotlightsAdd';

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

const SpotlightsAddContainer = connect(mapStateToProps, mapDispatchToProps)(SpotlightsAdd);

export default SpotlightsAddContainer;

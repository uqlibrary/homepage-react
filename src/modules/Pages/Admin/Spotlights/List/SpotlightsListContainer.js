import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

import SpotlightsList from './SpotlightsList';

const mapStateToProps = state => {
    return {
        ...state.get('spotlightsReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

const SpotlightsAdminContainer = connect(mapStateToProps, mapDispatchToProps)(SpotlightsList);

export default SpotlightsAdminContainer;

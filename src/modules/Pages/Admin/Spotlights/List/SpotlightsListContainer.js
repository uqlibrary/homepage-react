import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'actions';

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

let SpotlightsAdminContainer = connect(mapStateToProps, mapDispatchToProps)(SpotlightsList);
SpotlightsAdminContainer = withRouter(SpotlightsAdminContainer);

export default SpotlightsAdminContainer;

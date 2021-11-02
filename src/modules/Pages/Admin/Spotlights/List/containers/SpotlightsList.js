import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'actions';

import SpotlightsList from '../components/SpotlightsList';

const mapStateToProps = state => {
    const newVar = {
        ...state.get('spotlightsReducer'),
    };
    console.log('container result;', newVar);
    return newVar;
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

let SpotlightsAdminContainer = connect(mapStateToProps, mapDispatchToProps)(SpotlightsList);
SpotlightsAdminContainer = withRouter(SpotlightsAdminContainer);

export default SpotlightsAdminContainer;

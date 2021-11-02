import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'actions';

import SpotlightsAdd from '../components/SpotlightsAdd';

const mapStateToProps = state => {
    return {
        ...state.get('spotlightReducer'),
        ...state.get('publicFileUploadReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

let SpotlightsAddContainer = connect(mapStateToProps, mapDispatchToProps)(SpotlightsAdd);
SpotlightsAddContainer = withRouter(SpotlightsAddContainer);

export default SpotlightsAddContainer;

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'data/actions';

import PromoPanelView from './PromoPanelView';

const mapStateToProps = state => {
    return {
        ...state.get('promoPanelReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

let PromoPanelViewContainer = connect(mapStateToProps, mapDispatchToProps)(PromoPanelView);
PromoPanelViewContainer = withRouter(PromoPanelViewContainer);

export default PromoPanelViewContainer;

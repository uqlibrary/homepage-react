import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'data/actions';

import PromoPanelClone from './PromoPanelClone';

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

let PromoPanelCloneContainer = connect(mapStateToProps, mapDispatchToProps)(PromoPanelClone);
PromoPanelCloneContainer = withRouter(PromoPanelCloneContainer);

export default PromoPanelCloneContainer;

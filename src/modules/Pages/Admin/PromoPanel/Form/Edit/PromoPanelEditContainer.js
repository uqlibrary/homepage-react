import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'data/actions';

import PromoPanelEdit from './PromoPanelEdit';

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

let PromoPanelEditContainer = connect(mapStateToProps, mapDispatchToProps)(PromoPanelEdit);
PromoPanelEditContainer = withRouter(PromoPanelEditContainer);

export default PromoPanelEditContainer;

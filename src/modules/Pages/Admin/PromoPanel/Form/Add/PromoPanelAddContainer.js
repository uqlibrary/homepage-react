import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'data/actions';

import PromoPanelAdd from './PromoPanelAdd';

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

let PromoPanelAddContainer = connect(mapStateToProps, mapDispatchToProps)(PromoPanelAdd);
PromoPanelAddContainer = withRouter(PromoPanelAddContainer);

export default PromoPanelAddContainer;

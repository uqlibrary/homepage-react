import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'data/actions';

import PromoPanelList from './PromoPanelList';

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

let PromoPanelListContainer = connect(mapStateToProps, mapDispatchToProps)(PromoPanelList);
PromoPanelListContainer = withRouter(PromoPanelListContainer);

export default PromoPanelListContainer;

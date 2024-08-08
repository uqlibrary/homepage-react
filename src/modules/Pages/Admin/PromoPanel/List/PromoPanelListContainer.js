import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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

const PromoPanelListContainer = connect(mapStateToProps, mapDispatchToProps)(PromoPanelList);

export default PromoPanelListContainer;

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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

const PromoPanelCloneContainer = connect(mapStateToProps, mapDispatchToProps)(PromoPanelClone);

export default PromoPanelCloneContainer;

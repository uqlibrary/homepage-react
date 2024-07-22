import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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

const PromoPanelAddContainer = connect(mapStateToProps, mapDispatchToProps)(PromoPanelAdd);

export default PromoPanelAddContainer;

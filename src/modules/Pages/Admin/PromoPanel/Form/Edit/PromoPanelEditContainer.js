import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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

const PromoPanelEditContainer = connect(mapStateToProps, mapDispatchToProps)(PromoPanelEdit);

export default PromoPanelEditContainer;

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

import NotFound from '../components/NotFound';

const mapStateToProps = state => {
    return {
        ...state.get('accountReducer'),
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

const NotFoundContainer = connect(mapStateToProps, mapDispatchToProps)(NotFound);

export default NotFoundContainer;

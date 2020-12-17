import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'actions';

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

let NotFoundContainer = connect(mapStateToProps, mapDispatchToProps)(NotFound);
NotFoundContainer = withRouter(NotFoundContainer);

export default NotFoundContainer;

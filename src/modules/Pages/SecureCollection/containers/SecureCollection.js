import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'actions';

import SecureCollection from '../components/SecureCollection';

const mapStateToProps = state => {
    return {
        ...state.get('accountReducer'),
        ...state.get('secureCollectionReducer'),
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

let SecureCollectionContainer = connect(mapStateToProps, mapDispatchToProps)(SecureCollection);
SecureCollectionContainer = withRouter(SecureCollectionContainer);

export default SecureCollectionContainer;

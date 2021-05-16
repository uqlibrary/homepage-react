import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'actions';

import SecureCollection from '../components/SecureCollection';

const mapStateToProps = state => {
    return {
        ...state.get('accountReducer'),
        ...state.get('secureCollectionFileReducer'),
        ...state.get('secureCollectionCheckReducer'),
    };
};

function mapDispatchToProps(dispatch) {
    console.log('mapDispatchToProps');
    console.log(actions);
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}
/*
const mapDispatchToProps = dispatch => ({
    loadSecureCollectionCheck: props => dispatch(loadSecureCollectionCheck(props)),
});

 */

let SecureCollectionContainer = connect(mapStateToProps, mapDispatchToProps)(SecureCollection);
SecureCollectionContainer = withRouter(SecureCollectionContainer);

export default SecureCollectionContainer;

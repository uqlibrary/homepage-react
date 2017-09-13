import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from 'actions';
import ClaimPublication from '../components/ClaimPublication';
import {withRouter} from 'react-router-dom';

const mapStateToProps = (state) => {
    return {
        ...state.get('claimPublicationReducer'),
        account: state.get('accountReducer').account,
        author: state.get('accountReducer').author,
        accountLoading: state.get('accountReducer').accountLoading
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}


let ClaimPublicationContainer = connect(mapStateToProps, mapDispatchToProps)(ClaimPublication);
ClaimPublicationContainer = withRouter(ClaimPublicationContainer);

export default ClaimPublicationContainer;

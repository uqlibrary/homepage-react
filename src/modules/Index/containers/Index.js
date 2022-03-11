import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'actions';
import Index from '../components/Index';

const mapStateToProps = state => {
    return {
        ...state.get('accountReducer'),
        ...state.get('homeReducer'),
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

let IndexContainer = connect(mapStateToProps, mapDispatchToProps)(Index);
IndexContainer = withRouter(IndexContainer);

export default IndexContainer;

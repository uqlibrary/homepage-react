import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';
import Index from '../components/Index';

const mapStateToProps = state => {
    return {
        ...state.get('accountReducer'),
        ...state.get('drupalArticlesReducer'),
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

const IndexContainer = connect(mapStateToProps, mapDispatchToProps)(Index);

export default IndexContainer;

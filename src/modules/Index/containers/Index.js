import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'data/actions';
import Index from '../components/Index';

const mapStateToProps = state => {
    console.log('mapStateToProps');
    return {
        ...state.get('accountReducer'),
        ...state.get('accountTalisListReducer'),
        ...state.get('homeReducer'),
        ...state.get('promoPanelReducer'),
    };
};

function mapDispatchToProps(dispatch) {
    console.log('mapDispatchToProps');
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

let IndexContainer = connect(mapStateToProps, mapDispatchToProps)(Index);
IndexContainer = withRouter(IndexContainer);

export default IndexContainer;

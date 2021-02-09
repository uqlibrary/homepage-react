import { connect } from 'react-redux';
import OffSiteApp from '../components/OffSiteApp';
import { bindActionCreators } from 'redux';
import * as actions from 'actions';

const mapStateToProps = state => ({
    ...state.get('accountReducer'),
    ...state.get('chatReducer'),
});

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

const OffSiteAppContainer = connect(mapStateToProps, mapDispatchToProps)(OffSiteApp);
export default OffSiteAppContainer;

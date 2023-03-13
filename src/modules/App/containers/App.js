import { connect } from 'react-redux';
import App from '../components/App';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

const mapStateToProps = state => ({
    // ...state.get('accountReducer'),
    ...state.get('chatReducer'),
});

const mapDispatchToProps = dispatch => {
    console.log('mapDispatchToProps');
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);
export default AppContainer;

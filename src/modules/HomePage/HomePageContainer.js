import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';
import HomePage from './HomePage';

const mapStateToProps = state => {
    return {
        ...state.get('accountReducer'),
        ...state.get('homeReducer'),
        ...state.get('drupalArticlesReducer'),
        ...state.get('journalSearchReducer'),
        ...state.get('dlorStatisticsReducer'),
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

const HomePageContainer = connect(mapStateToProps, mapDispatchToProps)(HomePage);

export default HomePageContainer;

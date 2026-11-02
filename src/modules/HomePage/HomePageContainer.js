import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';
import HomePage from 'modules/HomePage/HomePage';

const mapStateToProps = state => {
    return {
        ...state.get('accountReducer'),
        ...state.get('homeReducer'),
        ...state.get('drupalArticlesReducer'),
        ...state.get('journalSearchReducer'),
        ...state.get('dlorStatisticsReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

const HomePageContainer = connect(mapStateToProps, mapDispatchToProps)(HomePage);

export default HomePageContainer;

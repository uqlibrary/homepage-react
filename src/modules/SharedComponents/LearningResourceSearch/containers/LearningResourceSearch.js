import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'data/actions';
import LearningResourceSearch from '../components/LearningResourceSearch';

const mapStateToProps = state => {
    return {
        ...state.get('learningResourceSuggestionsReducer'),
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

let LearningResourceSearchContainer = connect(mapStateToProps, mapDispatchToProps)(LearningResourceSearch);
LearningResourceSearchContainer = withRouter(LearningResourceSearchContainer);

export default LearningResourceSearchContainer;

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'actions';
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

let LearningResearchSearchContainer = connect(mapStateToProps, mapDispatchToProps)(LearningResourceSearch);
LearningResearchSearchContainer = withRouter(LearningResearchSearchContainer);

export default LearningResearchSearchContainer;

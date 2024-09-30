import { connect } from 'react-redux';
import LearningResources from './LearningResources';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

// this page can either be loaded as a general 'show me my courses'
// eg http://localhost:2020/learning-resources?user=s1111111
// or as a request to focus on a particular subject tab:
// eg http://localhost:2020/learning-resources?user=s1111111&coursecode=FREN1010&campus=St%20Lucia&semester=Semester%202%202020
// note if the user doesnt have that subject in their classes, it wont work

export const mapStateToProps = state => {
    return {
        ...state.get('readingListReducer'),
        ...state.get('examLearningResourceReducer'),
        ...state.get('guidesReducer'),
        ...state.get('learningResourceReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

const LearningResourcesContainer = connect(mapStateToProps, mapDispatchToProps)(LearningResources);

export default LearningResourcesContainer;

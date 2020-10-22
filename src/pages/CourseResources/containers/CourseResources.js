import { connect } from 'react-redux';
import CourseResources from '../components/CourseResources';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'actions';

export const mapStateToProps = state => {
    return {
        ...state.get('readingListReducer'),
        ...state.get('guidesReducer'),
        ...state.get('learningResourceReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

let CourseResourcesContainer = connect(mapStateToProps, mapDispatchToProps)(CourseResources);
CourseResourcesContainer = withRouter(CourseResourcesContainer);

export default CourseResourcesContainer;

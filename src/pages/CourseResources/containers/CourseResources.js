import { connect } from 'react-redux';
import CourseResources from '../components/CourseResources';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'actions';

export const mapStateToProps = (state, ownProps) => {
    console.log('mapStateToProps, ownProps = ', ownProps);
    console.log('mapStateToProps, state = ', state);
    // const { currentclasses } = state.get('accountReducer') || {};
    // console.log('currentclasses = ', currentclasses);
    return {
        ...state.get('readingListReducer'),
        ...state.get('guidesReducer'),
        ...state.get('learningResourceReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    console.log('mapDispatchToProps: actions = ', actions);
    console.log('mapDispatchToProps: dispatch = ', dispatch);
    // const { learningResourceReducer, guidesReducer, readingListReducer } = bindActionCreators(actions, dispatch);
    return {
        // learningResourceReducer,
        // guidesReducer,
        // readingListReducer,
        actions: bindActionCreators(actions, dispatch),
    };
};

let CourseResourcesContainer = connect(mapStateToProps, mapDispatchToProps)(CourseResources);
CourseResourcesContainer = withRouter(CourseResourcesContainer);

export default CourseResourcesContainer;

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'actions';
import CourseResourceSearch from '../components/CourseResourceSearch';

const mapStateToProps = state => {
    return {
        ...state.get('primoReducer'),
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

let CourseResearchSearchContainer = connect(mapStateToProps, mapDispatchToProps)(CourseResourceSearch);
CourseResearchSearchContainer = withRouter(CourseResearchSearchContainer);

export default CourseResearchSearchContainer;

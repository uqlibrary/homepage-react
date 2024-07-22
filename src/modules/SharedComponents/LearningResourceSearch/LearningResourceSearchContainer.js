import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';
import LearningResourceSearch from './LearningResourceSearch';

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

const LearningResourceSearchContainer = connect(mapStateToProps, mapDispatchToProps)(LearningResourceSearch);

export default LearningResourceSearchContainer;

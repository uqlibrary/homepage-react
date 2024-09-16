import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';
import SubjectSearchDropdown from './SubjectSearchDropdown';

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

const SubjectSearchDropdownContainer = connect(mapStateToProps, mapDispatchToProps)(SubjectSearchDropdown);

export default SubjectSearchDropdownContainer;

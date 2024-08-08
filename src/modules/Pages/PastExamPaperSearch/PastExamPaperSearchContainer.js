import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

import PastExamPaperSearch from './PastExamPaperSearch';

const mapStateToProps = state => {
    return {
        ...state.get('examSuggestionReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

const PastExamPaperSearchContainer = connect(mapStateToProps, mapDispatchToProps)(PastExamPaperSearch);

export default PastExamPaperSearchContainer;

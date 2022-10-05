import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
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

let PastExamPaperSearchContainer = connect(mapStateToProps, mapDispatchToProps)(PastExamPaperSearch);
PastExamPaperSearchContainer = withRouter(PastExamPaperSearchContainer);

export default PastExamPaperSearchContainer;

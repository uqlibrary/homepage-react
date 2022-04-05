import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'actions';

import PastExamPaperList from './PastExamPaperList';

const mapStateToProps = state => {
    return {
        ...state.get('examSearchReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

let PastExamPaperListContainer = connect(mapStateToProps, mapDispatchToProps)(PastExamPaperList);
PastExamPaperListContainer = withRouter(PastExamPaperListContainer);

export default PastExamPaperListContainer;

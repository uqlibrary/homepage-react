import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

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

const PastExamPaperListContainer = connect(mapStateToProps, mapDispatchToProps)(PastExamPaperList);

export default PastExamPaperListContainer;

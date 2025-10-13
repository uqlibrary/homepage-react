import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

import DLOVocabularyManage from './dlorVocabularyManage'

const mapStateToProps = state => {
    return {
        ...state.get('accountReducer'),
        ...state.get('dlorKeywordsReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

const DLOVocabularyManageContainer = connect(mapStateToProps, mapDispatchToProps)(DLOVocabularyManage);

export default DLOVocabularyManageContainer;

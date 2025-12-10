import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

import DLOBulkSchedule from './DLOBulkSchedule';

const mapStateToProps = state => {
    return {
        ...state.get('accountReducer'),
        ...state.get('dlorListReducer'),
        // ... state.get('dlorFileTypeListReducer'),
        ...state.get('dlorFilterListReducer'),
        // ...state.get('dlorTeamListReducer'),
        ...state.get('dlorCreateReducer'),
        ...state.get('dlorKeywordsReducer'),
        ...state.get('dlorScheduleReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

const DLOBulkScheduleContainer = connect(mapStateToProps, mapDispatchToProps)(DLOBulkSchedule);

export default DLOBulkScheduleContainer;

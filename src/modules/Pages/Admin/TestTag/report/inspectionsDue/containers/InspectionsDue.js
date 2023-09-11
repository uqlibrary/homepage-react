import { connect } from 'react-redux';
import InspectionsDue from '../components/InspectionsDue';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';
import { withUser } from '../../../helpers/withUser';

export const mapStateToProps = state => {
    return {
        ...state.get('testTagInspectionsDueReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

let InspectionsDueContainer = connect(mapStateToProps, mapDispatchToProps)(InspectionsDue);
InspectionsDueContainer = withRouter(InspectionsDueContainer);
InspectionsDueContainer = withUser(InspectionsDueContainer);

export default InspectionsDueContainer;

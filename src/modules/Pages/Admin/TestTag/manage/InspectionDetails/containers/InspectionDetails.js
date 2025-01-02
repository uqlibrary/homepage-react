import { connect } from 'react-redux';
import InspectionDetails from '../components/InspectionDetails';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';
import { withUser } from '../../../helpers/withUser';

export const mapStateToProps = state => {
    return {
        ...state.get('testTagAssetsReducer'),
        ...state.get('testTagInspectionDetailsUpdateReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

let InspectionDetailsContainer = connect(mapStateToProps, mapDispatchToProps)(InspectionDetails);
InspectionDetailsContainer = withUser(InspectionDetailsContainer);

export default InspectionDetailsContainer;

import { connect } from 'react-redux';
import InspectionsByLicencedUser from '../components/InspectionsByLicencedUser';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'data/actions';
import { withUser } from '../../../helpers/withUser';

export const mapStateToProps = state => {
    return {
        ...state.get('testTagInspectionsByLicencedUserReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

let InspectionsByLicencedUserContainer = connect(mapStateToProps, mapDispatchToProps)(InspectionsByLicencedUser);
InspectionsByLicencedUserContainer = withRouter(InspectionsByLicencedUserContainer);
InspectionsByLicencedUserContainer = withUser(InspectionsByLicencedUserContainer);

export default InspectionsByLicencedUserContainer;

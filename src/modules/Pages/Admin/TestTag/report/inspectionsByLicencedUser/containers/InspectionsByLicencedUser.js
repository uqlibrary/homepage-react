import { connect } from 'react-redux';
import InspectionsByLicencedUser from '../components/InspectionsByLicencedUser';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'data/actions';

export const mapStateToProps = state => {
    return {
        ...state.get('testTagInspectionsByLicencedUser'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

let InspectionsByLicencedUserContainer = connect(mapStateToProps, mapDispatchToProps)(InspectionsByLicencedUser);
InspectionsByLicencedUserContainer = withRouter(InspectionsByLicencedUserContainer);

export default InspectionsByLicencedUserContainer;

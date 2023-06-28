import { connect } from 'react-redux';
import InspectionDevices from '../components/InspectionDevices';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'data/actions';
import locale from '../../../testTag.locale';

export const mapStateToProps = state => {
    return {
        ...state.get('testTagInspectionDevicesReducer'),
        pageLocale: locale.pages.manage.inspectiondevices,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

let InspectionDevicesContainer = connect(mapStateToProps, mapDispatchToProps)(InspectionDevices);
InspectionDevicesContainer = withRouter(InspectionDevicesContainer);

export default InspectionDevicesContainer;

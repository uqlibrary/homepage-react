import { connect } from 'react-redux';
import InspectionDevices from '../components/InspectionDevices';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'data/actions';
import locale from '../../../testTag.locale';
import config from '../components/config';
import { PERMISSIONS } from '../../../config/auth';

export const mapStateToProps = state => {
    const componentId = 'inspection-devices';
    const componentIdLower = 'inspection_devices';

    return {
        ...state.get('testTagInspectionDevicesReducer'),
        config,
        pageLocale: locale.pages.manage.inspectiondevices,
        componentId,
        componentIdLower,
        requiredPermissions: [PERMISSIONS.can_inspect, PERMISSIONS.can_alter],
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

import { connect } from 'react-redux';
import InspectionDevices from '../components/InspectionDevices';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'data/actions';
import locale from '../../../testTag.locale';
import config from '../components/config';

export const mapStateToProps = state => {
    const componentId = 'inspection-devices';
    const componentIdLower = 'inspection_devices';

    // special case to set sortable, as this component
    // is also used for a report. Reports require
    // sortable, but manage pages don't.
    Object.keys(config.fields).forEach(key => {
        config.fields[key].fieldParams.sortable = false;
    });

    return {
        ...state.get('testTagInspectionDevicesReducer'),
        config,
        pageLocale: locale.pages.manage.inspectiondevices,
        componentId,
        componentIdLower,
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

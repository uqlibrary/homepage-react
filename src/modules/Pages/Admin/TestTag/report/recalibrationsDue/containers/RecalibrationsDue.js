import { connect } from 'react-redux';
import InspectionDevices from '../../../manage/InspectionDevices/components/InspectionDevices';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';
import locale from '../../../testTag.locale';
import config from '../../../manage/InspectionDevices/components/config';

export const mapStateToProps = state => {
    const componentId = 'recalibrations-due';
    const componentIdLower = 'recalibrations-due';

    // special case to set sortable, as this component
    // reuses the InspectionDevices component. Reports require
    // sortable, but manage pages don't.
    Object.keys(config.fields).forEach(key => {
        config.fields[key].fieldParams.sortable = true;
    });

    return {
        ...state.get('testTagInspectionDevicesReducer'),
        canManage: false,
        pageLocale: locale.pages.report.recalibrationsDue,
        config,
        componentId,
        componentIdLower,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

let RecalibrationsDue = connect(mapStateToProps, mapDispatchToProps)(InspectionDevices);
RecalibrationsDue = withRouter(RecalibrationsDue);

export default RecalibrationsDue;

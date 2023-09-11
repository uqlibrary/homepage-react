import { connect } from 'react-redux';
import InspectionDevices from '../../../manage/InspectionDevices/components/InspectionDevices';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';
import locale from '../../../testTag.locale';
import config from '../../../manage/InspectionDevices/components/config';
import { PERMISSIONS } from '../../../config/auth';
import { withUser } from '../../../helpers/withUser';

export const mapStateToProps = state => {
    const componentId = 'recalibrations-due';
    const componentIdLower = 'recalibrations-due';

    return {
        ...state.get('testTagInspectionDevicesReducer'),
        canManage: false,
        pageLocale: locale.pages.report.recalibrationsDue,
        config,
        componentId,
        componentIdLower,
        requiredPermissions: [PERMISSIONS.can_see_reports],
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

let RecalibrationsDue = connect(mapStateToProps, mapDispatchToProps)(InspectionDevices);
RecalibrationsDue = withRouter(RecalibrationsDue);
RecalibrationsDue = withUser(RecalibrationsDue);

export default RecalibrationsDue;

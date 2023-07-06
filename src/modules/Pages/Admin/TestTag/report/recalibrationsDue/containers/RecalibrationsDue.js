import { connect } from 'react-redux';
import InspectionDevices from '../../../manage/InspectionDevices/components/InspectionDevices';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';
import locale from '../../../testTag.locale';

export const mapStateToProps = state => {
    const componentId = 'recalibrations-due';
    const componentIdLower = 'recalibrations-due';

    return {
        ...state.get('testTagInspectionDevicesReducer'),
        canManage: false,
        pageLocale: locale.pages.report.recalibrationsDue,
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

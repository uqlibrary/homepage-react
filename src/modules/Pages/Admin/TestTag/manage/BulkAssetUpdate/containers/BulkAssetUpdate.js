import { connect } from 'react-redux';
import BulkAssetUpdate from '../components/BulkAssetUpdate';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';
import { withUser } from '../../../helpers/withUser';
import config from '../components/config';

const DEFAULT_FORM_VALUES = {
    asset_list: [],
    hasLocation: true,
    hasDiscardStatus: false,
    hasAssetType: false,
    hasAssetStatus: false,
    location: undefined,
    fullLocation: undefined,
    asset_type: undefined,
    discard_reason: undefined,
    asset_status: undefined,
    hasClearNotes: false,
    monthRange: config.defaults.monthsPeriod || '-1',
};

export const mapStateToProps = () => {
    return {
        defaultFormValues: DEFAULT_FORM_VALUES,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

let BulkAssetUpdateContainer = connect(mapStateToProps, mapDispatchToProps)(BulkAssetUpdate);
BulkAssetUpdateContainer = withUser(BulkAssetUpdateContainer);

export default BulkAssetUpdateContainer;

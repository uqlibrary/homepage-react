import { connect } from 'react-redux';
import BulkAssetUpdate from '../components/BulkAssetUpdate';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

const DEFAULT_FORM_VALUES = {
    asset_list: [],
    hasLocation: false,
    hasStatus: false,
    hasAssetType: false,
    location: undefined,
    asset_type: undefined,
    asset_status: undefined,
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
BulkAssetUpdateContainer = withRouter(BulkAssetUpdateContainer);

export default BulkAssetUpdateContainer;

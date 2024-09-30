import { connect } from 'react-redux';
import BulkAssetUpdate from '../components/BulkAssetUpdate';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';
import { withUser } from '../../../helpers/withUser';

const DEFAULT_FORM_VALUES = {
    asset_list: [],
    hasLocation: false,
    hasDiscardStatus: false,
    hasAssetType: false,
    location: undefined,
    asset_type: undefined,
    discard_reason: undefined,
    hasClearNotes: false,
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

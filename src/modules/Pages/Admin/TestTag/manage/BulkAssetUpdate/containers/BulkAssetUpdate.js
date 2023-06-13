import { connect } from 'react-redux';
import BulkAssetUpdate from '../components/BulkAssetUpdate';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'data/actions';

export const mapStateToProps = state => {
    return {
        ...state.get('testTagOnLoadLocationsReducer'),
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

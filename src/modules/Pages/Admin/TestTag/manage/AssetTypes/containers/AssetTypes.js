import { connect } from 'react-redux';
import AssetTypes from '../components/AssetTypes';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'data/actions';
import { withUser } from '../../../helpers/withUser';

export const mapStateToProps = state => {
    return {
        ...state.get('testTagAssetTypesReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

let AssetTypesContainer = connect(mapStateToProps, mapDispatchToProps)(AssetTypes);
AssetTypesContainer = withRouter(AssetTypesContainer);
AssetTypesContainer = withUser(AssetTypesContainer);

export default AssetTypesContainer;

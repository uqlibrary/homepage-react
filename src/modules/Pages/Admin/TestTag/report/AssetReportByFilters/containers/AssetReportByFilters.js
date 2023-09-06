import { connect } from 'react-redux';
import AssetReportByFilters from '../components/AssetReportByFilters';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'data/actions';

export const mapStateToProps = state => {
    return {
        ...state.get('testTagAssetsByFiltersReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

let AssetReportByFiltersContainer = connect(mapStateToProps, mapDispatchToProps)(AssetReportByFilters);
AssetReportByFiltersContainer = withRouter(AssetReportByFiltersContainer);

export default AssetReportByFiltersContainer;

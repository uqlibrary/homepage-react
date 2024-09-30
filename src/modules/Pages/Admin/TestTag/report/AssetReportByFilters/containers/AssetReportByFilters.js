import { connect } from 'react-redux';
import AssetReportByFilters from '../components/AssetReportByFilters';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';
import { withUser } from '../../../helpers/withUser';

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
AssetReportByFiltersContainer = withUser(AssetReportByFiltersContainer);

export default AssetReportByFiltersContainer;

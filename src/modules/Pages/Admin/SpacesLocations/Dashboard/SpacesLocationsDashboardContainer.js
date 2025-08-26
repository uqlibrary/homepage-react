import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

import SpacesLocationsDashboard from './SpacesLocationsDashboard';

const mapStateToProps = state => {
    return {
        ...state.get('locationSpacesReducer'),
        ...state.get('weeklyHoursReducer'),
        ...state.get('facilityTypeReducer'),
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

const SpacesLocationsDashboardContainer = connect(mapStateToProps, mapDispatchToProps)(SpacesLocationsDashboard);

export default SpacesLocationsDashboardContainer;

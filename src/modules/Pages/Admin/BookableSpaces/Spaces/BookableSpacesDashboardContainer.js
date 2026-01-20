import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

import BookableSpacesDashboard from './BookableSpacesDashboard';

const mapStateToProps = state => {
    return {
        ...state.get('bookableSpacesRoomListReducer'),
        ...state.get('weeklyHoursReducer'),
        ...state.get('bookablespacesFacilityTypeReducer'),
        ...state.get('bookableSpaceLocationReducer'),
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

const BookableSpacesDashboardContainer = connect(mapStateToProps, mapDispatchToProps)(BookableSpacesDashboard);

export default BookableSpacesDashboardContainer;

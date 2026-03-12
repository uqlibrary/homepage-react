import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

import BookableSpacesManageSpaceTypes from './BookableSpacesManageSpaceTypes';

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

const BookableSpacesManageSpaceTypesContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(BookableSpacesManageSpaceTypes);

export default BookableSpacesManageSpaceTypesContainer;

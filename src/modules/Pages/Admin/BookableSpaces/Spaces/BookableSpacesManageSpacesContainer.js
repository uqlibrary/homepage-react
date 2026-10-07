import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

import BookableSpacesManageSpaces from './BookableSpacesManageSpaces';

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

const BookableSpacesManageSpacesContainer = connect(mapStateToProps, mapDispatchToProps)(BookableSpacesManageSpaces);

export default BookableSpacesManageSpacesContainer;

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

import BookableSpacesList from 'modules/Pages/BookableSpaces/BookableSpacesList';

const mapStateToProps = state => {
    return {
        ...state.get('bookableSpacesRoomListReducer'),
        ...state.get('weeklyHoursReducer'),
        ...state.get('bookablespacesFacilityTypeReducer'),
        ...state.get('bookableSpacesFavouritesReducer'),
        ...state.get('drupalArticlesReducer'),
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

const BookableSpacesListContainer = connect(mapStateToProps, mapDispatchToProps)(BookableSpacesList);

export default BookableSpacesListContainer;

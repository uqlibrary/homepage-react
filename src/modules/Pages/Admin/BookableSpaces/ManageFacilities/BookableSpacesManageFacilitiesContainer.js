import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

import BookableSpacesManageFacilities from './BookableSpacesManageFacilities';

const mapStateToProps = state => {
    return {
        ...state.get('bookablespacesFacilityTypeReducer'),
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

const BookableSpacesManageFacilitiesContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(BookableSpacesManageFacilities);

export default BookableSpacesManageFacilitiesContainer;

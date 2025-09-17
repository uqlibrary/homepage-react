import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

import BookableSpacesManageLocations from './BookableSpacesManageLocations';

const mapStateToProps = state => {
    return {
        ...state.get('bookableSpaceLocationReducer'),
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

const BookableSpacesManageLocationsContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(BookableSpacesManageLocations);

export default BookableSpacesManageLocationsContainer;

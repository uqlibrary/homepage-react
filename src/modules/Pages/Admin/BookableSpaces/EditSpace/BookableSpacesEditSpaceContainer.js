import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

import BookableSpacesEditSpace from './BookableSpacesEditSpace';

const mapStateToProps = state => {
    return {
        ...state.get('bookableSpacesRoomListReducer'),
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

const BookableSpacesEditSpaceContainer = connect(mapStateToProps, mapDispatchToProps)(BookableSpacesEditSpace);

export default BookableSpacesEditSpaceContainer;

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

import BookableSpacesAddSpace from './BookableSpacesAddSpace';

const mapStateToProps = state => {
    return {
        ...state.get('bookableSpacesRoomListReducer'),
        ...state.get('bookableSpaceLocationReducer'),
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

const BookableSpacesAddSpaceContainer = connect(mapStateToProps, mapDispatchToProps)(BookableSpacesAddSpace);

export default BookableSpacesAddSpaceContainer;

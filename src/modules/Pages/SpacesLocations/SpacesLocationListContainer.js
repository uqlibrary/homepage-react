import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';

import LocationSpaceList from './SpacesLocationList';

const mapStateToProps = state => {
    return {
        ...state.get('locationSpacesReducer'),
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

const SpacesLocationListContainer = connect(mapStateToProps, mapDispatchToProps)(LocationSpaceList);

export default SpacesLocationListContainer;

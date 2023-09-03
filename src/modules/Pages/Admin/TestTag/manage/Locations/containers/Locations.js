import { connect } from 'react-redux';
import Locations from '../components/Locations';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'data/actions';

export const mapStateToProps = state => {
    return {
        ...state.get('testTagOnLoadLocationsReducer'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

let LocationsContainer = connect(mapStateToProps, mapDispatchToProps)(Locations);
LocationsContainer = withRouter(LocationsContainer);

export default LocationsContainer;

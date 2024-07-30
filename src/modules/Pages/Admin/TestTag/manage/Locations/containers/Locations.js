import { connect } from 'react-redux';
import Locations from '../components/Locations';
import { bindActionCreators } from 'redux';
import * as actions from 'data/actions';
import { withUser } from '../../../helpers/withUser';

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
LocationsContainer = withUser(LocationsContainer);

export default LocationsContainer;

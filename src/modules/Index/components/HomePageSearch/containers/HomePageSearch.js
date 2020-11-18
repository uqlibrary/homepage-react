import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'actions';
import HomePageSearch from '../components/HomePageSearch';

const mapStateToProps = state => {
    return {
        ...state.get('primoReducer'),
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

let HomePageSearchContainer = connect(mapStateToProps, mapDispatchToProps)(HomePageSearch);
HomePageSearchContainer = withRouter(HomePageSearchContainer);

export default HomePageSearchContainer;

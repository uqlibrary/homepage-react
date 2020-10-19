import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'actions';
import PrimoSearch from '../components/PrimoSearch';

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

let PrimoSearchContainer = connect(mapStateToProps, mapDispatchToProps)(PrimoSearch);
PrimoSearchContainer = withRouter(PrimoSearchContainer);

export default PrimoSearchContainer;

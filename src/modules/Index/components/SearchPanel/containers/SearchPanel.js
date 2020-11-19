import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'actions';
import SearchPanel from '../components/SearchPanel';

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

let SearchPanelContainer = connect(mapStateToProps, mapDispatchToProps)(SearchPanel);
SearchPanelContainer = withRouter(SearchPanelContainer);

export default SearchPanelContainer;

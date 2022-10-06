import { combineReducers } from 'redux-immutable';
import { connectRouter } from 'connected-react-router/immutable';
import { history } from 'config/history';

import * as reducers from 'data/reducers';

const rootReducer = combineReducers({
    router: connectRouter(history),
    ...reducers,
});

export default rootReducer;

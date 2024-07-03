import { combineReducers } from 'redux-immutable';

import * as reducers from 'data/reducers';

const rootReducer = combineReducers({
    ...reducers,
});

export default rootReducer;

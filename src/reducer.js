import * as reducers from 'data/reducers';
// import { combineReducers } from 'redux-immutable'; // https://www.npmjs.com/package/redux-immutable

// replace redux-immutable with local version until redux-immutable uses Immutable >= 5.1.8 (hasn't updated since 2022 - not going to happen!!)
import { isCollection, Map } from 'immutable';

const getStateName = action => {
    return action && action.type === '@@redux/INIT'
        ? 'initialState argument passed to createStore'
        : 'previous state received by the reducer';
};
const validateNextState = (nextState, reducerName, action) => {
    if (nextState === undefined) {
        throw new Error(
            `Reducer "${reducerName}" returned undefined when handling "${action.type}" action. To ignore an action, you must explicitly return the previous state.`,
        );
    }
};
const getUnexpectedInvocationParameterMessage = (state, reducers, action) => {
    const reducerNames = Object.keys(reducers);

    if (!reducerNames.length) {
        return 'Store does not have a valid reducer. Make sure the argument passed to combineReducers is an object whose values are reducers.';
    }

    const stateName = getStateName(action);

    if (!isCollection(state)) {
        return `The ${stateName} is of unexpected type. Expected argument to be an instance of Immutable.Collection or Immutable.Record with the following properties: "${reducerNames.join('", "')}".`;
    }

    const unexpectedStatePropertyNames = state
        .toSeq()
        .keySeq()
        .toArray()
        .filter(name => {
            return !reducers.hasOwnProperty(name);
        });

    if (unexpectedStatePropertyNames.length > 0) {
        const property = unexpectedStatePropertyNames.length === 1 ? 'property' : 'properties';
        return `Unexpected ${property} "${unexpectedStatePropertyNames.join('", "')}" found in ${stateName}. Expected to find one of the known reducer property names instead: "${reducerNames.join('", "')}". Unexpected properties will be ignored.`;
    }

    return null;
};

// const combineReducers = reducers => {
//     const getDefaultState = Map();
const combineReducers = (reducers, getDefaultState = Map()) => {
    const reducerKeys = Object.keys(reducers);

    return (inputState = getDefaultState(), action) => {
        if (process.env.NODE_ENV !== 'production') {
            const warningMessage = getUnexpectedInvocationParameterMessage(inputState, reducers, action);

            if (warningMessage) {
                console.error(warningMessage);
            }
        }

        return inputState.withMutations(temporaryState => {
            for (const reducerName of reducerKeys) {
                const reducer = reducers[reducerName];
                const currentDomainState = temporaryState.get(reducerName);
                const nextDomainState = reducer(currentDomainState, action);

                validateNextState(nextDomainState, reducerName, action);

                temporaryState.set(reducerName, nextDomainState);
            }
        });
    };
};
// end replace redux-immutable

const rootReducer = combineReducers({
    ...reducers,
});

export default rootReducer;

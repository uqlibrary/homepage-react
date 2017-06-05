import Immutable from 'immutable';

import {ADD_AUTHOR, REMOVE_AUTHOR, CLEAR_AUTHORS} from './actions';

// Immutable state
const initialState = Immutable.fromJS({
    selectedAuthors: {}
});

const authorsReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_AUTHOR:
            let updatedAuthorsList = Immutable.Set(state.get('selectedAuthors'));
            const foundAuthor = action.payload;

            console.log('is here', updatedAuthorsList, updatedAuthorsList.has(foundAuthor.id));

            if (!updatedAuthorsList.has(foundAuthor.id)) {
                updatedAuthorsList = updatedAuthorsList.union([Immutable.Map(Immutable.fromJS(foundAuthor))]);
            }

            return state.set('selectedAuthors', Immutable.fromJS(updatedAuthorsList));
        case REMOVE_AUTHOR:
            const removeFromAuthorList = state.get('selectedAuthors').filter(author => {
                return author.get('id') !== action.payload;
            });
            return state.set('selectedAuthors', Immutable.fromJS(removeFromAuthorList));
        case CLEAR_AUTHORS:
            return state.set('selectedAuthors', Immutable.fromJS(action.payload));
        default:
            return state;
    }
};

export default authorsReducer;

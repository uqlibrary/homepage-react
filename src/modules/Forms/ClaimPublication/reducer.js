import Immutable from 'immutable';

import {PUBLICATION_SELECTED, PUBLICATION_SELECTED_CLEARED, PUBLICATION_RESULTS_CLEARED, USERS_PUBLICATIONS_LOADED} from './actions';
import {DOI_SEARCH_COMPLETED, PUBMED_SEARCH_COMPLETED, TITLE_SEARCH_COMPLETED} from '../PublicationSearch/actions';
import {USER_PUBLICATIONS_MARKED_NOT_MINE_COMPLETED} from '../../ClaimPublication/actions';

import {locale} from '../../../config';

// Immutable state
export const initialState = Immutable.fromJS({
    claimPublicationResults: {},
    selectedPublication: {}
});

const claimPublicationsReducer = (state = initialState, action) => {
    switch (action.type) {
        case PUBLICATION_SELECTED:
            const entry = state.get('claimPublicationResults').find(entry => {
                return entry.get('rek_pid') === action.payload;
            });

            return state.set('selectedPublication', Immutable.fromJS(entry));
        case USERS_PUBLICATIONS_LOADED:
        case DOI_SEARCH_COMPLETED:
        case PUBMED_SEARCH_COMPLETED:
        case TITLE_SEARCH_COMPLETED:
        case PUBLICATION_RESULTS_CLEARED:
            return state.set('claimPublicationResults', Immutable.fromJS(action.payload));
        case PUBLICATION_SELECTED_CLEARED:
            return state.set('selectedPublication', Immutable.fromJS(action.payload));
        case USER_PUBLICATIONS_MARKED_NOT_MINE_COMPLETED:
            const updatedState = state.get('claimPublicationResults').filter((item, index) => {
                return index >= locale.pages.claimPublications.maxSearchResults;
            });
            return state.set('claimPublicationResults', Immutable.fromJS(updatedState));
        default:
            return state;
    }
};

export default claimPublicationsReducer;

import React from 'react';
import { rtlRender, WithRouter, WithReduxStore } from 'test-utils';
import Immutable from 'immutable';


import { default as bookableSpaces_all } from 'data/mock/data/records/bookableSpaces/bookableSpaces_all';
import { BookableSpacesDetailPage } from './BookableSpacesDetailPage';

const defaultState = {
    bookableSpacesRoomListReducer: {
        bookableSpaceGetResult: bookableSpaces_all.data.locations.find(s => s.space_id === 1),
        bookableSpaceGetting: false,
        bookableSpaceGetError: null,
    },
};

function setup(testProps = {}, renderer = rtlRender) {
    const { state = {}, ...props } = testProps;
    const _state = {
        ...defaultState,
        ...state,
    };
    return renderer(
        <WithReduxStore initialState={Immutable.Map(_state)}>
            <WithRouter>
                <BookableSpacesDetailPage {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('Spaces Detail', () => {
    it('shows loading indicator when space is loading', () => {
        const { getByRole } = setup({
            state: {
                bookableSpacesRoomListReducer: {
                    bookableSpaceGetting: true,
                    bookableSpaceGetError: false,
                    bookableSpaceGetResult: null,
                },
            },
        });
        expect(getByRole('progressbar')).toBeInTheDocument();
    });
});

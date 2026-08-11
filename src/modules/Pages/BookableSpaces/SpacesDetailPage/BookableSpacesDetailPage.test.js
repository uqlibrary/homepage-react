import React from 'react';
import { rtlRender, WithRouter, userEvent, waitFor, WithReduxStore } from 'test-utils';
import Immutable from 'immutable';

import locale from '../../../testTag.locale';
import userData from '../../../../../../../data/mock/data/testing/testAndTag/testTagUser';

import PrinterTemplates from './PrinterTemplates';
import bookableSpacesList from '../../../../../../../data/mock/data/records/bookableSpaces/bookableSpaces_all';
import { transformRow } from './utils';
import { BookableSpacesDetailPage } from './BookableSpacesDetailPage';

const defaultState = {
    bookableSpacesRoomListReducer: {
        bookableSpaceGetResult: bookableSpacesList.data.find(s => s.space_id === 1),
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

describe('PrinterTemplates', () => {
    it('shows loading indicator when list is loading', () => {
        const { getByRole } = setup({
            state: {
                testTagPrinterTemplateReducer: {
                    printerTemplateList: [],
                    printerTemplateListLoading: true,
                    printerTemplateListError: null,
                },
            },
        });
        expect(getByRole('progressbar')).toBeInTheDocument();
    });
});

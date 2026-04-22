import * as actions from './actionTypes';
import * as repositories from 'repositories';
import {
    createBookableSpaceOutage,
    deleteBookableSpaceOutage,
    loadBookableSpaceOutages,
    updateBookableSpaceOutage,
} from './bookableSpacesActions';

jest.mock('@sentry/browser');

describe('Bookable spaces outage action creators', () => {
    const MockDate = require('mockdate');

    beforeEach(() => {
        MockDate.set('2020-01-01T00:00:00.000Z', 10);
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
        mockSessionApi = setupSessionMockAdapter();
    });

    afterEach(() => {
        MockDate.reset();
        mockApi.reset();
        mockSessionApi.reset();
    });

    it('loads a space outage list', async () => {
        mockApi.onGet(repositories.routes.SPACES_OUTAGES_API({ spaceId: 123 }).apiUrl).reply(200, {
            data: [],
        });

        const expectedActions = [actions.SPACES_OUTAGE_LIST_LOADING, actions.SPACES_OUTAGE_LIST_LOADED];

        await mockActionsStore.dispatch(loadBookableSpaceOutages(123));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('creates a space outage', async () => {
        mockApi.onPost(repositories.routes.SPACES_OUTAGES_API({ spaceId: 123 }).apiUrl).reply(200, { status: 'OK' });

        const expectedActions = [actions.SPACES_OUTAGE_ADDING, actions.SPACES_OUTAGE_ADDED];

        await mockActionsStore.dispatch(
            createBookableSpaceOutage({
                space_id: 123,
                space_outage_start: '2026-04-22 11:00:00',
                space_outage_end: '2026-04-22 12:00:00',
            }),
        );
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('updates a space outage', async () => {
        mockApi.onPut(repositories.routes.SPACES_OUTAGE_API({ id: 456 }).apiUrl).reply(200, { status: 'OK' });

        const expectedActions = [actions.SPACES_OUTAGE_UPDATING, actions.SPACES_OUTAGE_UPDATED];

        await mockActionsStore.dispatch(
            updateBookableSpaceOutage(
                {
                    space_id: 123,
                    space_outage_start: '2026-04-22 11:00:00',
                    space_outage_end: '2026-04-22 12:00:00',
                },
                456,
            ),
        );
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('deletes a space outage', async () => {
        mockApi.onDelete(repositories.routes.SPACES_OUTAGE_API({ id: 456 }).apiUrl).reply(200, { status: 'OK' });

        const expectedActions = [actions.SPACES_OUTAGE_DELETING, actions.SPACES_OUTAGE_DELETED];

        await mockActionsStore.dispatch(deleteBookableSpaceOutage(456));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
});
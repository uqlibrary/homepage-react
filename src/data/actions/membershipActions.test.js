import * as actions from './actionTypes';
import * as repositories from 'repositories';
import {
    checkIsRenewing,
    clearMembership,
    loadMembership,
    loadMembershipFormData,
    saveMembershipPayment,
    submitMembership,
} from './membershipActions';

describe('Membership actions', () => {
    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    describe('loadMembershipFormData', () => {
        it('dispatches expected actions when the form data loads', async () => {
            mockApi.onGet(repositories.routes.MEMBERSHIP_FORM_DATA_API().apiUrl).reply(200, { account_types: [] });

            await mockActionsStore.dispatch(loadMembershipFormData());

            expect(mockActionsStore.getActions()).toHaveDispatchedActions([
                actions.MEMBERSHIP_FORM_DATA_LOADING,
                actions.MEMBERSHIP_FORM_DATA_LOADED,
            ]);
        });

        it('dispatches expected actions when the form data call fails', async () => {
            mockApi.onGet(repositories.routes.MEMBERSHIP_FORM_DATA_API().apiUrl).reply(404);

            await mockActionsStore.dispatch(loadMembershipFormData());

            expect(mockActionsStore.getActions()).toHaveDispatchedActions([
                actions.MEMBERSHIP_FORM_DATA_LOADING,
                actions.MEMBERSHIP_FORM_DATA_FAILED,
            ]);
        });
    });

    describe('checkIsRenewing', () => {
        it('dispatches expected actions when the check succeeds', async () => {
            mockApi
                .onGet(repositories.routes.MEMBERSHIP_CHECK_RENEWING_API().apiUrl)
                .reply(200, { renewing: true, type: 'hospital', id: 'abc-123', renewal_code: 'the-code' });

            await mockActionsStore.dispatch(checkIsRenewing());

            expect(mockActionsStore.getActions()).toHaveDispatchedActions([
                actions.MEMBERSHIP_RENEWING_LOADING,
                actions.MEMBERSHIP_RENEWING_LOADED,
            ]);
        });

        it('dispatches expected actions when the check fails', async () => {
            mockApi.onGet(repositories.routes.MEMBERSHIP_CHECK_RENEWING_API().apiUrl).reply(404);

            await mockActionsStore.dispatch(checkIsRenewing());

            expect(mockActionsStore.getActions()).toHaveDispatchedActions([
                actions.MEMBERSHIP_RENEWING_LOADING,
                actions.MEMBERSHIP_RENEWING_FAILED,
            ]);
        });
    });

    describe('submitMembership', () => {
        it('dispatches saving then saved, and resolves with the saved record', async () => {
            const saved = { id: 'abc-123', type: 'community', status: 'unconfirmed' };
            mockApi.onPost(repositories.routes.MEMBERSHIP_CREATE_API().apiUrl).reply(201, saved);

            const result = await mockActionsStore.dispatch(submitMembership({ type: 'community' }));

            expect(result).toEqual(saved);
            expect(mockActionsStore.getActions()).toHaveDispatchedActions([
                actions.MEMBERSHIP_SAVING,
                actions.MEMBERSHIP_SAVED,
            ]);
        });

        it('dispatches save failed and rejects when the submission fails', async () => {
            mockApi.onPost(repositories.routes.MEMBERSHIP_CREATE_API().apiUrl).reply(422);

            await expect(mockActionsStore.dispatch(submitMembership({ type: 'community' }))).rejects.toBeDefined();

            expect(mockActionsStore.getActions()).toHaveDispatchedActions([
                actions.MEMBERSHIP_SAVING,
                actions.MEMBERSHIP_SAVE_FAILED,
            ]);
        });
    });

    describe('loadMembership', () => {
        it('dispatches loading then loaded with the record', async () => {
            const record = { id: 'abc-123', type: 'community', status: 'unconfirmed' };
            mockApi.onGet(repositories.routes.MEMBERSHIP_BY_ID_API({ id: 'abc-123' }).apiUrl).reply(200, record);

            await mockActionsStore.dispatch(loadMembership('abc-123'));

            expect(mockActionsStore.getActions()).toHaveDispatchedActions([
                actions.MEMBERSHIP_LOADING,
                actions.MEMBERSHIP_LOADED,
            ]);
        });

        it('dispatches loading then failed when the record cannot be read', async () => {
            mockApi.onGet(repositories.routes.MEMBERSHIP_BY_ID_API({ id: 'abc-123' }).apiUrl).reply(403);

            await mockActionsStore.dispatch(loadMembership('abc-123'));

            expect(mockActionsStore.getActions()).toHaveDispatchedActions([
                actions.MEMBERSHIP_LOADING,
                actions.MEMBERSHIP_FAILED,
            ]);
        });
    });

    describe('saveMembershipPayment', () => {
        it('dispatches saving then saved, and resolves when the payment is recorded', async () => {
            const payment = { id: 'abc-123', payment_receipt: 'R123456' };
            mockApi.onPost(repositories.routes.MEMBERSHIP_PAYMENT_API({ id: 'abc-123' }).apiUrl).reply(200, payment);

            await mockActionsStore.dispatch(saveMembershipPayment(payment));

            expect(mockActionsStore.getActions()).toHaveDispatchedActions([
                actions.MEMBERSHIP_SAVING,
                actions.MEMBERSHIP_SAVED,
            ]);
        });

        it('dispatches save failed and rejects when it cannot be recorded', async () => {
            mockApi.onPost(repositories.routes.MEMBERSHIP_PAYMENT_API({ id: 'abc-123' }).apiUrl).reply(422);

            await expect(mockActionsStore.dispatch(saveMembershipPayment({ id: 'abc-123' }))).rejects.toBeDefined();

            expect(mockActionsStore.getActions()).toHaveDispatchedActions([
                actions.MEMBERSHIP_SAVING,
                actions.MEMBERSHIP_SAVE_FAILED,
            ]);
        });
    });

    describe('clearMembership', () => {
        it('dispatches the clear action', () => {
            mockActionsStore.dispatch(clearMembership());

            expect(mockActionsStore.getActions()).toHaveDispatchedActions([actions.MEMBERSHIP_CLEAR]);
        });
    });
});

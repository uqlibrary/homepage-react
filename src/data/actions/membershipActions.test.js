import * as actions from './actionTypes';
import * as repositories from 'repositories';
import {
    checkIsRenewing,
    clearMembership,
    convertAttachments,
    flattenAttachments,
    loadMembership,
    loadMembershipByCode,
    loadMembershipFormData,
    renewMembership,
    saveMembershipPayment,
    submitMembership,
    uploadMembershipFile,
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

    describe('loadMembershipByCode', () => {
        it('dispatches loading then loaded with the record the link points at', async () => {
            const record = { id: 'abc-123', type: 'community', status: 'renewing' };
            mockApi
                .onGet(repositories.routes.MEMBERSHIP_BY_CODE_API({ id: 'abc-123', code: 'the-code' }).apiUrl)
                .reply(200, record);

            await mockActionsStore.dispatch(loadMembershipByCode('abc-123', 'the-code'));

            expect(mockActionsStore.getActions()).toHaveDispatchedActions([
                actions.MEMBERSHIP_LOADING,
                actions.MEMBERSHIP_LOADED,
            ]);
        });

        it('dispatches loading then failed when the link is not honoured', async () => {
            mockApi.onGet(repositories.routes.MEMBERSHIP_BY_CODE_API({ id: 'abc-123', code: 'bad' }).apiUrl).reply(403);

            await mockActionsStore.dispatch(loadMembershipByCode('abc-123', 'bad'));

            expect(mockActionsStore.getActions()).toHaveDispatchedActions([
                actions.MEMBERSHIP_LOADING,
                actions.MEMBERSHIP_FAILED,
            ]);
        });
    });

    describe('renewMembership', () => {
        it('dispatches saving then saved, and resolves with the saved record', async () => {
            const membership = { id: 'abc-123', code: 'the-code', type: 'community' };
            const saved = { id: 'abc-123', type: 'community', status: 'unconfirmed' };
            mockApi
                .onPost(repositories.routes.MEMBERSHIP_RENEW_API({ id: 'abc-123', code: 'the-code' }).apiUrl)
                .reply(200, saved);

            const result = await mockActionsStore.dispatch(renewMembership(membership));

            expect(result).toEqual(saved);
            expect(mockActionsStore.getActions()).toHaveDispatchedActions([
                actions.MEMBERSHIP_SAVING,
                actions.MEMBERSHIP_SAVED,
            ]);
        });

        it('dispatches save failed and rejects when the renewal fails', async () => {
            mockApi
                .onPost(repositories.routes.MEMBERSHIP_RENEW_API({ id: 'abc-123', code: 'the-code' }).apiUrl)
                .reply(422);

            await expect(
                mockActionsStore.dispatch(renewMembership({ id: 'abc-123', code: 'the-code' })),
            ).rejects.toBeDefined();

            expect(mockActionsStore.getActions()).toHaveDispatchedActions([
                actions.MEMBERSHIP_SAVING,
                actions.MEMBERSHIP_SAVE_FAILED,
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

    describe('attachments', () => {
        it('convertAttachments turns attachment_0..n into a list', () => {
            const record = { id: 'x', attachment_0: '{"id":"a"}', attachment_1: '{"id":"b"}' };

            expect(convertAttachments(record).attachments).toEqual([{ id: 'a' }, { id: 'b' }]);
        });

        it('convertAttachments accepts an already-parsed attachment', () => {
            const record = { id: 'x', attachment_0: { id: 'a' } };

            expect(convertAttachments(record).attachments).toEqual([{ id: 'a' }]);
        });

        it('convertAttachments leaves a record with no attachments untouched', () => {
            expect(convertAttachments({ id: 'x' })).toEqual({ id: 'x' });
            expect(convertAttachments(null)).toBeNull();
        });

        it('flattenAttachments spreads a list back into the fields the API expects', () => {
            const flattened = flattenAttachments({ id: 'x', attachments: [{ id: 'a' }, { id: 'b' }] });

            expect(flattened.attachment_0).toBe('{"id":"a"}');
            expect(flattened.attachment_1).toBe('{"id":"b"}');
        });

        it('flattenAttachments leaves a record with no attachments untouched', () => {
            expect(flattenAttachments({ id: 'x' })).toEqual({ id: 'x' });
            expect(flattenAttachments(undefined)).toBeUndefined();
        });
    });

    describe('uploadMembershipFile', () => {
        it('uploads a file and returns the stored attachment', async () => {
            mockApi
                .onPost(repositories.routes.MEMBERSHIP_FILE_UPLOAD_API().apiUrl)
                .reply(200, [{ id: 'file-1', filename: 'card.pdf' }]);

            const result = await mockActionsStore.dispatch(uploadMembershipFile(new File(['x'], 'card.pdf')));

            expect(result).toEqual({ id: 'file-1', filename: 'card.pdf' });
        });
    });

    describe('clearMembership', () => {
        it('dispatches the clear action', () => {
            mockActionsStore.dispatch(clearMembership());

            expect(mockActionsStore.getActions()).toHaveDispatchedActions([actions.MEMBERSHIP_CLEAR]);
        });
    });
});

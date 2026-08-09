import * as actions from './actionTypes';
import * as repositories from 'repositories';
import {
    checkIsRenewing,
    clearMembership,
    clearMemberships,
    confirmMembership,
    convertAttachments,
    deleteMembership,
    flattenAttachments,
    loadMembership,
    loadMembershipByCode,
    loadMembershipFormData,
    loadMemberships,
    renewMembership,
    resendRenewalEmail,
    saveMembershipPayment,
    stripDisallowedFields,
    submitMembership,
    updateMembership,
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

    describe('confirmMembership', () => {
        it('dispatches saving then saved, and resolves with the confirmed record', async () => {
            const confirmed = {
                status: 'confirmed',
                confirmed_on: '17-07-2026',
                attachment_0: '{"key":"f1","name":"a.pdf"}',
            };
            mockApi.onPost(repositories.routes.MEMBERSHIP_CONFIRM_API({ id: 'abc-123' }).apiUrl).reply(200, confirmed);

            const result = await mockActionsStore.dispatch(confirmMembership({ id: 'abc-123' }));

            // Success answers with the confirmed record, its flat attachment fields turned into a list.
            expect(result.status).toBe('confirmed');
            expect(result.attachments).toEqual([{ key: 'f1', name: 'a.pdf' }]);
            expect(mockActionsStore.getActions()).toHaveDispatchedActions([
                actions.MEMBERSHIP_SAVING,
                actions.MEMBERSHIP_SAVED,
            ]);
        });

        it('rejects with the backend reason when a confirmation is refused', async () => {
            // A refusal comes back as a 422 whose body carries the reason - the shape BaseController::error
            // frames it in, a single-element array - which the axios interceptor surfaces as `message`.
            mockApi
                .onPost(repositories.routes.MEMBERSHIP_CONFIRM_API({ id: 'abc-123' }).apiUrl)
                .reply(422, ['This applicant is already a member.']);

            await expect(mockActionsStore.dispatch(confirmMembership({ id: 'abc-123' }))).rejects.toMatchObject({
                message: 'This applicant is already a member.',
            });

            expect(mockActionsStore.getActions()).toHaveDispatchedActions([
                actions.MEMBERSHIP_SAVING,
                actions.MEMBERSHIP_SAVE_FAILED,
            ]);
        });

        it('dispatches save failed and rejects when the request cannot be reached at all', async () => {
            mockApi.onPost(repositories.routes.MEMBERSHIP_CONFIRM_API({ id: 'abc-123' }).apiUrl).networkError();

            await expect(mockActionsStore.dispatch(confirmMembership({ id: 'abc-123' }))).rejects.toBeDefined();

            expect(mockActionsStore.getActions()).toHaveDispatchedActions([
                actions.MEMBERSHIP_SAVING,
                actions.MEMBERSHIP_SAVE_FAILED,
            ]);
        });
    });

    describe('deleteMembership', () => {
        it('dispatches saving then deleted, and resolves', async () => {
            mockApi
                .onDelete(repositories.routes.MEMBERSHIP_DELETE_API({ id: 'abc-123' }).apiUrl)
                .reply(200, { status: 'ok' });

            await mockActionsStore.dispatch(deleteMembership('abc-123'));

            expect(mockActionsStore.getActions()).toHaveDispatchedActions([
                actions.MEMBERSHIP_SAVING,
                actions.MEMBERSHIP_DELETED,
            ]);
        });

        it('dispatches save failed and rejects when the delete fails', async () => {
            mockApi.onDelete(repositories.routes.MEMBERSHIP_DELETE_API({ id: 'abc-123' }).apiUrl).reply(422);

            await expect(mockActionsStore.dispatch(deleteMembership('abc-123'))).rejects.toBeDefined();

            expect(mockActionsStore.getActions()).toHaveDispatchedActions([
                actions.MEMBERSHIP_SAVING,
                actions.MEMBERSHIP_SAVE_FAILED,
            ]);
        });
    });

    describe('resendRenewalEmail', () => {
        it('resolves with a truthy result when the email is sent', async () => {
            mockApi.onGet(repositories.routes.MEMBERSHIP_RESEND_EMAIL_API({ id: 'abc-123' }).apiUrl).reply(200, true);

            await expect(mockActionsStore.dispatch(resendRenewalEmail('abc-123'))).resolves.toBe(true);
        });

        it('resolves with a falsy result when the endpoint reports it did not send', async () => {
            mockApi.onGet(repositories.routes.MEMBERSHIP_RESEND_EMAIL_API({ id: 'abc-123' }).apiUrl).reply(200, false);

            await expect(mockActionsStore.dispatch(resendRenewalEmail('abc-123'))).resolves.toBe(false);
        });

        it('dispatches save failed and rejects when the request cannot be reached', async () => {
            mockApi.onGet(repositories.routes.MEMBERSHIP_RESEND_EMAIL_API({ id: 'abc-123' }).apiUrl).networkError();

            await expect(mockActionsStore.dispatch(resendRenewalEmail('abc-123'))).rejects.toBeDefined();

            expect(mockActionsStore.getActions()).toHaveDispatchedActions([actions.MEMBERSHIP_SAVE_FAILED]);
        });
    });

    describe('stripDisallowedFields', () => {
        it('drops the fields the API writes itself and keeps the rest', () => {
            expect(
                stripDisallowedFields({
                    id: 'abc-123',
                    barcode: '2406700012345',
                    submitted_on: 'x',
                    confirmed_on: 'y',
                }),
            ).toEqual({ id: 'abc-123', barcode: '2406700012345' });
        });

        it('treats a missing record as an empty one', () => {
            expect(stripDisallowedFields(undefined)).toEqual({});
        });
    });

    describe('updateMembership', () => {
        it('sends the record without the fields the API sets, and resolves with the saved record', async () => {
            let sent;
            mockApi.onPost(repositories.routes.MEMBERSHIP_UPDATE_API({ id: 'abc-123' }).apiUrl).reply(config => {
                sent = JSON.parse(config.data);
                return [200, { id: 'abc-123', barcode: '2406700012345', attachment_0: '{"key":"f1","name":"a.pdf"}' }];
            });

            const result = await mockActionsStore.dispatch(
                updateMembership({ id: 'abc-123', barcode: '2406700012345', submitted_on: 'x', confirmed_on: 'y' }),
            );

            // The record the API sets itself is not echoed back at it.
            expect(sent).not.toHaveProperty('submitted_on');
            expect(sent).not.toHaveProperty('confirmed_on');
            // The saved record comes back with its flat attachment fields turned into a list.
            expect(result.attachments).toEqual([{ key: 'f1', name: 'a.pdf' }]);
            expect(mockActionsStore.getActions()).toHaveDispatchedActions([
                actions.MEMBERSHIP_SAVING,
                actions.MEMBERSHIP_SAVED,
            ]);
        });

        it('rejects with the backend reason when the expiry is refused', async () => {
            mockApi
                .onPost(repositories.routes.MEMBERSHIP_UPDATE_API({ id: 'abc-123' }).apiUrl)
                .reply(422, { message: 'The expiry date was invalid.' });

            await expect(
                mockActionsStore.dispatch(updateMembership({ id: 'abc-123', expires_on: '31-09-2023' })),
            ).rejects.toMatchObject({ message: 'The expiry date was invalid.' });

            expect(mockActionsStore.getActions()).toHaveDispatchedActions([
                actions.MEMBERSHIP_SAVING,
                actions.MEMBERSHIP_SAVE_FAILED,
            ]);
        });

        it('dispatches save failed and rejects when a barcode is refused', async () => {
            mockApi
                .onPost(repositories.routes.MEMBERSHIP_UPDATE_API({ id: 'abc-123' }).apiUrl)
                .reply(400, 'debug text');

            await expect(
                mockActionsStore.dispatch(updateMembership({ id: 'abc-123', barcode: '2406700010000' })),
            ).rejects.toBeDefined();

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

    describe('loadMemberships', () => {
        it('dispatches loading then loaded with the page, pagination and counts, converting attachments', async () => {
            mockApi.onGet(new RegExp('memberships')).reply(200, {
                data: [{ id: 'abc-123', attachment_0: '{"key":"a"}' }, { id: 'def-456' }],
                pagination: { total: 42, page: 1, per_page: 20, pages: 3 },
                counts: { all: 42, unconfirmed: 10, renewing: 12, confirmed: 20 },
            });

            await mockActionsStore.dispatch(loadMemberships({ name: 'smith', page: 1 }));

            const dispatched = mockActionsStore.getActions();
            expect(dispatched).toHaveDispatchedActions([actions.MEMBERSHIPS_LOADING, actions.MEMBERSHIPS_LOADED]);
            const loaded = dispatched.find(action => action.type === actions.MEMBERSHIPS_LOADED).payload;
            expect(loaded.memberships[0].attachments).toEqual([{ key: 'a' }]);
            expect(loaded.pagination).toEqual({ total: 42, page: 1, per_page: 20, pages: 3 });
            expect(loaded.counts.renewing).toBe(12);
        });

        it('treats a body without a data array as an empty page', async () => {
            mockApi.onGet(new RegExp('memberships')).reply(200, { pagination: { total: 0 } });

            await mockActionsStore.dispatch(loadMemberships({}));

            const loaded = mockActionsStore.getActions().find(action => action.type === actions.MEMBERSHIPS_LOADED);
            expect(loaded.payload.memberships).toEqual([]);
        });

        it('dispatches loading then failed when the listing cannot be read', async () => {
            mockApi.onGet(new RegExp('memberships')).reply(404);

            await mockActionsStore.dispatch(loadMemberships({}));

            expect(mockActionsStore.getActions()).toHaveDispatchedActions([
                actions.MEMBERSHIPS_LOADING,
                actions.MEMBERSHIPS_FAILED,
            ]);
        });
    });

    describe('clearMemberships', () => {
        it('dispatches the clear action', () => {
            mockActionsStore.dispatch(clearMemberships());

            expect(mockActionsStore.getActions()).toHaveDispatchedActions([actions.MEMBERSHIPS_CLEAR]);
        });
    });
});

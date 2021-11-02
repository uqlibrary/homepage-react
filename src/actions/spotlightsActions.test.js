// import { courseReadingList } from 'mock/data/records';

import * as actions from './actionTypes';
import * as repositories from 'repositories';
import {
    clearSpotlights,
    clearASpotlight,
    deleteSpotlight,
    loadAllSpotlights,
    loadASpotlight,
    saveSpotlightChangeWithExistingImage,
    saveSpotlightWithNewImage,
    createSpotlightWithNewImage,
    saveSpotlightBatch,
    deleteSpotlightBatch,
} from './spotlightsActions';

jest.mock('raven-js');

const fileToUpload = new File(['foo'], 'foo.jpg', {
    type: 'text/jpg',
});
//     {
//     path: 'my-new-spotlight-image.jpg',
//     preview: 'blob:http://localhost:my-new-spotlight-image',
//     name: 'my-new-spotlight-image.jpg',
//     lastModified: 1629160776973,
//     lastModifiedDate: 'Tue Aug 17 2021 10:39:36 GMT+1000 (Australian Eastern Standard Time)',
// };
const sendSpotlightRecord = {
    active: 0,
    end: '2021-08-12 11:25:51',
    img_alt: 'test',
    start: '2021-08-05 11:25:51',
    title: 'test LdG',
    url: 'http://example.com',
};
const returnedSpotlightRecord = {
    active: 0,
    end: '2021-08-12 11:25:51',
    img_alt: 'test',
    img_url: 'https://app.library.uq.edu.au/file/public/20d834a0-f58c-11eb-a4cd-611585dc0de4.jpg',
    start: '2021-08-05 11:25:51',
    title: 'test LdG',
    url: 'http://example.com',
};
/*
                    active: 0,
                    end: '2017-01-30 00:00:00',
                    id: '1e1b0e10-c400-11e6-a8f0-47525a49f469',
                    img_alt: 'Feedback on library services',
                    img_url: 'https://app.library.uq.edu.au/file/public/17c26e10-c400-11e6-9509-e31d0c6d416e.jpg',
                    start: '2016-12-17 12:24:00',
                    title: 'Feedback on library services test',
                    url: 'https://web.library.uq.edu.au/blog/2016/12/your-feedback-july-september-2016',
                    weight: 0,

 */

describe('Spotlight list actions', () => {
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

    describe('Spotlight List Actions', () => {
        it('dispatches expected actions when all spotlights call fails', async () => {
            mockApi.onGet(repositories.routes.SPOTLIGHTS_ALL_API()).reply(500);

            const expectedActions = [actions.SPOTLIGHTS_CLEAR, actions.SPOTLIGHTS_LOADING, actions.SPOTLIGHTS_FAILED];

            await mockActionsStore.dispatch(loadAllSpotlights());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch clear spotlights list action', async () => {
            const expectedActions = [actions.SPOTLIGHTS_CLEAR];

            await mockActionsStore.dispatch(clearSpotlights());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('handles spotlights list', async () => {
            mockApi.onGet(repositories.routes.SPOTLIGHTS_ALL_API().apiUrl).reply(200, []);

            const expectedActions = [actions.SPOTLIGHTS_CLEAR, actions.SPOTLIGHTS_LOADING, actions.SPOTLIGHTS_LOADED];

            await mockActionsStore.dispatch(loadAllSpotlights());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions when spotlight list call fails', async () => {
            mockApi.onGet(repositories.routes.SPOTLIGHTS_ALL_API().apiUrl).reply(500);

            const expectedActions = [
                actions.SPOTLIGHTS_CLEAR,
                actions.SPOTLIGHTS_LOADING,
                actions.APP_ALERT_SHOW,
                actions.SPOTLIGHTS_FAILED,
            ];

            await mockActionsStore.dispatch(loadAllSpotlights());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('Spotlight Get Actions', () => {
        it('dispatches expected actions when specific spotlights call fails', async () => {
            mockApi
                .onGet(repositories.routes.SPOTLIGHT_GET_BY_ID_API({ id: 'e895b270-d62b-11e7-954e-57c2cc19d151' }))
                .reply(500);

            const expectedActions = [actions.SPOTLIGHT_LOADING, actions.SPOTLIGHT_FAILED];

            await mockActionsStore.dispatch(loadASpotlight('e895b270-d62b-11e7-954e-57c2cc19d151'));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions when an spotlight get fails', async () => {
            mockApi
                .onGet(
                    repositories.routes.SPOTLIGHT_GET_BY_ID_API({
                        id: 'e895b270-d62b-11e7-954e-57c2cc19d151',
                    }).apiUrl,
                )
                .reply(500);

            const expectedActions = [actions.SPOTLIGHT_LOADING, actions.APP_ALERT_SHOW, actions.SPOTLIGHT_FAILED];

            await mockActionsStore.dispatch(loadASpotlight('e895b270-d62b-11e7-954e-57c2cc19d151'));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('handles an spotlight get request', async () => {
            mockApi
                .onGet(
                    repositories.routes.SPOTLIGHT_GET_BY_ID_API({
                        id: 'e895b270-d62b-11e7-954e-57c2cc19d151',
                    }).apiUrl,
                )
                .reply(200, {
                    id: 'e895b270-d62b-11e7-954e-57c2cc19d151',
                    start: '2022-10-12 09:58:02',
                    end: '2022-11-22 09:58:02',
                    title: 'Test urgent spotlight 2',
                    body:
                        '[urgent link description](http://www.somelink.com) Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                    urgent: 1,
                });

            const expectedActions = [actions.SPOTLIGHT_LOADING, actions.SPOTLIGHT_LOADED];

            await mockActionsStore.dispatch(loadASpotlight('e895b270-d62b-11e7-954e-57c2cc19d151'));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch clear an spotlight action', async () => {
            const expectedActions = [actions.SPOTLIGHT_CLEAR];

            await mockActionsStore.dispatch(clearASpotlight());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('Spotlight Creation', () => {
        it('dispatches expected actions when spotlight create call fails', async () => {
            mockApi.onAny(repositories.routes.SPOTLIGHT_CREATE_API().apiUrl).reply(500);

            const expectedActions = [actions.SPOTLIGHT_LOADING, actions.APP_ALERT_SHOW, actions.SPOTLIGHT_FAILED];

            await mockActionsStore.dispatch(saveSpotlightWithNewImage(sendSpotlightRecord, 'create'));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions when spotlight save call fails', async () => {
            mockApi.onAny(repositories.routes.SPOTLIGHT_SAVE_API({ id: 'id' }).apiUrl).reply(500);

            const expectedActions = [actions.SPOTLIGHT_LOADING, actions.SPOTLIGHT_FAILED];

            await mockActionsStore.dispatch(createSpotlightWithNewImage(sendSpotlightRecord));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('handles an spotlight creation request', async () => {
            mockApi.onAny(repositories.routes.SPOTLIGHT_CREATE_API().apiUrl).reply(200, {
                ...returnedSpotlightRecord,
                id: '88888-d62b-11e7-954e-57c2cc19d151',
            });

            const expectedActions = [actions.SPOTLIGHT_LOADING, actions.SPOTLIGHT_CREATED];

            await mockActionsStore.dispatch(createSpotlightWithNewImage(sendSpotlightRecord));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('handles a successful file upload request with spotlight creation', async () => {
            mockApi.onAny(repositories.routes.SPOTLIGHT_CREATE_API().apiUrl).reply(200, sendSpotlightRecord);
            mockApi.onAny(repositories.routes.UPLOAD_PUBLIC_FILES_API().apiUrl).reply(200, {
                payload: {
                    ...sendSpotlightRecord,
                    uploadedFile: ['dummy array of files'],
                },
            });
            const expectedActions = [
                actions.PUBLIC_FILE_UPLOADING,
                actions.PUBLIC_FILE_UPLOADED,
                actions.SPOTLIGHT_LOADING,
                actions.SPOTLIGHT_CREATED,
            ];
            await mockActionsStore.dispatch(
                createSpotlightWithNewImage({
                    ...sendSpotlightRecord,
                    uploadedFile: [fileToUpload],
                }),
            );
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('handles a failing file upload request on spotlight creation', async () => {
            mockApi.onAny(repositories.routes.UPLOAD_PUBLIC_FILES_API().apiUrl).reply(500, {
                payload: 'error message',
            });
            const expectedActions = [
                actions.PUBLIC_FILE_UPLOADING,
                actions.APP_ALERT_SHOW,
                actions.PUBLIC_FILE_UPLOAD_FAILED,
            ];
            await mockActionsStore.dispatch(
                createSpotlightWithNewImage({
                    ...sendSpotlightRecord,
                    uploadedFile: [fileToUpload],
                }),
            );
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('Spotlight Deletion', () => {
        it('dispatches expected actions when spotlight delete call fails', async () => {
            mockApi.onDelete(repositories.routes.SPOTLIGHT_DELETE_API({ id: 'id' }).apiUrl).reply(500);
            const expectedActions = [actions.SPOTLIGHT_LOADING, actions.APP_ALERT_SHOW, actions.SPOTLIGHT_FAILED];

            try {
                await mockActionsStore.dispatch(deleteSpotlight('id'));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('handles a spotlight delete request', async () => {
            mockApi
                .onAny(repositories.routes.SPOTLIGHT_DELETE_API({ id: '88888-d62b-11e7-954e-57c2cc19d151' }).apiUrl)
                .reply(200, []);

            const expectedActions = [actions.SPOTLIGHT_LOADING, actions.SPOTLIGHT_DELETED];

            await mockActionsStore.dispatch(deleteSpotlight('88888-d62b-11e7-954e-57c2cc19d151'));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('Spotlight Bulk Deletion', () => {
        it('dispatches expected actions when spotlight bulk delete call fails', async () => {
            mockApi.onDelete(repositories.routes.SPOTLIGHT_DELETE_BULK_API().apiUrl).reply(500);
            const expectedActions = [
                actions.SPOTLIGHT_SAVING,
                actions.APP_ALERT_SHOW,
                actions.SPOTLIGHTS_DELETION_FAILED,
            ];

            try {
                await mockActionsStore.dispatch(deleteSpotlightBatch(['id1']));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('handles a spotlight bulk delete request', async () => {
            mockApi.onAny(repositories.routes.SPOTLIGHT_DELETE_BULK_API().apiUrl).reply(200, []);

            const expectedActions = [actions.SPOTLIGHT_SAVING, actions.SPOTLIGHTS_DELETION_SUCCESS];

            await mockActionsStore.dispatch(deleteSpotlightBatch(['id1', 'id2']));

            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('Spotlight Update', () => {
        it('handles a successful spotlight save request', async () => {
            mockApi
                .onAny(repositories.routes.SPOTLIGHT_SAVE_API({ id: '88888-d62b-11e7-954e-57c2cc19d151' }).apiUrl)
                .reply(200, {
                    ...returnedSpotlightRecord,
                    id: '88888-d62b-11e7-954e-57c2cc19d151',
                });

            const expectedActions = [actions.SPOTLIGHT_SAVING, actions.SPOTLIGHT_SAVED];

            await mockActionsStore.dispatch(
                saveSpotlightChangeWithExistingImage({
                    ...sendSpotlightRecord,
                    id: '88888-d62b-11e7-954e-57c2cc19d151',
                }),
            );
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
        it('handles a failing spotlight save request', async () => {
            mockApi.onAny(repositories.routes.SPOTLIGHT_SAVE_API({ id: 'id' }).apiUrl).reply(500);
            const expectedActions = [actions.SPOTLIGHT_SAVING, actions.APP_ALERT_SHOW, actions.SPOTLIGHT_FAILED];

            try {
                await mockActionsStore.dispatch(
                    saveSpotlightChangeWithExistingImage({ ...sendSpotlightRecord, id: 'id' }),
                );
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });
        it('handles a successful spotlight save request with File', async () => {
            mockApi.onAny(repositories.routes.UPLOAD_PUBLIC_FILES_API().apiUrl).reply(200, {
                payload: {
                    ...sendSpotlightRecord,
                    uploadedFile: ['dummy array of files'],
                },
            });
            mockApi
                .onAny(repositories.routes.SPOTLIGHT_SAVE_API({ id: '88888-d62b-11e7-954e-57c2cc19d151' }).apiUrl)
                .reply(200, {
                    ...returnedSpotlightRecord,
                    id: '88888-d62b-11e7-954e-57c2cc19d151',
                });

            const expectedActions = [
                actions.PUBLIC_FILE_UPLOADING,
                actions.PUBLIC_FILE_UPLOADED,
                actions.SPOTLIGHT_SAVING,
                actions.SPOTLIGHT_SAVED,
            ];

            await mockActionsStore.dispatch(
                saveSpotlightWithNewImage({
                    ...sendSpotlightRecord,
                    id: '88888-d62b-11e7-954e-57c2cc19d151',
                    uploadedFile: [fileToUpload],
                }),
            );
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
        it('handles a failing spotlight save request with File', async () => {
            mockApi.onAny(repositories.routes.UPLOAD_PUBLIC_FILES_API().apiUrl).reply(200, {
                payload: {
                    ...sendSpotlightRecord,
                    uploadedFile: ['dummy array of files'],
                },
            });
            mockApi.onAny(repositories.routes.SPOTLIGHT_SAVE_API({ id: 'id' }).apiUrl).reply(500);
            const expectedActions = [
                actions.PUBLIC_FILE_UPLOADING,
                actions.PUBLIC_FILE_UPLOADED,
                actions.SPOTLIGHT_SAVING,
                actions.APP_ALERT_SHOW,
                actions.SPOTLIGHT_FAILED,
                actions.PUBLIC_FILE_UPLOAD_FAILED,
            ];

            await mockActionsStore.dispatch(
                saveSpotlightWithNewImage({ ...sendSpotlightRecord, id: 'id', uploadedFile: [fileToUpload] }),
            );
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('Spotlight Bulk Update', () => {
        it('handles a successful spotlight bulk save request', async () => {
            mockApi.onAny(repositories.routes.SPOTLIGHT_SAVE_BULK_API().apiUrl).reply(200, [
                {
                    ...returnedSpotlightRecord,
                    id: '88888-d62b-11e7-954e-57c2cc19d151',
                },
            ]);

            const expectedActions = [actions.SPOTLIGHT_SAVING, actions.SPOTLIGHT_SAVED];

            await mockActionsStore.dispatch(
                saveSpotlightBatch([
                    {
                        ...sendSpotlightRecord,
                        id: '88888-d62b-11e7-954e-57c2cc19d151',
                    },
                ]),
            );
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
        it('handles a failing spotlight bulk save request', async () => {
            mockApi.onAny(repositories.routes.SPOTLIGHT_SAVE_API({ id: 'id' }).apiUrl).reply(500);
            const expectedActions = [actions.SPOTLIGHT_SAVING, actions.SPOTLIGHT_FAILED];

            try {
                await mockActionsStore.dispatch(saveSpotlightBatch([{ ...sendSpotlightRecord, id: 'id' }]));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });
    });
});

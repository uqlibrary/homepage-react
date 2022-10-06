import publicFileUploadReducer, { initialState } from './publicFileUploadReducer';
import * as actions from '../actions/actionTypes';

describe('Public File Upload reducer', () => {
    let emptyState;
    let uploadResults;

    beforeEach(() => {
        uploadResults = [{}];
        emptyState = {
            ...initialState,
        };
    });

    it('should set uploads Status flags to loading when loading', () => {
        const test = publicFileUploadReducer(emptyState, { type: actions.PUBLIC_FILE_UPLOADING });
        expect(test).toEqual({
            ...emptyState,
            publicFileUploadResult: null,
            publicFileUploading: true,
            publicFileUploadError: false,
        });
    });

    it('should set uploads Status flags when successfully loaded', () => {
        const test = publicFileUploadReducer(emptyState, {
            type: actions.PUBLIC_FILE_UPLOADED,
            payload: uploadResults,
        });
        expect(test).toEqual({
            ...emptyState,
            publicFileUploadResult: uploadResults,
            publicFileUploading: false,
            publicFileUploadError: false,
        });
    });

    it('should handle a failing Upload API call', () => {
        const test = publicFileUploadReducer(emptyState, {
            type: actions.PUBLIC_FILE_UPLOAD_FAILED,
            payload: 'failed!',
        });
        expect(test).toEqual({
            ...emptyState,
            publicFileUploading: false,
            publicFileUploadError: true,
            publicFileUploadResult: 'failed!',
        });
    });

    it('should handle clearing the uploads', () => {
        const test = publicFileUploadReducer(emptyState, { type: actions.PUBLIC_FILE_UPLOAD_CLEARED });
        expect(test).toEqual({
            ...emptyState,
        });
    });
});

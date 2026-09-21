import dlorObjectFilesReducer, { initialState } from './dlorObjectFilesReducer';
import * as actions from '../actions/actionTypes';

describe('dlorObjectFilesReducer', () => {
    let emptyState;

    beforeEach(() => {
        emptyState = {
            ...initialState,
        };
    });

    it('should return initial state for unknown action', () => {
        const test = dlorObjectFilesReducer(emptyState, { type: 'UNKNOWN' });
        expect(test).toEqual(emptyState);
    });

    it('should handle DLOR_DELETE_OBJET_FILE_LOADING', () => {
        const test = dlorObjectFilesReducer(emptyState, { type: actions.DLOR_DELETE_OBJET_FILE_LOADING });
        expect(test).toEqual({
            ...emptyState,
            dlorObjectFileDeleting: true,
            dlorObjectFileDeleted: false,
            dlorObjectFileDeleteError: false,
        });
    });

    it('should handle DLOR_DELETE_OBJET_FILE_SUCCESS', () => {
        const test = dlorObjectFilesReducer(emptyState, { type: actions.DLOR_DELETE_OBJET_FILE_SUCCESS });
        expect(test).toEqual({
            ...emptyState,
            dlorObjectFileDeleting: false,
            dlorObjectFileDeleted: true,
            dlorObjectFileDeleteError: false,
        });
    });

    it('should handle DLOR_DELETE_OBJET_FILE_FAILED', () => {
        const test = dlorObjectFilesReducer(emptyState, { type: actions.DLOR_DELETE_OBJET_FILE_FAILED });
        expect(test).toEqual({
            ...emptyState,
            dlorObjectFileDeleting: false,
            dlorObjectFileDeleted: false,
            dlorObjectFileDeleteError: true,
        });
    });

    it('should handle DLOR_UPLOAD_OBJET_FILE_LOADING', () => {
        const test = dlorObjectFilesReducer(emptyState, { type: actions.DLOR_UPLOAD_OBJET_FILE_LOADING });
        expect(test).toEqual({
            ...emptyState,
            dlorObjectFileUploading: true,
            dlorObjectFileUploaded: false,
            dlorObjectFileUploadError: false,
        });
    });

    it('should handle DLOR_UPLOAD_OBJET_FILE_SUCCESS', () => {
        const test = dlorObjectFilesReducer(emptyState, { type: actions.DLOR_UPLOAD_OBJET_FILE_SUCCESS });
        expect(test).toEqual({
            ...emptyState,
            dlorObjectFileUploading: false,
            dlorObjectFileUploaded: true,
            dlorObjectFileUploadError: false,
        });
    });

    it('should handle DLOR_CREATE_FAILED', () => {
        const test = dlorObjectFilesReducer(emptyState, { type: actions.DLOR_UPLOAD_OBJET_FILE_FAILED });
        expect(test).toEqual({
            ...emptyState,
            dlorObjectFileUploading: false,
            dlorObjectFileUploaded: false,
            dlorObjectFileUploadError: true,
        });
    });
});

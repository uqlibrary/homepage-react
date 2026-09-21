import { renderHook, act } from '@testing-library/react';
import useFile from './useFile';

describe('useFile', () => {
    it('should return default state when no dlorItem is provided', () => {
        const { result } = renderHook(() => useFile({ mode: 'create', dlorItem: null }));
        const [hasFile, existingFile, fileToBeUploaded] = result.current;

        expect(hasFile).toBe(false);
        expect(existingFile).toEqual(undefined);
        expect(fileToBeUploaded).toBeUndefined();
    });

    it('should propagate dlorItem file data to existingFile in edit mode', () => {
        const dlorItem = { object_file_name: 'file.pdf', object_file_size: 1234 };
        const { result } = renderHook(() => useFile({ mode: 'edit', dlorItem }));
        const [hasFile, existingFile] = result.current;

        expect(existingFile).toEqual({ name: 'file.pdf', size: 1234 });
        expect(hasFile).toBe(true);
    });

    it('should propagate dlorItem file data to existingFile in edit mode when file has zero bytes', () => {
        const dlorItem = { object_file_name: 'file.pdf', object_file_size: 0 };
        const { result } = renderHook(() => useFile({ mode: 'edit', dlorItem }));
        const [hasFile, existingFile] = result.current;

        expect(existingFile).toEqual({ name: 'file.pdf', size: 0 });
        expect(hasFile).toBe(true);
    });

    it('should not propagate dlorItem data when mode is not edit', () => {
        const dlorItem = { object_file_name: 'file.pdf', object_file_size: 1234 };
        const { result } = renderHook(() => useFile({ mode: 'create', dlorItem }));
        const [hasFile, existingFile] = result.current;

        expect(existingFile).toEqual(undefined);
        expect(hasFile).toBe(false);
    });

    it('should not propagate dlorItem data when file name or size is missing', () => {
        const { result } = renderHook(() => useFile({ mode: 'edit', dlorItem: { object_file_name: 'file.pdf' } }));
        const [, existingFile] = result.current;

        expect(existingFile).toEqual(undefined);
    });

    it('should set fileToBeUploaded on onFileChange', () => {
        const { result } = renderHook(() => useFile({ mode: 'create', dlorItem: null }));

        act(() => {
            const [, , , onFileChange] = result.current;
            onFileChange({ name: 'new.pdf', size: 500 });
        });

        const [hasFile, , fileToBeUploaded] = result.current;
        expect(fileToBeUploaded).toEqual({ name: 'new.pdf', size: 500 });
        expect(hasFile).toEqual(true);
    });

    it('should clear fileToBeUploaded on onClearFile when a file was uploaded', () => {
        const { result } = renderHook(() => useFile({ mode: 'create', dlorItem: null }));

        act(() => {
            const [, , , onFileChange] = result.current;
            onFileChange({ name: 'new.pdf', size: 500 });
        });

        act(() => {
            const [, , , , onClearFile] = result.current;
            onClearFile();
        });

        const [hasFile, , fileToBeUploaded] = result.current;
        expect(fileToBeUploaded).toBeNull();
        expect(hasFile).toBe(false);
    });

    it('should mark existingFile for deletion on onClearFile when no file was uploaded', () => {
        const dlorItem = { object_file_name: 'file.pdf', object_file_size: 1234 };
        const { result } = renderHook(() => useFile({ mode: 'edit', dlorItem }));

        act(() => {
            const [, , , , onClearFile] = result.current;
            onClearFile();
        });

        const [hasFile, existingFile] = result.current;
        expect(existingFile.markedForDeletion).toBe(true);
        expect(hasFile).toBe(false);
    });

    it('should not re-propagate dlorItem data after existingFile is marked for deletion', () => {
        const dlorItem = { object_file_name: 'file.pdf', object_file_size: 1234 };
        const { result, rerender } = renderHook(({ mode, dlorItem }) => useFile({ mode, dlorItem }), {
            initialProps: { mode: 'edit', dlorItem },
        });

        act(() => {
            const [, , , , onClearFile] = result.current;
            onClearFile();
        });

        rerender({ mode: 'edit', dlorItem });

        const [hasFile, existingFile] = result.current;
        expect(existingFile.markedForDeletion).toBe(true);
        expect(existingFile.name).toBe('file.pdf');
        expect(hasFile).toBe(false);
    });
});

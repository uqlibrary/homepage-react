import React from 'react';
import { useDropzone } from 'react-dropzone';
import { render as defaultRender, act } from 'test-utils';
import { createTheme } from '@mui/material/styles';
import Selector, { validator } from './Selector';
import { allowedFileTypes } from './general';

jest.mock('react-dropzone', () => ({
    useDropzone: jest.fn(),
}));

const theme = createTheme();

const onChange = jest.fn();
const getRootProps = jest.fn(() => ({}));
const getInputProps = jest.fn(() => ({}));

const dropzoneStateDefaultState = {
    getRootProps,
    getInputProps,
    isDragActive: false,
    isDragAccept: false,
    isDragReject: false,
};

const setup = (testProps = {}, render = defaultRender) => {
    const props = {
        onChange,
        ...testProps,
    };
    return render(<Selector {...props} />);
};

const getDropzone = container => container.firstChild.firstChild;

describe('Selector', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useDropzone.mockReturnValue({ ...dropzoneStateDefaultState });
    });

    it('should render instructions and upload prompt', () => {
        const { getByText } = setup();

        expect(getByText(/please ensure/i)).toBeInTheDocument();
        expect(getByText(/files are under 5GB in size/i)).toBeInTheDocument();
        expect(getByText(/click here to select files, or drag files into this area to upload/i)).toBeInTheDocument();
    });

    it('should configure useDropzone with accept, multiple', () => {
        setup();

        const options = useDropzone.mock.calls[0][0];

        expect(options.accept).toEqual(allowedFileTypes);
        expect(options.multiple).toBe(false);
        expect(options.onDropRejected).toEqual(expect.any(Function));
    });

    it('should apply root and input props from useDropzone', () => {
        setup();

        expect(getRootProps).toHaveBeenCalled();
        expect(getInputProps).toHaveBeenCalled();
    });

    describe('validator', () => {
        it.each(['image.png', 'My_file-1.pdf', 'a.b', `${'a'.repeat(41)}.png`])(
            'should accept valid file name %s',
            name => {
                expect(validator({ name })).toBeNull();
            },
        );

        it.each([
            ['contains spaces', 'my file.png'],
            ['contains multiple periods', 'my.file.png'],
            ['has no extension', 'file'],
            ['is 46 characters long', `${'a'.repeat(42)}.png`],
        ])('should reject file name that %s', (_, name) => {
            expect(validator({ name })).toEqual({
                code: 'invalid-file-name',
                message: 'File name is invalid',
            });
        });
    });

    describe('onDrop', () => {
        it('should call onChange with first file when a file is dropped', () => {
            setup();
            const { onDrop } = useDropzone.mock.calls[0][0];
            const file = new File(['content'], 'image.png', { type: 'image/png' });

            act(() => onDrop([file]));

            expect(onChange).toHaveBeenCalledWith(file);
        });

        it('should not call onChange when no files are dropped', () => {
            setup();
            const { onDrop } = useDropzone.mock.calls[0][0];

            act(() => onDrop([]));

            expect(onChange).not.toHaveBeenCalled();
        });

        it('should not throw when onChange is not provided', () => {
            setup({ onChange: undefined });
            const { onDrop } = useDropzone.mock.calls[0][0];

            expect(() => act(() => onDrop([new File(['content'], 'image.png')]))).not.toThrow();
        });
    });

    describe('border color', () => {
        it('should be divider by default', () => {
            const { container } = setup();

            expect(getDropzone(container)).toHaveStyle({ borderColor: theme.palette.divider });
        });

        it('should be primary when dragging', () => {
            useDropzone.mockReturnValue({ ...dropzoneStateDefaultState, isDragActive: true });
            const { container } = setup();

            expect(getDropzone(container)).toHaveStyle({ borderColor: theme.palette.primary.main });
        });

        it('should be success when drag is accepted', () => {
            useDropzone.mockReturnValue({ ...dropzoneStateDefaultState, isDragActive: true, isDragAccept: true });
            const { container } = setup();

            expect(getDropzone(container)).toHaveStyle({ borderColor: theme.palette.success.main });
        });

        it('should be error when drag is rejected', () => {
            useDropzone.mockReturnValue({ ...dropzoneStateDefaultState, isDragActive: true, isDragReject: true });
            const { container } = setup();

            expect(getDropzone(container)).toHaveStyle({ borderColor: theme.palette.error.main });
        });

        it('should prioritize isDragReject over isDragAccept and isDragActive', () => {
            useDropzone.mockReturnValue({
                ...dropzoneStateDefaultState,
                isDragActive: true,
                isDragAccept: true,
                isDragReject: true,
            });
            const { container } = setup();

            expect(getDropzone(container)).toHaveStyle({ borderColor: theme.palette.error.main });
        });

        it('should be error after a rejected drop', () => {
            const { container, rerender } = setup();
            const { onDropRejected } = useDropzone.mock.calls[0][0];

            act(() => onDropRejected());
            setup({}, rerender);

            expect(getDropzone(container)).toHaveStyle({ borderColor: theme.palette.error.main });
        });

        it('should show drag colors instead of error when a new drag starts after a rejection', () => {
            const { container, rerender } = setup();
            const { onDropRejected } = useDropzone.mock.calls[0][0];

            act(() => onDropRejected());
            useDropzone.mockReturnValue({ ...dropzoneStateDefaultState, isDragActive: true });
            setup({ onChange: jest.fn() }, rerender);

            expect(getDropzone(container)).toHaveStyle({ borderColor: theme.palette.primary.main });
        });

        it('should clear the error border after a subsequent successful drop', () => {
            const { container, rerender } = setup();
            const { onDropRejected } = useDropzone.mock.calls[0][0];

            act(() => onDropRejected());
            act(() => useDropzone.mock.lastCall[0].onDrop([new File(['content'], 'image.png')]));
            setup({}, rerender);

            expect(getDropzone(container)).toHaveStyle({ borderColor: theme.palette.divider });
        });
    });
});

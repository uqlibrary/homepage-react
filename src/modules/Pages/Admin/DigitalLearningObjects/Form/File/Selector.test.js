import React from 'react';
import { useDropzone } from 'react-dropzone';
import Selector from './Selector';
import { render } from '@testing-library/react';
import { createTheme } from '@mui/material/styles';

jest.mock('react-dropzone', () => ({
    useDropzone: jest.fn(),
}));

const theme = createTheme();

const onChange = jest.fn();
const getRootProps = jest.fn(() => ({}));
const getInputProps = jest.fn(() => ({}));

const setup = (testProps = {}) => {
    const props = {
        onChange,
        ...testProps,
    };
    return render(<Selector {...props} />);
};

describe('Selector', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useDropzone.mockReturnValue({
            getRootProps,
            getInputProps,
            isDragActive: false,
            isDragAccept: false,
            isDragReject: false,
        });
    });

    it('should render dropzone text', () => {
        const { getByText } = setup();

        expect(getByText(/drag 'n' drop some files here/i)).toBeInTheDocument();
        expect(getByText(/only \*\.jpeg and \*\.png images will be accepted/i)).toBeInTheDocument();
    });

    it('should configure useDropzone with correct accept and multiple options', () => {
        setup();

        expect(useDropzone).toHaveBeenCalledWith(
            expect.objectContaining({
                accept: { 'image/jpeg': [], 'image/png': [] },
                multiple: false,
            }),
        );
    });

    it('should call onChange with first file when a file is dropped', () => {
        setup();
        const { onDrop } = useDropzone.mock.calls[0][0];
        const file = new File(['content'], 'image.png', { type: 'image/png' });

        onDrop([file]);

        expect(onChange).toHaveBeenCalledWith(file);
    });

    it('should not call onChange when no files are dropped', () => {
        setup();
        const { onDrop } = useDropzone.mock.calls[0][0];

        onDrop([]);

        expect(onChange).not.toHaveBeenCalled();
    });

    it('should apply root and input props from useDropzone', () => {
        setup();

        expect(getRootProps).toHaveBeenCalled();
        expect(getInputProps).toHaveBeenCalled();
    });

    it('should set border color to success when isDragAccept is true', () => {
        useDropzone.mockReturnValue({
            getRootProps,
            getInputProps,
            isDragActive: false,
            isDragAccept: true,
            isDragReject: false,
        });
        const { container } = setup();

        expect(container.firstChild.firstChild).toHaveStyle({ borderColor: theme.palette.success.main });
    });

    it('should set border color to error when isDragReject is true', () => {
        useDropzone.mockReturnValue({
            getRootProps,
            getInputProps,
            isDragActive: false,
            isDragAccept: false,
            isDragReject: true,
        });
        const { container } = setup();

        expect(container.firstChild.firstChild).toHaveStyle({ borderColor: theme.palette.error.main });
    });

    it('should set border color to primary when isDragActive is true', () => {
        useDropzone.mockReturnValue({
            getRootProps,
            getInputProps,
            isDragActive: true,
            isDragAccept: false,
            isDragReject: false,
        });
        const { container } = setup();

        expect(container.firstChild.firstChild).toHaveStyle({ borderColor: theme.palette.primary.main });
    });

    it('should set border color to divider by default', () => {
        const { container } = setup();

        expect(container.firstChild.firstChild).toHaveStyle({ borderColor: theme.palette.divider });
    });

    it('should prioritize isDragAccept over isDragReject and isDragActive', () => {
        useDropzone.mockReturnValue({
            getRootProps,
            getInputProps,
            isDragActive: true,
            isDragAccept: true,
            isDragReject: true,
        });
        const { container } = setup();

        expect(container.firstChild.firstChild).toHaveStyle({ borderColor: theme.palette.success.main });
    });
});

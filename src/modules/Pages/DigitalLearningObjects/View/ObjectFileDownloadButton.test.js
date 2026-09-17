import React from 'react';
import { render as defaultRender, userEvent } from 'test-utils';
import ObjectFileDownloadButton from './ObjectFileDownloadButton';
import { getDlorFileViewPageUrl } from '../dlorHelpers';

const setup = (props = {}, render = defaultRender) => render(<ObjectFileDownloadButton {...props} />);

describe('ObjectFileDownloadButton', () => {
    beforeEach(() => {
        window.open = jest.fn();
    });

    it('should render nothing when object file name is missing', () => {
        const { container } = setup();
        expect(container.firstChild).toBeNull();
    });

    it('should render the button without file details when there is no extension or size', () => {
        const { getByTestId } = setup({
            object: { object_file_name: 'file' },
            className: 'test',
        });

        expect(getByTestId('dlor-view-object-download-file-button')).toHaveTextContent('ACCESS THE OBJECT');
        expect(getByTestId('dlor-view-object-download-file-button')).not.toHaveTextContent('()');
        expect(getByTestId('dlor-view-object-download-file-button')).toHaveClass('test');
    });

    it('should render the file type', () => {
        const { getByTestId } = setup({
            object: { object_file_name: 'document.pdf' },
        });

        expect(getByTestId('dlor-view-object-download-file-button')).toHaveTextContent('ACCESS THE OBJECT');
        expect(getByTestId('dlor-view-object-download-file-button')).toHaveTextContent('(PDF)');
    });

    it('should render the formatted file size', () => {
        const { getByTestId } = setup({
            object: {
                object_file_name: 'document',
                object_file_size: 1000000,
            },
        });

        expect(getByTestId('dlor-view-object-download-file-button')).toHaveTextContent('(1.0 MB)');
    });

    it('should render the file type and formatted file size', () => {
        const { getByTestId } = setup({
            object: {
                object_file_name: 'document.pdf',
                object_file_size: 1000000,
            },
        });

        expect(getByTestId('dlor-view-object-download-file-button')).toHaveTextContent('(PDF 1.0 MB)');
    });

    it('should not render the size when file size is zero', () => {
        const { getByTestId } = setup({
            object: {
                object_file_name: 'document.pdf',
                object_file_size: 0,
            },
        });

        expect(getByTestId('dlor-view-object-download-file-button')).toHaveTextContent('(PDF)');
    });

    it('should open the object file in a new tab', async () => {
        const object = {
            object_id: 123,
            object_file_name: 'document.pdf',
            object_file_version: 'abcd-1234-efgh-5678',
        };

        const { getByTestId } = setup({ object });
        await userEvent.click(getByTestId('dlor-view-object-download-file-button'));

        expect(window.open).toHaveBeenCalledWith(getDlorFileViewPageUrl(object), '_blank', 'noopener,noreferrer');
    });
});

import React from 'react';
import { rtlRender, fireEvent, waitFor } from 'test-utils';
import DownloadAsCSV from './DownloadAsCSV';
import * as helpers from '../../helpers/helpers';

jest.mock('../../helpers/helpers', () => ({
    buildCSVString: jest.fn(),
    downloadCSVFile: jest.fn(),
}));

jest.mock('moment/moment', () => () => ({
    local: jest.fn().mockReturnThis(),
    format: jest.fn().mockReturnValue('20260120010203'),
}));

function setup(testProps = {}, renderer = rtlRender) {
    return renderer(<DownloadAsCSV {...testProps} />);
}

describe('DownloadAsCSV', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the download icon button with correct accessibility attributes', () => {
        const contents = jest.fn().mockReturnValue({ headers: [], data: [] });
        const { getByTestId, getByLabelText } = setup({ filename: 'report', contents });

        const btn = getByTestId('download-as-csv');
        expect(btn).toBeInTheDocument();
        expect(btn).toBeEnabled();

        expect(getByLabelText('Download as CSV')).toBeInTheDocument();
        expect(btn).toHaveAttribute('title', 'Download as CSV');
    });

    it('should render a disabled button when disabled prop is true', async () => {
        const contents = jest.fn().mockReturnValue({ headers: [], data: [] });
        const { getByTestId } = setup({ filename: 'report', contents, disabled: true });

        const btn = getByTestId('download-as-csv');
        expect(btn).toBeInTheDocument();
        expect(btn).toBeDisabled();

        fireEvent.click(btn);
        await waitFor(() => {
            expect(contents).not.toHaveBeenCalledTimes(1);
        });
    });

    it('should call contents() on click and triggers CSV creation + download with timestamped filename', async () => {
        const headers = ['h1', 'h2'];
        const data = [
            { h1: 'a', h2: 'b' },
            { h1: 'c', h2: 'd' },
        ];
        const contents = jest.fn().mockReturnValue({ headers, data });
        helpers.buildCSVString.mockReturnValue('csv-content');
        const { getByTestId } = setup({ filename: 'myfile', contents });

        fireEvent.click(getByTestId('download-as-csv'));
        await waitFor(() => {
            expect(contents).toHaveBeenCalledTimes(1);
            expect(helpers.buildCSVString).toHaveBeenCalledTimes(1);
            expect(helpers.buildCSVString).toHaveBeenCalledWith(headers, data);

            expect(helpers.downloadCSVFile).toHaveBeenCalledTimes(1);
            expect(helpers.downloadCSVFile).toHaveBeenCalledWith('csv-content', 'myfile-20260120010203');
        });
    });

    it('should handle different contents return values and forwards them to helpers', async () => {
        const headers = ['col'];
        const data = [['row1'], ['row2']];
        const contents = jest.fn().mockReturnValue({ headers, data });
        helpers.buildCSVString.mockReturnValue('csv-2');
        const { getByTestId } = setup({ filename: 'export', contents });

        fireEvent.click(getByTestId('download-as-csv'));
        await waitFor(() => {
            expect(helpers.buildCSVString).toHaveBeenCalledWith(headers, data);
            expect(helpers.downloadCSVFile).toHaveBeenCalledWith('csv-2', 'export-20260120010203');
        });
    });
});

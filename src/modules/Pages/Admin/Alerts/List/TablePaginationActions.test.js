import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { fireEvent, rtlRender } from 'test-utils';
import { TablePaginationActions } from './TablePaginationActions';

function setup(testProps = {}) {
    const props = {
        count: 23,
        page: 2,
        rowsPerPage: 5,
        onPageChange: jest.fn(),
        ...testProps,
    };
    return rtlRender(<TablePaginationActions {...props} />);
}

describe('TablePaginationActions', () => {
    it('renders as expected', () => {
        const { getByRole } = setup();
        expect(getByRole('button', { name: 'first page' }).querySelector('svg')).toHaveAttribute(
            'data-testid',
            'FirstPageIcon',
        );
        expect(getByRole('button', { name: 'previous page' }).querySelector('svg')).toHaveAttribute(
            'data-testid',
            'KeyboardArrowLeftIcon',
        );
        expect(getByRole('button', { name: 'next page' }).querySelector('svg')).toHaveAttribute(
            'data-testid',
            'KeyboardArrowRightIcon',
        );
        expect(getByRole('button', { name: 'last page' }).querySelector('svg')).toHaveAttribute(
            'data-testid',
            'LastPageIcon',
        );
    });

    it('calls onPageChange with the first, previous, next, and last page indexes', () => {
        const onPageChange = jest.fn();
        const { getByRole } = setup({ onPageChange });

        fireEvent.click(getByRole('button', { name: 'first page' }));
        expect(onPageChange).toHaveBeenCalledWith(expect.anything(), 0);
        fireEvent.click(getByRole('button', { name: 'previous page' }));
        expect(onPageChange).toHaveBeenCalledWith(expect.anything(), 1);
        fireEvent.click(getByRole('button', { name: 'next page' }));
        expect(onPageChange).toHaveBeenCalledWith(expect.anything(), 3);
        fireEvent.click(getByRole('button', { name: 'last page' }));
        expect(onPageChange).toHaveBeenCalledWith(expect.anything(), 4);
    });

    it('disables backward controls on the first page and forward controls on the last page', () => {
        const { getByRole, rerender } = setup({ count: 10, page: 0 });

        expect(getByRole('button', { name: 'first page' })).toBeDisabled();
        expect(getByRole('button', { name: 'previous page' })).toBeDisabled();
        expect(getByRole('button', { name: 'next page' })).toBeEnabled();
        expect(getByRole('button', { name: 'last page' })).toBeEnabled();

        rerender(<TablePaginationActions count={10} page={1} rowsPerPage={5} onPageChange={jest.fn()} />);

        expect(getByRole('button', { name: 'first page' })).toBeEnabled();
        expect(getByRole('button', { name: 'previous page' })).toBeEnabled();
        expect(getByRole('button', { name: 'next page' })).toBeDisabled();
        expect(getByRole('button', { name: 'last page' })).toBeDisabled();
    });

    it('uses direction-aware icons in right-to-left themes', () => {
        const theme = createTheme({ direction: 'rtl' });
        const { getByRole } = rtlRender(
            <ThemeProvider theme={theme}>
                <TablePaginationActions count={10} page={0} rowsPerPage={5} onPageChange={jest.fn()} />
            </ThemeProvider>,
        );

        expect(getByRole('button', { name: 'first page' }).querySelector('svg')).toHaveAttribute(
            'data-testid',
            'LastPageIcon',
        );
        expect(getByRole('button', { name: 'previous page' }).querySelector('svg')).toHaveAttribute(
            'data-testid',
            'KeyboardArrowRightIcon',
        );
        expect(getByRole('button', { name: 'next page' }).querySelector('svg')).toHaveAttribute(
            'data-testid',
            'KeyboardArrowLeftIcon',
        );
        expect(getByRole('button', { name: 'last page' }).querySelector('svg')).toHaveAttribute(
            'data-testid',
            'FirstPageIcon',
        );
    });
});

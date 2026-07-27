import React from 'react';

import { fireEvent, rtlRender, screen } from 'test-utils';

import SpacesPagination from './SpacesPagination';

describe('SpacesPagination', () => {
    const renderPagination = props =>
        rtlRender(<SpacesPagination page={1} count={1} totalItems={10} itemsPerPage={10} onPageChange={jest.fn()} {...props} />);

    it('shows all page buttons when there are 5 or fewer pages', () => {
        renderPagination({ page: 3, count: 5, totalItems: 50 });

        expect(screen.getByRole('button', { name: 'Previous page' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Next page' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Page 2' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Page 3' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Page 4' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Page 5' })).toBeInTheDocument();
        expect(screen.queryByLabelText(/Skip to page/i)).not.toBeInTheDocument();
    });

    it('hides previous on the first page and next on the last page', () => {
        const { rerender } = renderPagination({ page: 1, count: 5, totalItems: 50 });

        expect(screen.queryByRole('button', { name: 'Previous page' })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Next page' })).toBeInTheDocument();

        rerender(<SpacesPagination page={5} count={5} totalItems={50} itemsPerPage={10} onPageChange={jest.fn()} />);

        expect(screen.getByRole('button', { name: 'Previous page' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Next page' })).not.toBeInTheDocument();
    });

    it('shows first four pages and forward ellipsis on first or second page for large sets', () => {
        renderPagination({ page: 2, count: 13, totalItems: 130 });

        expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Page 2' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Page 3' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Page 4' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Page 13' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Skip to page 5...' })).toBeInTheDocument();
    });

    it('shows last four pages and backward ellipsis on last or second last page for large sets', () => {
        renderPagination({ page: 13, count: 13, totalItems: 130 });

        expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Skip to page 10...' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Page 10' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Page 11' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Page 12' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Page 13' })).toBeInTheDocument();
    });

    it('uses 3-page skips when clicking ellipses in the middle range', () => {
        const onPageChange = jest.fn();
        renderPagination({ page: 6, count: 13, totalItems: 130, onPageChange });

        fireEvent.click(screen.getByRole('button', { name: 'Skip to page 3...' }));
        fireEvent.click(screen.getByRole('button', { name: 'Skip to page 9...' }));

        expect(onPageChange).toHaveBeenNthCalledWith(1, 3);
        expect(onPageChange).toHaveBeenNthCalledWith(2, 9);
    });
});

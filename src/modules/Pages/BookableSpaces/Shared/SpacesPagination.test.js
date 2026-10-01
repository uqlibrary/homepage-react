import React from 'react';

import { fireEvent, rtlRender, screen } from 'test-utils';

import SpacesPagination from 'modules/Pages/BookableSpaces/Shared/SpacesPagination';

const findElementByAriaLabel = (node, label) => {
    if (!node || typeof node !== 'object') {
        return null;
    }

    if (node.props && node.props['aria-label'] === label) {
        return node;
    }

    const children = React.Children.toArray(node.props?.children || []);
    for (const child of children) {
        const found = findElementByAriaLabel(child, label);
        if (found) {
            return found;
        }
    }

    return null;
};

describe('SpacesPagination', () => {
    const renderPagination = props =>
        rtlRender(
            <SpacesPagination
                page={1}
                count={1}
                totalItems={10}
                itemsPerPage={10}
                onPageChange={jest.fn()}
                {...props}
            />,
        );

    it('returns null when there are no pages or no total items to show', () => {
        expect(
            SpacesPagination({ page: 1, count: 0, totalItems: 50, itemsPerPage: 10, onPageChange: jest.fn() }),
        ).toBeNull();
        expect(
            SpacesPagination({ page: 1, count: 3, totalItems: 0, itemsPerPage: 10, onPageChange: jest.fn() }),
        ).toBeNull();
    });

    it('shows all page buttons when there are five or fewer pages', () => {
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

    it('shows the first page cluster and forward ellipsis on early pages', () => {
        renderPagination({ page: 2, count: 13, totalItems: 130 });

        expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Page 2' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Page 3' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Page 4' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Page 13' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Skip to page 5...' })).toBeInTheDocument();
    });

    it('shows the last page cluster and backward ellipsis on late pages', () => {
        renderPagination({ page: 13, count: 13, totalItems: 130 });

        expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Skip to page 10...' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Page 10' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Page 11' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Page 12' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Page 13' })).toBeInTheDocument();
    });

    it('shows the middle page cluster with both ellipses', () => {
        renderPagination({ page: 6, count: 13, totalItems: 130 });

        expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Skip to page 3...' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Page 5' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Page 6' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Page 7' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Skip to page 9...' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Page 13' })).toBeInTheDocument();
    });

    it('ignores the current page and out-of-range page selections', () => {
        const onPageChange = jest.fn();
        const element = SpacesPagination({ page: 2, count: 5, totalItems: 50, itemsPerPage: 10, onPageChange });
        const samePageButton = findElementByAriaLabel(element, 'Page 2');

        samePageButton.props.onClick();
        samePageButton.props.onClick(0);
        samePageButton.props.onClick(99);

        expect(onPageChange).not.toHaveBeenCalled();
    });

    it('handles previous and next arrow clicks without re-selecting the current page', () => {
        const onPageChange = jest.fn();
        renderPagination({ page: 2, count: 5, totalItems: 50, onPageChange });

        fireEvent.click(screen.getByRole('button', { name: 'Previous page' }));
        fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
        fireEvent.click(screen.getByRole('button', { name: 'Page 2' }));

        expect(onPageChange).toHaveBeenNthCalledWith(1, 1);
        expect(onPageChange).toHaveBeenNthCalledWith(2, 3);
        expect(onPageChange).toHaveBeenCalledTimes(2);
    });

    it('uses 3-page skips when clicking ellipses in the middle range', () => {
        const onPageChange = jest.fn();
        renderPagination({ page: 6, count: 13, totalItems: 130, onPageChange });

        fireEvent.click(screen.getByRole('button', { name: 'Skip to page 3...' }));
        fireEvent.click(screen.getByRole('button', { name: 'Skip to page 9...' }));

        expect(onPageChange).toHaveBeenNthCalledWith(1, 3);
        expect(onPageChange).toHaveBeenNthCalledWith(2, 9);
    });

    it('scrolls the results list back to the top when the preferred page target succeeds', () => {
        const onPageChange = jest.fn();
        const resultsView = document.createElement('section');
        resultsView.setAttribute('data-testid', 'bookable-spaces-journey-results-view');
        resultsView.scrollIntoView = jest.fn();
        document.body.appendChild(resultsView);

        try {
            renderPagination({ page: 1, count: 4, totalItems: 40, itemsPerPage: 10, onPageChange });
            fireEvent.click(screen.getByRole('button', { name: 'Page 2' }));

            expect(resultsView.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
            expect(onPageChange).toHaveBeenCalledWith(2);
        } finally {
            document.body.removeChild(resultsView);
        }
    });

    it('uses the space-wrapper fallback target when the results list is missing', () => {
        const onPageChange = jest.fn();
        const wrapper = document.createElement('div');
        wrapper.setAttribute('id', 'space-wrapper');
        wrapper.scrollIntoView = jest.fn();
        document.body.appendChild(wrapper);

        try {
            const element = SpacesPagination({ page: 1, count: 4, totalItems: 40, itemsPerPage: 10, onPageChange });
            const nextPageButton = findElementByAriaLabel(element, 'Page 2');
            nextPageButton.props.onClick();

            expect(wrapper.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
            expect(onPageChange).toHaveBeenCalledWith(2);
        } finally {
            document.body.removeChild(wrapper);
        }
    });

    it('uses the content fallback target when the wrapper is missing', () => {
        const onPageChange = jest.fn();
        const content = document.createElement('div');
        content.setAttribute('id', 'content');
        content.scrollIntoView = jest.fn();
        document.body.appendChild(content);

        try {
            const element = SpacesPagination({ page: 1, count: 4, totalItems: 40, itemsPerPage: 10, onPageChange });
            const nextPageButton = findElementByAriaLabel(element, 'Page 2');
            nextPageButton.props.onClick();

            expect(content.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
            expect(onPageChange).toHaveBeenCalledWith(2);
        } finally {
            document.body.removeChild(content);
        }
    });

    it('uses the main element as the final scroll fallback target', () => {
        const onPageChange = jest.fn();
        const main = document.createElement('main');
        main.scrollIntoView = jest.fn();
        document.body.appendChild(main);

        try {
            const element = SpacesPagination({ page: 1, count: 4, totalItems: 40, itemsPerPage: 10, onPageChange });
            const nextPageButton = findElementByAriaLabel(element, 'Page 2');
            nextPageButton.props.onClick();

            expect(main.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
            expect(onPageChange).toHaveBeenCalledWith(2);
        } finally {
            document.body.removeChild(main);
        }
    });

    it('falls back to the scrollTo method when scrollIntoView throws', () => {
        const onPageChange = jest.fn();
        const resultsView = document.createElement('section');
        resultsView.setAttribute('data-testid', 'bookable-spaces-journey-results-view');
        resultsView.scrollIntoView = jest.fn(() => {
            throw new Error('scrollIntoView failed');
        });
        resultsView.scrollTo = jest.fn();
        document.body.appendChild(resultsView);

        try {
            renderPagination({ page: 1, count: 4, totalItems: 40, itemsPerPage: 10, onPageChange });
            fireEvent.click(screen.getByRole('button', { name: 'Page 2' }));

            expect(resultsView.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
            expect(resultsView.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'smooth' });
            expect(onPageChange).toHaveBeenCalledWith(2);
        } finally {
            document.body.removeChild(resultsView);
        }
    });

    it('falls back to the window scroll when no results target is available', () => {
        const onPageChange = jest.fn();
        const previousWindowScrollTo = window.scrollTo;
        window.scrollTo = jest.fn();

        try {
            const element = SpacesPagination({ page: 1, count: 4, totalItems: 40, itemsPerPage: 10, onPageChange });
            const nextPageButton = findElementByAriaLabel(element, 'Page 2');
            nextPageButton.props.onClick();

            expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'smooth' });
            expect(onPageChange).toHaveBeenCalledWith(2);
        } finally {
            window.scrollTo = previousWindowScrollTo;
        }
    });

    it('falls back to the numeric window scroll when the object-style call throws', () => {
        const onPageChange = jest.fn();
        const previousWindowScrollTo = window.scrollTo;
        window.scrollTo = jest
            .fn()
            .mockImplementationOnce(() => {
                throw new Error('object signature failed');
            })
            .mockImplementationOnce(() => undefined);

        const resultsView = document.createElement('section');
        resultsView.setAttribute('data-testid', 'bookable-spaces-journey-results-view');
        document.body.appendChild(resultsView);

        try {
            const element = SpacesPagination({ page: 1, count: 4, totalItems: 40, itemsPerPage: 10, onPageChange });
            const nextPageButton = findElementByAriaLabel(element, 'Page 2');
            nextPageButton.props.onClick();

            expect(window.scrollTo).toHaveBeenNthCalledWith(1, { top: 0, left: 0, behavior: 'smooth' });
            expect(window.scrollTo).toHaveBeenNthCalledWith(2, 0, 0);
            expect(onPageChange).toHaveBeenCalledWith(2);
        } finally {
            document.body.removeChild(resultsView);
            window.scrollTo = previousWindowScrollTo;
        }
    });

    it('returns early when document is unavailable during scroll handling', () => {
        const onPageChange = jest.fn();
        const element = SpacesPagination({ page: 1, count: 4, totalItems: 40, itemsPerPage: 10, onPageChange });
        const nextPageButton = findElementByAriaLabel(element, 'Page 2');
        const originalDocument = global.document;

        try {
            global.document = undefined;
            nextPageButton.props.onClick();
            expect(onPageChange).toHaveBeenCalledWith(2);
        } finally {
            global.document = originalDocument;
        }
    });

    it('does nothing when window.scrollTo is unavailable and no target is present', () => {
        const onPageChange = jest.fn();
        const originalWindowScrollTo = Object.getOwnPropertyDescriptor(window, 'scrollTo');
        const previousBodyHtml = document.body.innerHTML;

        document.body.innerHTML = '';

        try {
            Object.defineProperty(window, 'scrollTo', {
                value: undefined,
                configurable: true,
                writable: true,
            });

            const element = SpacesPagination({ page: 1, count: 4, totalItems: 40, itemsPerPage: 10, onPageChange });
            const nextPageButton = findElementByAriaLabel(element, 'Page 2');
            nextPageButton.props.onClick();

            expect(onPageChange).toHaveBeenCalledWith(2);
        } finally {
            if (originalWindowScrollTo) {
                Object.defineProperty(window, 'scrollTo', originalWindowScrollTo);
            } else {
                delete window.scrollTo;
            }

            document.body.innerHTML = previousBodyHtml;
        }
    });
});

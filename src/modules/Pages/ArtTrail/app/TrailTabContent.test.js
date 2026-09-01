/* eslint-disable react/prop-types */
import React from 'react';
import { act, fireEvent, rtlRender } from 'test-utils';

import TrailTabContent from './TrailTabContent';

const FORWARD_PAGE_TRANSITION_DURATION_MS = 1000;
const BACKWARD_PAGE_TRANSITION_DURATION_MS = 500;

const defaultTab = {
    label: 'Trail',
    subtitle: 'Explore the collection',
};

const createMockPage = testId => {
    const MockPage = ({ tab, openDrawer, mediaStopSignal }) => (
        <div data-testid={testId}>
            <h1 tabIndex={-1}>{testId} heading</h1>
            <div>{tab.label}</div>
            <div>{tab.subtitle}</div>
            <div>{mediaStopSignal}</div>
            <button onClick={() => openDrawer(testId)} type="button">
                Open drawer for {testId}
            </button>
        </div>
    );

    MockPage.displayName = `MockPage${testId}`;

    return MockPage;
};

const setup = (props = {}) =>
    rtlRender(
        <TrailTabContent
            tab={defaultTab}
            page={createMockPage('page-one')}
            pageKey="page-one"
            openDrawer={jest.fn()}
            navigationDirection="forward"
            mediaStopSignal="trail:0"
            {...props}
        />,
    );

describe('TrailTabContent', () => {
    const originalRequestAnimationFrame = window.requestAnimationFrame;
    const originalCancelAnimationFrame = window.cancelAnimationFrame;

    beforeEach(() => {
        jest.useFakeTimers();
        window.requestAnimationFrame = callback => window.setTimeout(callback, 0);
        window.cancelAnimationFrame = handle => window.clearTimeout(handle);
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
        window.requestAnimationFrame = originalRequestAnimationFrame;
        window.cancelAnimationFrame = originalCancelAnimationFrame;
    });

    it('renders the active page and passes through tab, drawer, and media props', () => {
        const openDrawer = jest.fn();
        const { getByRole, getByTestId, getByText } = setup({ openDrawer, mediaStopSignal: 'trail:5' });

        expect(getByTestId('page-one')).toBeInTheDocument();
        expect(getByText(defaultTab.label)).toBeInTheDocument();
        expect(getByText(defaultTab.subtitle)).toBeInTheDocument();
        expect(getByText('trail:5')).toBeInTheDocument();

        fireEvent.click(getByRole('button', { name: 'Open drawer for page-one' }));

        expect(openDrawer).toHaveBeenCalledWith('page-one');
    });

    it('keeps the previous page mounted during a forward transition and removes it after completion', () => {
        const PageOne = createMockPage('page-one');
        const PageTwo = createMockPage('page-two');
        const { getByTestId, queryByTestId, rerender } = setup({ page: PageOne, pageKey: 'page-one' });

        rerender(
            <TrailTabContent
                tab={defaultTab}
                page={PageTwo}
                pageKey="page-two"
                openDrawer={jest.fn()}
                navigationDirection="forward"
                mediaStopSignal="trail:0"
            />,
        );

        expect(getByTestId('page-one')).toBeInTheDocument();
        expect(getByTestId('page-two')).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(FORWARD_PAGE_TRANSITION_DURATION_MS - 1);
        });

        expect(getByTestId('page-one')).toBeInTheDocument();
        expect(getByTestId('page-two')).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(1);
        });

        expect(queryByTestId('page-one')).not.toBeInTheDocument();
        expect(getByTestId('page-two')).toBeInTheDocument();
    });

    it('moves focus to the incoming page heading', () => {
        const PageOne = createMockPage('page-one');
        const PageTwo = createMockPage('page-two');
        const { getByRole, rerender } = setup({ page: PageOne, pageKey: 'page-one' });

        rerender(
            <TrailTabContent
                tab={defaultTab}
                page={PageTwo}
                pageKey="page-two"
                openDrawer={jest.fn()}
                navigationDirection="forward"
                mediaStopSignal="trail:1"
            />,
        );

        act(() => {
            jest.advanceTimersByTime(0);
        });

        expect(getByRole('heading', { name: 'page-two heading' })).toHaveFocus();
    });

    it('uses the shorter backward transition duration before removing the previous page', () => {
        const PageOne = createMockPage('page-one');
        const PageTwo = createMockPage('page-two');
        const { getByTestId, queryByTestId, rerender } = setup({ page: PageOne, pageKey: 'page-one' });

        rerender(
            <TrailTabContent
                tab={defaultTab}
                page={PageTwo}
                pageKey="page-two"
                openDrawer={jest.fn()}
                navigationDirection="backward"
                mediaStopSignal="trail:0"
            />,
        );

        act(() => {
            jest.advanceTimersByTime(BACKWARD_PAGE_TRANSITION_DURATION_MS - 1);
        });

        expect(getByTestId('page-one')).toBeInTheDocument();
        expect(getByTestId('page-two')).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(1);
        });

        expect(queryByTestId('page-one')).not.toBeInTheDocument();
        expect(getByTestId('page-two')).toBeInTheDocument();
    });
});

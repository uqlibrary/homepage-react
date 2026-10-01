import React from 'react';
import { act, rtlRender } from 'test-utils';

import AriaAnnounce from './AriaAnnounce';

const setup = (props = {}) => rtlRender(<AriaAnnounce message="Artwork details loaded" {...props} />);

describe('AriaAnnounce', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    it('renders a polite atomic announcement', () => {
        const { getByTestId } = setup();

        const announcement = getByTestId('aria-announcement');
        expect(announcement).toBeEmptyDOMElement();
        act(() => {
            jest.advanceTimersByTime(50);
        });
        expect(announcement).toHaveTextContent('Artwork details loaded');
        expect(announcement).toHaveAttribute('role', 'status');
        expect(announcement).toHaveAttribute('aria-live', 'polite');
        expect(announcement).toHaveAttribute('aria-atomic', 'true');
    });

    it('updates the existing live region when the message changes', () => {
        const { getByTestId, rerender } = setup();
        const announcement = getByTestId('aria-announcement');

        act(() => {
            jest.advanceTimersByTime(50);
        });
        rerender(<AriaAnnounce message="Map: Art Trail Map of St Lucia campus" />);

        expect(getByTestId('aria-announcement')).toBe(announcement);
        expect(announcement).toBeEmptyDOMElement();

        act(() => {
            jest.advanceTimersByTime(50);
        });
        expect(announcement).toHaveTextContent('Map: Art Trail Map of St Lucia campus');
    });

    it('visually hides the announcement', () => {
        const { getByTestId } = setup();

        expect(getByTestId('aria-announcement')).toHaveStyle({
            height: '1px',
            margin: '-1px',
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            width: '1px',
        });
    });
});

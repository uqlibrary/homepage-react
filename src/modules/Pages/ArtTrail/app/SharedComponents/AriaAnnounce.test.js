import React from 'react';
import { rtlRender } from 'test-utils';

import AriaAnnounce from './AriaAnnounce';

const setup = (props = {}) => rtlRender(<AriaAnnounce message="Artwork details loaded" {...props} />);

describe('AriaAnnounce', () => {
    it('renders a polite atomic announcement', () => {
        const { getByTestId } = setup();

        const announcement = getByTestId('aria-announcement');
        expect(announcement).toHaveTextContent('Artwork details loaded');
        expect(announcement).toHaveAttribute('aria-live', 'polite');
        expect(announcement).toHaveAttribute('aria-atomic', 'true');
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

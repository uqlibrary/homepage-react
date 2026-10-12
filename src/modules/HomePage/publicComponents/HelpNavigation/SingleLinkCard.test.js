import React from 'react';
import { rtlRender, WithRouter } from 'test-utils';

import SingleLinkCard from './SingleLinkCard';
import { bookOpenBookmarkBackgroundImage } from './icons';

function setup(props = {}) {
    return rtlRender(
        <WithRouter>
            <ul>
                <SingleLinkCard
                    cardHeading="Find and borrow"
                    landingUrl="/find-and-borrow"
                    iconBackgroundImage={bookOpenBookmarkBackgroundImage}
                    shortParagraph="Discover library collections and memberships."
                    {...props}
                />
            </ul>
        </WithRouter>,
    );
}

describe('SingleLinkCard', () => {
    it('renders the card content, icon and destination', () => {
        const { container, getByRole, getByText } = setup();

        expect(getByRole('listitem')).toBeInTheDocument();
        expect(getByRole('link', { name: /Find and borrow/ })).toHaveAttribute('href', '/find-and-borrow');
        expect(getByRole('heading', { name: 'Find and borrow', level: 2 })).toBeInTheDocument();
        expect(getByText('Discover library collections and memberships.')).toBeInTheDocument();
        expect(container.querySelector('.panelIcon')).toHaveStyle(
            `background-image: url(${bookOpenBookmarkBackgroundImage})`,
        );
    });

    it('uses a third-level heading for signed-in users', () => {
        const { getByRole, queryByRole } = setup({ loggedIn: true });

        expect(getByRole('heading', { name: 'Find and borrow', level: 3 })).toBeInTheDocument();
        expect(queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    });

    it('uses a second-level heading for signed-out users', () => {
        const { getByRole, queryByRole } = setup({ loggedIn: false });

        expect(getByRole('heading', { name: 'Find and borrow', level: 2 })).toBeInTheDocument();
        expect(queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
    });
});

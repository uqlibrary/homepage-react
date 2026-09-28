import React from 'react';

import { fireEvent } from '@testing-library/react';

import { rtlRender, screen, WithRouter } from 'test-utils';

import { SpacesQuickLinks } from './SpacesQuickLinks';

jest.mock('modules/HomePage/publicComponents/HelpNavigation/SingleLinkCard', () => {
    function MockSingleLinkCard({ testId, cardHeading, shortParagraph, landingUrl, onNavigate }) {
        return (
            <button type="button" data-testid={testId} data-landing-url={landingUrl} onClick={onNavigate}>
                {cardHeading}
                {shortParagraph ? <span>{shortParagraph}</span> : null}
            </button>
        );
    }

    return MockSingleLinkCard;
});

describe('SpacesQuickLinks', () => {
    const defaultProps = {
        navigateToView: jest.fn(),
        availableIntentDefinitionsForLanding: [
            { id: 'quiet', label: 'Quiet study', description: 'A calm space to read', IconSvg: null },
            { id: 'group', label: 'Group rooms', IconSvg: 'group-icon' },
            { id: 'favourite', label: 'Favourites', description: 'Saved spaces', IconSvg: null },
            null,
        ],
        favouriteIntentDefinition: { id: 'favourite' },
        getIntentLandingUrl: jest.fn(intent => `/spaces/results/${intent?.id || 'all'}`),
        onIntentLinkNavigate: jest.fn(),
        onSeeAllSpaces: jest.fn(),
    };

    it('renders the landing header, filters out the favourite intent, and triggers the results navigation', () => {
        rtlRender(
            <WithRouter route="/" initialEntries={['/']}>
                <SpacesQuickLinks {...defaultProps} />
            </WithRouter>,
        );

        expect(screen.getByRole('heading', { name: 'Find a study space' })).toBeInTheDocument();
        expect(screen.getByTestId('spaces-journey-intent-card-quiet')).toHaveTextContent('Quiet study');
        expect(screen.getByTestId('spaces-journey-intent-card-group')).toHaveTextContent('Group rooms');
        expect(screen.queryByTestId('spaces-journey-intent-card-favourite')).not.toBeInTheDocument();
        expect(screen.getByTestId('spaces-journey-intent-card-quiet')).toHaveAttribute(
            'data-landing-url',
            '/spaces/results/quiet',
        );

        fireEvent.click(screen.getByRole('link', { name: 'See all spaces' }));

        expect(defaultProps.onSeeAllSpaces).toHaveBeenCalledTimes(1);
        expect(defaultProps.navigateToView).toHaveBeenCalledWith('results');

        fireEvent.click(screen.getByTestId('spaces-journey-intent-card-quiet'));
        expect(defaultProps.onIntentLinkNavigate).toHaveBeenCalledWith(expect.objectContaining({ id: 'quiet' }));
    });

    it('handles missing optional callbacks and an absent intent list without crashing', () => {
        const props = {
            ...defaultProps,
            navigateToView: jest.fn(),
            availableIntentDefinitionsForLanding: null,
            onIntentLinkNavigate: undefined,
            onSeeAllSpaces: undefined,
        };

        rtlRender(
            <WithRouter route="/" initialEntries={['/']}>
                <SpacesQuickLinks {...props} />
            </WithRouter>,
        );

        expect(screen.queryByTestId('spaces-journey-intent-card-0')).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole('link', { name: 'See all spaces' }));
        expect(props.navigateToView).toHaveBeenCalledWith('results');
    });

    it('renders intent cards without an onNavigate callback when the optional handler is omitted', () => {
        rtlRender(
            <WithRouter route="/" initialEntries={['/']}>
                <SpacesQuickLinks
                    {...defaultProps}
                    onIntentLinkNavigate={undefined}
                    onSeeAllSpaces={undefined}
                    availableIntentDefinitionsForLanding={[
                        { id: 'quiet', label: 'Quiet study', description: 'A calm space to read', IconSvg: null },
                    ]}
                />
            </WithRouter>,
        );

        const card = screen.getByTestId('spaces-journey-intent-card-quiet');
        expect(card).toBeInTheDocument();
        expect(card).not.toHaveAttribute('onclick');
    });

    it('skips falsy entries and keeps the favourite filter false path while using the filtered index for unnamed cards', () => {
        const props = {
            ...defaultProps,
            availableIntentDefinitionsForLanding: [
                null,
                { id: 'favourite', label: 'Favourites', description: 'Saved spaces', IconSvg: null },
                { label: 'Untitled intent', description: 'Fallback label', IconSvg: null },
                { id: 'quiet', label: 'Quiet study', description: 'Shared quiet desk', IconSvg: null },
            ],
            favouriteIntentDefinition: { id: 'favourite' },
        };

        rtlRender(
            <WithRouter route="/" initialEntries={['/']}>
                <SpacesQuickLinks {...props} />
            </WithRouter>,
        );

        expect(screen.getByTestId('spaces-journey-intent-card-0')).toHaveTextContent('Untitled intent');
        expect(screen.getByTestId('spaces-journey-intent-card-quiet')).toHaveTextContent('Quiet study');
        expect(screen.queryByTestId('spaces-journey-intent-card-favourite')).not.toBeInTheDocument();
    });

    it('renders the additional GridOfLinks links and preserves the built-in external destinations', () => {
        rtlRender(
            <WithRouter route="/" initialEntries={['/']}>
                <SpacesQuickLinks {...defaultProps} />
            </WithRouter>,
        );

        expect(screen.getByRole('heading', { name: 'Using library spaces' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Book a library study space' })).toHaveAttribute(
            'href',
            'https://web.library.uq.edu.au/visit/using-library-study-spaces#bookings',
        );
        expect(screen.getByRole('link', { name: 'Opening hours' })).toHaveAttribute(
            'href',
            'https://web.library.uq.edu.au/visit/all-opening-hours',
        );
    });
});

import React from 'react';

import { fireEvent, render } from '@testing-library/react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { createMemoryRouter, RouterProvider } from 'react-router';

import { mui1theme } from 'config/theme';
import { screen } from 'test-utils';

import { FavouritesList } from './FavouritesList';

const renderWithProviders = ui => {
    const router = createMemoryRouter([{ path: '/', element: ui }], { initialEntries: ['/'] });
    return render(
        <MuiThemeProvider theme={mui1theme}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <RouterProvider router={router} />
            </LocalizationProvider>
        </MuiThemeProvider>,
    );
};

describe('FavouritesList', () => {
    const defaultProps = {
        actions: {},
        favouriteIntentDefinition: { id: 'quiet' },
        setSelectedIntentId: jest.fn(),
        navigateToView: jest.fn(),
        activateFavouritesResults: jest.fn(),
        allSpaceLocations: [],
        filteredSpaceLocations: [],
        highlightedSpace: null,
        spacesFavouritesList: [],
        selectedIntentId: 'quiet',
        setSelectedSpace: jest.fn(),
        findSpaceById: (spaces, id) => (spaces || []).find(space => String(space?.space_id) === String(id)),
        getSpaceIdentifier: space => space?.space_uuid || space?.space_id || null,
    };

    it('renders the favourites heading and triggers the all-favourites route action', () => {
        const props = {
            ...defaultProps,
            spacesFavouritesList: [{ space_id: 10, label: 'Room 10' }],
            filteredSpaceLocations: [
                {
                    space_id: 10,
                    space_name: 'Room 10',
                    space_type_details: { space_type_name: 'Study' },
                    space_library_name: 'Library',
                },
            ],
        };

        renderWithProviders(<FavouritesList {...props} />);

        const allLink = screen.getByTestId('spaces-homepage-favourites-all-link');
        expect(allLink).toHaveAttribute('href', '/spaces/results');

        fireEvent.click(allLink);
        expect(props.setSelectedIntentId).toHaveBeenCalledWith('quiet');
        expect(props.activateFavouritesResults).toHaveBeenCalledTimes(1);
    });

    it('renders a plain-text empty-state prompt when no favourites are saved or the list is null', () => {
        renderWithProviders(<FavouritesList {...defaultProps} spacesFavouritesList={null} />);

        expect(screen.getByText('Your favourite spaces')).toBeInTheDocument();
        expect(
            screen.getByText("Click the star icon next to a space's name to add to your favourites"),
        ).toBeInTheDocument();
        expect(screen.queryByTestId('spaces-homepage-favourites-all-link')).not.toBeInTheDocument();
    });

    it('ignores invalid item ids and handles favourite_id resolved values without changing output', () => {
        const props = {
            ...defaultProps,
            allSpaceLocations: null,
            filteredSpaceLocations: undefined,
            highlightedSpace: {
                space_id: 88,
                space_name: 'Highlighted room',
                space_type_details: { space_type_name: 'Pod' },
                space_library_name: 'Library',
            },
            spacesFavouritesList: [
                { label: 'No id favourite' },
                { favourite_id: 40, label: undefined },
                { favourite_id: 88, label: 'Highlighted room' },
                { favourite_id: 999, label: 'Missing room' },
                { space_id: 40, label: 'Duplicate room' },
            ],
            findSpaceById: (spaces, id) => {
                if (String(id) === '40') {
                    return {
                        space_id: 40,
                        space_library_name: 'Library',
                    };
                }
                if (String(id) === '88') {
                    return {
                        space_id: 88,
                        space_name: 'Highlighted room',
                        space_type_details: { space_type_name: 'Pod' },
                        space_library_name: 'Library',
                    };
                }
                return null;
            },
        };

        renderWithProviders(<FavouritesList {...props} />);

        expect(screen.getByTestId('spaces-homepage-favourites-block')).toBeInTheDocument();
        expect(screen.getByTestId('spaces-journey-favourite-card-1')).toHaveTextContent(/undefined/i);
        expect(screen.getByTestId('spaces-journey-favourite-card-2')).toHaveTextContent(/Highlighted room/i);
    });

    it('shows up to three deduplicated favourites and navigates to details when a space matches', () => {
        const setSelectedSpace = jest.fn();
        const navigateToView = jest.fn();
        const props = {
            ...defaultProps,
            setSelectedSpace,
            navigateToView,
            spacesFavouritesList: [
                { space_id: 10, label: 'Room 10' },
                { space_id: 10, label: 'Duplicate room' },
                { space_id: 20, label: 'Room 20' },
                { space_id: 30, label: 'Room 30' },
            ],
            allSpaceLocations: [
                {
                    space_id: 10,
                    space_name: 'Room 10',
                    space_type_details: { space_type_name: 'Study' },
                    space_library_name: 'Library',
                },
                {
                    space_id: 20,
                    space_name: 'Room 20',
                    space_type_details: { space_type_name: 'Study' },
                    space_library_name: 'Library',
                },
                {
                    space_id: 30,
                    space_name: 'Room 30',
                    space_type_details: { space_type_name: 'Study' },
                    space_library_name: 'Library',
                },
            ],
            filteredSpaceLocations: [
                {
                    space_id: 10,
                    space_name: 'Room 10',
                    space_type_details: { space_type_name: 'Study' },
                    space_library_name: 'Library',
                },
            ],
        };

        renderWithProviders(<FavouritesList {...props} />);

        expect(screen.getByTestId('spaces-journey-favourite-card-1')).toBeInTheDocument();
        expect(screen.getByTestId('spaces-journey-favourite-card-2')).toBeInTheDocument();
        expect(screen.getByTestId('spaces-journey-favourite-card-3')).toBeInTheDocument();
        expect(screen.queryByTestId('spaces-journey-favourite-card-4')).not.toBeInTheDocument();

        fireEvent.click(screen.getByTestId('spaces-journey-favourite-card-1'));

        expect(setSelectedSpace).toHaveBeenCalledWith(expect.objectContaining({ space_id: 10 }));
        expect(navigateToView).toHaveBeenCalledWith('details', {
            intentId: 'quiet',
            spaceId: 10,
        });
    });

    it('falls back to history pushState when a favourite cannot be resolved to an actual space', () => {
        const pushStateSpy = jest.spyOn(window.history, 'pushState');
        let lookupCallCount = 0;
        const props = {
            ...defaultProps,
            spacesFavouritesList: [{ space_id: 999, label: 'Missing room' }],
            allSpaceLocations: [
                {
                    space_id: 999,
                    space_name: 'Missing room',
                    space_type_details: { space_type_name: 'Study' },
                    space_library_name: 'Library',
                },
            ],
            filteredSpaceLocations: [],
            highlightedSpace: null,
            selectedIntentId: 'quiet',
            findSpaceById: (spaces, id) => {
                lookupCallCount += 1;
                if (lookupCallCount === 1) {
                    return (spaces || []).find(space => String(space?.space_id) === String(id));
                }
                return null;
            },
        };

        renderWithProviders(<FavouritesList {...props} />);

        fireEvent.click(screen.getByTestId('spaces-journey-favourite-card-1'));

        expect(pushStateSpy).toHaveBeenCalledWith(
            {
                journeyView: 'details',
                journeyIntentId: 'quiet',
                journeySpaceId: '999',
            },
            '',
            '/spaces/detail/999',
        );
    });
});

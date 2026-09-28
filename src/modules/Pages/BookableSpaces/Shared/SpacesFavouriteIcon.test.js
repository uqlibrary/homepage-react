import React from 'react';

import { act, fireEvent, rtlRender, screen, waitFor } from 'test-utils';
import { useAccountContext } from 'context';

import {
    displayToastErrorMessage,
    displayToastMessage,
} from 'modules/Pages/Admin/BookableSpaces/bookableSpacesAdminHelpers';
import { SpacesFavouriteIcon } from './SpacesFavouriteIcon';

jest.mock('context', () => ({
    useAccountContext: jest.fn(),
}));

jest.mock('modules/Pages/Admin/BookableSpaces/bookableSpacesAdminHelpers', () => ({
    displayToastErrorMessage: jest.fn(),
    displayToastMessage: jest.fn(),
}));

describe('SpacesFavouriteIcon', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useRealTimers();
        useAccountContext.mockReturnValue({ account: { id: 42 } });
    });

    it('renders nothing when the user is logged out', () => {
        useAccountContext.mockReturnValue({ account: null });

        const { container } = rtlRender(
            <SpacesFavouriteIcon actions={{ addSpaceFavourite: jest.fn() }} bookableSpace={{ space_id: 12 }} isFavourite={false} />,
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('renders a placeholder when the favourite state is unknown', () => {
        const { container } = rtlRender(
            <SpacesFavouriteIcon actions={{ addSpaceFavourite: jest.fn() }} bookableSpace={{ space_id: 12 }} isFavourite={undefined} />,
        );

        expect(container.querySelector('span')).toHaveStyle({ width: '24px' });
    });

    it('renders the add and remove favourite icons in their idle states', () => {
        const { rerender } = rtlRender(
            <SpacesFavouriteIcon actions={{ addSpaceFavourite: jest.fn() }} bookableSpace={{ space_id: 12 }} isFavourite={false} />,
        );

        expect(screen.getByTestId('space-12-detail-favourite')).toBeInTheDocument();
        expect(screen.getByLabelText('Add to Favourites')).toBeInTheDocument();

        rerender(
            <SpacesFavouriteIcon actions={{ removeSpaceFavourite: jest.fn() }} bookableSpace={{ space_id: 12 }} isFavourite />,
        );

        expect(screen.getByTestId('space-12-detail-unfavourite')).toBeInTheDocument();
    });

    it('shows a spinner while the favourite action is in progress', () => {
        const actions = {
            addSpaceFavourite: jest.fn(() => new Promise(() => {})),
        };

        rtlRender(
            <SpacesFavouriteIcon
                actions={actions}
                bookableSpace={{ space_id: 12 }}
                isFavourite={false}
                isDetailPage
            />,
        );

        fireEvent.click(screen.getByTestId('space-12-detail-favourite'));

        expect(actions.addSpaceFavourite).toHaveBeenCalledWith(12);
        expect(screen.getByRole('progressbar')).toHaveAttribute('id', '12-favorite-progress');
    });

    it('renders both favourite states while another action is pending', () => {
        const useStateSpy = jest.spyOn(React, 'useState').mockReturnValue([13, jest.fn()]);

        const { rerender } = rtlRender(
            <SpacesFavouriteIcon actions={{ addSpaceFavourite: jest.fn() }} bookableSpace={{ space_id: 12 }} isFavourite={false} />,
        );
        expect(screen.getByTestId('space-12-detail-favourite')).toBeInTheDocument();

        rerender(
            <SpacesFavouriteIcon actions={{ removeSpaceFavourite: jest.fn() }} bookableSpace={{ space_id: 12 }} isFavourite />,
        );
        expect(screen.getByTestId('space-12-detail-unfavourite')).toBeInTheDocument();

        useStateSpy.mockRestore();
    });

    it('adds a favourite and resets the spinner after success', async () => {
        jest.useFakeTimers();
        const actions = {
            addSpaceFavourite: jest.fn().mockResolvedValue(),
        };

        rtlRender(
            <SpacesFavouriteIcon actions={actions} bookableSpace={{ space_id: 12 }} isFavourite={false} isDetailPage />,
        );

        fireEvent.click(screen.getByTestId('space-12-detail-favourite'));

        await waitFor(() => expect(actions.addSpaceFavourite).toHaveBeenCalledWith(12));
        await act(async () => {
            await Promise.resolve();
        });
        expect(displayToastMessage).toHaveBeenCalledWith('Space added to favourites');

        await act(async () => {
            jest.advanceTimersByTime(1000);
        });

        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    it('removes a favourite and shows the failure toast when the action rejects', async () => {
        jest.useFakeTimers();
        const actions = {
            removeSpaceFavourite: jest.fn().mockRejectedValue(new Error('failed')),
        };

        rtlRender(
            <SpacesFavouriteIcon actions={actions} bookableSpace={{ space_id: 12 }} isFavourite isDetailPage />,
        );

        fireEvent.click(screen.getByTestId('space-12-detail-unfavourite'));

        await waitFor(() => expect(actions.removeSpaceFavourite).toHaveBeenCalledWith(12));
        await act(async () => {
            await Promise.resolve();
        });
        expect(displayToastErrorMessage).toHaveBeenCalledWith(
            'SSorry, an error occurred - the space was not removed from favourites.',
        );

        await act(async () => {
            jest.advanceTimersByTime(1000);
        });

        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    it('renders the unfavourite icon and removes the favourite on click', async () => {
        const actions = {
            removeSpaceFavourite: jest.fn().mockResolvedValue(),
        };

        rtlRender(
            <SpacesFavouriteIcon
                actions={actions}
                bookableSpace={{ space_id: 15 }}
                isFavourite
                ariaLabel="Keep this space enabled"
            />,
        );

        fireEvent.click(screen.getByTestId('space-15-detail-unfavourite'));

        await waitFor(() => expect(actions.removeSpaceFavourite).toHaveBeenCalledWith(15));
        expect(displayToastMessage).toHaveBeenCalledWith('Space removed from favourites');
    });
});

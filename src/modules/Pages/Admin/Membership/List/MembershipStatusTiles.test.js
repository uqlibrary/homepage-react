import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { mui1theme } from 'config';

import MembershipStatusTiles from './MembershipStatusTiles';

const counts = { all: 6, unconfirmed: 3, renewing: 2, confirmed: 1 };

const setup = (props = {}) =>
    render(
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={mui1theme}>
                <MembershipStatusTiles counts={counts} value="all" onChange={jest.fn()} {...props} />
            </ThemeProvider>
        </StyledEngineProvider>,
    );

describe('MembershipStatusTiles', () => {
    it('shows a tile per status with its count', () => {
        setup();

        expect(screen.getByTestId('membership-status-tile-all')).toHaveTextContent('6');
        expect(screen.getByTestId('membership-status-tile-unconfirmed')).toHaveAccessibleName('Unconfirmed, 3');
        expect(screen.getByTestId('membership-status-tile-confirmed')).toHaveTextContent('Confirmed');
    });

    it('reports the newly chosen status when a different tile is picked', async () => {
        const onChange = jest.fn();
        setup({ onChange });

        await userEvent.click(screen.getByTestId('membership-status-tile-unconfirmed'));

        expect(onChange).toHaveBeenCalledWith('unconfirmed');
    });

    it('keeps the active tile selected when it is clicked again', async () => {
        const onChange = jest.fn();
        setup({ value: 'all', onChange });

        await userEvent.click(screen.getByTestId('membership-status-tile-all'));

        expect(onChange).not.toHaveBeenCalled();
    });

    it('falls back to a zero count for a bucket the counts leave out', () => {
        setup({ counts: { all: 1 } });

        expect(screen.getByTestId('membership-status-tile-confirmed')).toHaveAccessibleName('Confirmed, 0');
    });

    it('shows zeros without crashing when no counts have arrived yet', () => {
        setup({ counts: undefined });

        expect(screen.getByTestId('membership-status-tile-all')).toHaveTextContent('0');
        expect(screen.getByTestId('membership-status-tile-unconfirmed')).toHaveAccessibleName('Unconfirmed, 0');
    });
});

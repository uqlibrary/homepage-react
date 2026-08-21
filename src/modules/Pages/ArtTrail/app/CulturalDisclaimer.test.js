import React from 'react';
import { rtlRender, userEvent } from 'test-utils';

import CulturalDisclaimer from './CulturalDisclaimer';

const setup = (props = {}) => rtlRender(<CulturalDisclaimer onClose={jest.fn()} {...props} />);

describe('CulturalDisclaimer', () => {
    it('renders the advisory copy and dismiss button', () => {
        const { getByRole, getByTestId, getByText } = setup();

        expect(getByTestId('culturalDisclaimer')).toBeInTheDocument();
        expect(
            getByText(
                /Aboriginal and Torres Strait Islander visitors are advised that the description of the following artwork may contain names of people who are deceased/i,
            ),
        ).toBeInTheDocument();
        expect(getByRole('button', { name: 'Dismiss cultural disclaimer' })).toBeInTheDocument();
    });

    it('calls onClose when dismiss is pressed', async () => {
        const onClose = jest.fn();
        const { getByRole } = setup({ onClose });

        await userEvent.click(getByRole('button', { name: 'Dismiss cultural disclaimer' }));

        expect(onClose).toHaveBeenCalledTimes(1);
    });
});

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
                /Aboriginal and Torres Strait Islander peoples are advised that the following may contain images, voices or names of deceased persons in photographs, film, audio recordings or printed material./i,
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

import React from 'react';
import { rtlRender } from 'test-utils';

import ArtTrail from './ArtTrail';

const setup = (props = {}) => {
    return rtlRender(<ArtTrail {...props} />);
};

describe('ArtTrail', () => {
    it('renders the landing page', () => {
        const { getByTestId, getByRole } = setup();

        expect(getByTestId('art-trail-page')).toBeInTheDocument();
        expect(
            getByRole('heading', { name: 'Welcome to the University of Queensland Library Art Trail' }),
        ).toBeInTheDocument();
    });
});

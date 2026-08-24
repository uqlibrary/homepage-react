import React from 'react';
import { rtlRender } from 'test-utils';

import ArtTrail from './ArtTrail';

const setup = (props = {}) => {
    return rtlRender(<ArtTrail {...props} />);
};

describe('ArtTrail', () => {
    it('renders the landing page', () => {
        const { getByRole } = setup();

        expect(
            getByRole('heading', {
                name: 'Welcome to the Indigenous Art and Library Discovery Trail at the University of Queensland Library.',
            }),
        ).toBeInTheDocument();
        expect(getByRole('button', { name: 'Launch Web App' })).toBeInTheDocument();
    });
});

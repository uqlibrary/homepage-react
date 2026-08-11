import React from 'react';
import { render, screen } from '@testing-library/react';

import ArtTrail from './ArtTrail';

describe('ArtTrail', () => {
    it('renders the blank standalone page', () => {
        render(<ArtTrail />);

        expect(screen.getByTestId('art-trail-page')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Art Trail' })).toBeInTheDocument();
    });
});

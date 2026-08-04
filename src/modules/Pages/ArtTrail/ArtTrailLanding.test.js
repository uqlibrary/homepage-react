import React from 'react';
import { render, screen } from '@testing-library/react';

import ArtTrailLanding from './ArtTrailLanding';

describe('ArtTrailLanding', () => {
    it('renders the blank standalone page', () => {
        render(<ArtTrailLanding />);

        expect(screen.getByTestId('art-trail-page')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Art Trail' })).toBeInTheDocument();
    });

    it('sets the document title, since it carries no shared chrome to do so', () => {
        render(<ArtTrailLanding />);

        expect(document.title).toBe('Art Trail');
    });
});

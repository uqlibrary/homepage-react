import React from 'react';
import FloorMapAdornment from './FloorMapAdornment';
import { render, screen } from '@testing-library/react';

const setup = floor => render(<FloorMapAdornment {...floor} />);

describe('FloorMapAdornment', () => {
    it('should not render link when url is not available', () => {
        const { container } = setup({ floor_id: 1 });
        expect(container.firstChild).toBeNull();
    });

    it('should not render link when url is empty', () => {
        const { container } = setup({ floor_id: 1, floor_plan_url: '  ' });
        expect(container.firstChild).toBeNull();
    });

    it('should render link to floor plan', () => {
        const url = 'https://example.com/floor.pdf';
        setup({ floor_id: 1, floor_plan_url: url });
        const link = screen.getByRole('link', { name: /click to open floor plan/i });
        expect(link).toHaveAttribute('href', url);
        expect(link).toHaveAttribute('target', '_blank');
    });
});

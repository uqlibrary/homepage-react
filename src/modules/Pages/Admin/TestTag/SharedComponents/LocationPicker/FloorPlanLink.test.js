import React from 'react';
import FloorPlanLink from './FloorPlanLink';
import { render, screen } from '@testing-library/react';

const setup = (props = {}) => render(<FloorPlanLink {...props} />);

describe('FloorPlanLink', () => {
    it('should not render link when url is not available', () => {
        const { container } = setup();
        expect(container.firstChild).toBeNull();
    });

    it('should not render link when url is empty', () => {
        const { container } = setup({ floor_id: 1, floor_plan_url: '  ' });
        expect(container.firstChild).toBeNull();
    });

    it('should render link to floor plan', () => {
        const url = 'https://example.com/floor.pdf';
        setup({ url });
        const link = screen.getByRole('link', { name: /click to open floor plan/i });
        expect(link).toHaveAttribute('href', url);
        expect(link).toHaveAttribute('target', '_blank');
    });
});

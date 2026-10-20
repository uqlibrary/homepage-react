import React from 'react';
import { render } from 'test-utils';
import { SpacedArrowForwardIcon } from './SpacedArrowForwardIcon';

describe('SpacedArrowForwardIcon component', () => {
    it('renders the arrow icon with right spacing', () => {
        const { container } = render(<SpacedArrowForwardIcon />);
        const arrowIcon = container.querySelector('svg.arrowForwardIcon');

        expect(arrowIcon).not.toBeNull();
        expect(arrowIcon.style.paddingRight).toBe('1rem');
        expect(container.querySelector('svg.arrowForwardIcon path')).not.toBeNull();
    });
});

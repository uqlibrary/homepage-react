import React from 'react';
import { render } from 'test-utils';
import { TabPanel } from './TabPanel';

const setup = props => {
    return render(<TabPanel {...props} />);
};

describe('TabPanel component', () => {
    it('renders the active panel with its default tab identifiers', () => {
        const { getByRole } = setup({
            value: 1,
            index: 1,
            label: 'subject-tab',
            children: 'Active content',
        });
        const panel = getByRole('tabpanel');

        expect(panel.id).toBe('subject-tab-1');
        expect(panel.getAttribute('aria-labelledby')).toBe('subject-tab-1');
        expect(panel.hidden).toBe(false);
        expect(panel.textContent).toBe('Active content');
    });

    it('hides inactive panels and does not render their children', () => {
        const { getByRole } = setup({
            value: 0,
            index: 1,
            label: 'subject-tab',
            children: 'Inactive content',
        });
        const panel = getByRole('tabpanel', { hidden: true });

        expect(panel.hidden).toBe(true);
        expect(panel.textContent).toBe('');
    });

    it('uses a custom tab id and forwards other attributes', () => {
        const { getByRole } = setup({
            value: 'resources',
            index: 'resources',
            label: 'subject-tab',
            tabId: 'custom-subject-tab',
            'data-testid': 'subject-panel',
            children: 'Resource content',
        });
        const panel = getByRole('tabpanel');

        expect(panel.id).toBe('custom-subject-tab');
        expect(panel.getAttribute('aria-labelledby')).toBe('custom-subject-tab');
        expect(panel.textContent).toBe('Resource content');
    });
});

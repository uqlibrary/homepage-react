import { PromoPanelUtilityArea } from './PromoPanelUtilityArea';
import React from 'react';

import { rtlRender } from '../../../../../utils/test-utils';

const props = {
    helpButtonLabel: 'Help',
    helpContent: { title: 'Test help content', text: 'Help content text' },
    history: { push: jest.fn() },
    showAddButton: true,
};

function setupRender(testProps = {}) {
    return rtlRender(<PromoPanelUtilityArea {...props} {...testProps} />);
}

describe('Utility Tests', () => {
    it('renders the utility area correctly', () => {
        const wrapper = setupRender();
        expect(wrapper).toMatchSnapshot();
    });
});

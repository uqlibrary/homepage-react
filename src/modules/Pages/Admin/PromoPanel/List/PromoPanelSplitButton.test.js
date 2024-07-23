import React from 'react';
import { rtlRender } from 'test-utils';
import PromoPanelSplitButton from './PromoPanelSplitButton';
function setup(testProps = {}) {
    const props = {
        canEdit: true,
        row: {},
        group: 'group',
        item: {},
        canClone: true,
        canDelete: true,
        canUnschedule: true,
        onPreview: jest.fn(),
        deletePanelById: jest.fn(),
        navigateToCloneForm: jest.fn(),
        navigateToEditForm: jest.fn(),
        confirmDeleteLocale: jest.fn(),
    };
    return rtlRender(<PromoPanelSplitButton {...props} {...testProps} />);
}

describe('PromoPanelSplitButton', () => {
    it('default values render correctly', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });
});

import React from 'react';
import { rtlRender } from 'test-utils';
import PromoPanelListGroupPanels from './PromoPanelListGroupPanels';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));

function setup(testProps = {}) {
    const props = {
        actions: {},
        isLoading: false,
        userPanelList: [],
        promoPanelList: [],
        canEdit: true,
        canClone: true,
        knownGroups: [],
        promoPanelSaving: false,
    };
    return rtlRender(<PromoPanelListGroupPanels {...props} {...testProps} />);
}

describe('PersonalisedPanel', () => {
    it('default values render correctly', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });
});

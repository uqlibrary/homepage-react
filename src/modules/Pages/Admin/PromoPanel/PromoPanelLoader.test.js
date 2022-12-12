import PromoPanelLoader from './PromoPanelLoader';
import React from 'react';

function setup(testProps = {}) {
    const props = {};
    return <PromoPanelLoader {...props} {...testProps} />;
}

describe('Component PromoPanel Loader', () => {
    it('should render correctly', () => {
        const wrapper = setup({ speed: 2 });
        expect(wrapper).toMatchSnapshot();
    });
});

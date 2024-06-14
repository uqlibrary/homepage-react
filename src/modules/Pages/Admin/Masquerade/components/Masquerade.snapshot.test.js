import React from 'react';
import Masquerade from './Masquerade';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        author: testProps.author || null,
        actions: testProps.actions || {},
        history: testProps.history || {
            push: jest.fn(),
        },
        account: testProps.account || {},
        ...testProps,
    };
    return rtlRender(<Masquerade {...props} />);
}

describe('Component Masquerade', () => {
    it('Should render form as expected', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('Should render readonly description', () => {
        const props = {
            account: { canMasqueradeType: 'readonly' },
        };
        const { container } = setup(props);
        expect(container).toMatchSnapshot();
    });
});

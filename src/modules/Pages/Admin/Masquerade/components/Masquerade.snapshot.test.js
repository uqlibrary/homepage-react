import React from 'react';
import Masquerade from './Masquerade';
import { render, WithReduxStore, fireEvent } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        author: null,
        actions: {},
        account: {},
        ...testProps,
    };
    return render(
        <WithReduxStore>
            <Masquerade {...props} />
        </WithReduxStore>,
    );
}

beforeAll(() => {
    delete global.window.location;
    global.window.location = { href: '', replace: jest.fn(), assign: jest.fn() };
});

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

import React from 'react';
import { rtlRender } from 'test-utils';
import AlertSplitButton from './AlertSplitButton';

function setup(testProps = {}) {
    const props = {
        confirmDeleteLocale: jest.fn(),
    };
    return rtlRender(<AlertSplitButton {...props} {...testProps} />);
}

describe('AlertSplitButton', () => {
    it('default values render correctly', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });
});

import React from 'react';
import { rtlRender } from 'test-utils';
import Spotlights from './Spotlights';

function setup(testProps = {}) {
    const props = {
        spotlights: [],
        account: {},
    };
    return rtlRender(<Spotlights {...props} {...testProps} />);
}

describe('Spotlights', () => {
    it('default values render correctly', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });
});
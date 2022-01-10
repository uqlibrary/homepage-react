import React from 'react';
import Location from './Location';
import { rtlRender, fireEvent } from 'test-utils';

function setup(testProps = {}, renderer = rtlRender) {
    const props = {
        idLabel: 'test',
        ...testProps,
    };

    return renderer(<Location {...props} />);
}

describe('Location Renders component', () => {
    it('should render confirmation box', () => {
        const { getByTestId } = setup();
        fireEvent.click(getByTestId('location-test-option-0'));
        fireEvent.click(getByTestId('location-test-button'));
    });
});

import React from 'react';

import { render, act, fireEvent } from 'test-utils';

import AddToolbar from './AddToolbar';

function setup(props = {}, renderer = render) {
    return renderer(<AddToolbar id={'test'} label="test button" {...props} />);
}

describe('AddToolbar', () => {
    it('renders component', () => {
        const onClickFn = jest.fn();
        const { getByTestId } = setup({ onClick: onClickFn });

        expect(getByTestId('footer_bar-test')).toBeInTheDocument();
        expect(getByTestId('footer_bar-test-add-button')).toHaveTextContent('test button');
    });
});

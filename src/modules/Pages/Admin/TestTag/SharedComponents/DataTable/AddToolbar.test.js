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

        expect(getByTestId('add_toolbar-test')).toBeInTheDocument();
        expect(getByTestId('add_toolbar-test-add-button')).toHaveTextContent('test button');

        act(() => {
            fireEvent.click(getByTestId('add_toolbar-test-add-button'));
        });

        expect(onClickFn).toHaveBeenCalled();
    });
});

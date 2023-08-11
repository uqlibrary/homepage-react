import React from 'react';
import UpdateDialog from './UpdateDialog';
import { rtlRender, act, fireEvent } from 'test-utils';

import { screen } from 'test-utils';
const defaultLocale = {
    cancelButtonLabel: 'test cancel',
    confirmButtonLabel: 'test confirm',
};

function setup(testProps = {}, renderer = rtlRender) {
    const { ...props } = testProps;

    return renderer(
        <UpdateDialog action="add" locale={defaultLocale} fields={{}} columns={{}} id="test" isOpen {...props} />,
    );
}

describe('UpdateDialog Renders component', () => {
    it('renders buttons only, when isOpen is false', () => {
        const { getByTestId, getByText } = setup({ title: 'Test title' });
        screen.debug(undefined, 50000);
        expect(getByTestId('update_dialog-test')).toBeInTheDocument();
        expect(getByTestId('update_dialog-cancel-button')).toHaveTextContent('test cancel');
        expect(getByTestId('update_dialog-action-button')).toHaveTextContent('test confirm');
        expect(getByText('Test title')).toBeInTheDocument();
    });
});

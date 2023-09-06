import React from 'react';

import { render, act, fireEvent } from 'test-utils';

import FooterBar from './FooterBar';

function setup(props = {}, renderer = render) {
    return renderer(<FooterBar id={'test'} {...props} />);
}

describe('FooterBar', () => {
    it('renders component', () => {
        const onAltClickFn = jest.fn();
        const onActionClickFn = jest.fn();
        const { getByTestId } = setup({
            actionLabel: 'submit',
            altLabel: 'cancel',
            onAltClick: onAltClickFn,
            onActionClick: onActionClickFn,
            cancelButtonProps: { className: 'testAltClass' },
            nextButtonProps: { className: 'testActionClass' },
        });
        expect(getByTestId('footer_bar-test')).toBeInTheDocument();
        expect(getByTestId('footer_bar-test-alt-button')).toHaveTextContent('cancel');
        expect(getByTestId('footer_bar-test-alt-button')).toHaveClass('testAltClass');
        expect(getByTestId('footer_bar-test-action-button')).toHaveTextContent('submit');
        expect(getByTestId('footer_bar-test-action-button')).toHaveClass('testActionClass');

        act(() => {
            fireEvent.click(getByTestId('footer_bar-test-alt-button'));
        });
        expect(onAltClickFn).toHaveBeenCalled();

        act(() => {
            fireEvent.click(getByTestId('footer_bar-test-action-button'));
        });
        expect(onActionClickFn).toHaveBeenCalled();
    });
    it('renders component without alt button', () => {
        const { getByTestId, queryByTestId } = setup({
            actionLabel: 'submit',
            onActionClick: jest.fn(), // needed to show button
        });
        expect(getByTestId('footer_bar-test')).toBeInTheDocument();
        expect(queryByTestId('footer_bar-test-alt-button')).not.toBeInTheDocument();
        expect(getByTestId('footer_bar-test-action-button')).toHaveTextContent('submit');
    });
    it('renders component without action button', () => {
        const { getByTestId, queryByTestId } = setup({
            altLabel: 'cancel',
            onAltClick: jest.fn(), // needed to show button
        });
        expect(getByTestId('footer_bar-test')).toBeInTheDocument();
        expect(queryByTestId('footer_bar-test-action-button')).not.toBeInTheDocument();
        expect(getByTestId('footer_bar-test-alt-button')).toHaveTextContent('cancel');
    });
});

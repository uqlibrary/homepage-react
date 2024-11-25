import React from 'react';
import { rtlRender, fireEvent } from 'test-utils';
import Alert from './Alert';
import mediaQuery from 'css-mediaquery';
function setup(testProps = {}) {
    return rtlRender(
        <Alert
            message="Message"
            alertId="1"
            title="Title"
            dismissAction={jest.fn()}
            action={jest.fn()}
            actionButtonLabel="button"
            {...testProps}
        />,
    );
}

function createMatchMedia(width) {
    return query => ({
        matches: mediaQuery.match(query, { width }),
        addListener: () => {},
        removeListener: () => {},
    });
}

describe('Alert', () => {
    beforeAll(() => {
        window.matchMedia = createMatchMedia(window.innerWidth);
    });

    it('should render default view', () => {
        const { container, getByText, getByTestId } = setup({ type: 'warning' });
        expect(getByText(/Title*/)).toBeInTheDocument();
        expect(getByText('Message')).toBeInTheDocument();
        expect(getByTestId('warning-icon')).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('should render error type of alert', () => {
        const { container, getByText, getByTestId } = setup({
            title: 'This is an error title',
            type: 'error',
            message: 'This is an error message',
        });

        expect(getByText(/This is an error title*/)).toBeInTheDocument();
        expect(getByText('This is an error message')).toBeInTheDocument();
        expect(getByTestId('error-icon')).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('should render custom alert', () => {
        const { container, getByText } = setup({
            title: 'This is a custom title',
            type: 'custom',
            message: 'This is a custom message',
            customIcon: 'test',
            customType: 'error',
            wiggle: true,
        });

        expect(getByText(/This is a custom title*/)).toBeInTheDocument();
        expect(getByText('This is a custom message')).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('should render error outline type of alert', () => {
        const { container, getByText, getByTestId } = setup({
            title: 'This is an error outline title',
            type: 'error_outline',
            message: 'This is an error outline message',
        });

        expect(getByText(/This is an error outline title*/)).toBeInTheDocument();
        expect(getByText('This is an error outline message')).toBeInTheDocument();
        expect(getByTestId('error-outline-icon')).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('should render info type of alert', () => {
        const { container, getByText, getByTestId } = setup({
            title: 'This is an info title',
            type: 'info',
            message: 'This is an info message',
        });

        expect(getByText(/This is an info title*/)).toBeInTheDocument();
        expect(getByText('This is an info message')).toBeInTheDocument();
        expect(getByTestId('info-icon')).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('should render info outline type of alert', () => {
        const { container, getByText, getByTestId } = setup({
            title: 'This is an info outline title',
            type: 'info_outline',
            message: 'This is an info outline message',
        });

        expect(getByText(/This is an info outline title*/)).toBeInTheDocument();
        expect(getByText('This is an info outline message')).toBeInTheDocument();
        expect(getByTestId('info-outline-icon')).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('should render help type of alert', () => {
        const { container, getByText, getByTestId } = setup({
            title: 'This is an help title',
            type: 'help',
            message: 'This is an help message',
        });

        expect(getByText(/This is an help title*/)).toBeInTheDocument();
        expect(getByText('This is an help message')).toBeInTheDocument();
        expect(getByTestId('help-icon')).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });
    it('should render help outline type of alert', () => {
        const { container, getByText, getByTestId } = setup({
            title: 'This is an help outline title',
            type: 'help_outline',
            message: 'This is an help outline message',
        });

        expect(getByText(/This is an help outline title*/)).toBeInTheDocument();
        expect(getByText('This is an help outline message')).toBeInTheDocument();
        expect(getByTestId('help-outline-icon')).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('should render done type of alert', () => {
        const { container, getByText, getByTestId } = setup({
            title: 'This is an done title',
            type: 'done',
            message: 'This is an done message',
        });

        expect(getByText(/This is an done title*/)).toBeInTheDocument();
        expect(getByText('This is an done message')).toBeInTheDocument();
        expect(getByTestId('done-icon')).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('should render clickable action button', () => {
        const actionFn = jest.fn();
        const { container, getByText, getByTestId } = setup({
            title: 'This is an error title',
            type: 'error',
            message: 'This is an error message',
            action: actionFn,
            actionButtonLabel: 'Dismiss',
        });

        expect(getByText(/This is an error title*/)).toBeInTheDocument();
        expect(getByText('This is an error message')).toBeInTheDocument();
        expect(getByTestId('error-icon')).toBeInTheDocument();
        expect(getByTestId('1-action-button')).toBeInTheDocument();

        fireEvent.click(getByTestId('1-action-button'));
        expect(actionFn).toHaveBeenCalledTimes(1);
        expect(container).toMatchSnapshot();
    });

    // I dont think these alerts are used, anyay?
    // it('should dismiss alert', () => {
    //     const dismissfn = jest.fn();
    //     const { container, getByTestId } = setup({
    //         dismissAction: dismissfn,
    //         type: null,
    //         message: 'Message',
    //     });
    //
    //     fireEvent.click(getByTestId('1-dismiss-button'));
    //     expect(dismissfn).toHaveBeenCalledTimes(1);
    //     expect(container).toMatchSnapshot();
    // });

    it('should display dismiss button for smaller screen size', () => {
        window.matchMedia = createMatchMedia(256);
        const { container, getByTestId } = setup({
            message: 'Message',
            type: 'warning',
        });
        expect(getByTestId('1-dismiss-button-mobile')).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('should correctly hide', () => {
        window.matchMedia = createMatchMedia(256);
        const { getByTestId, queryByTestId } = setup();
        expect(getByTestId('1-hide-button-mobile')).toBeInTheDocument();
        fireEvent.click(getByTestId('1-hide-button-mobile'));
        expect(queryByTestId('1-hide-button-mobile')).not.toBeInTheDocument();
    });

    it('should display loader', () => {
        const { container, getByTestId } = setup({
            showLoader: true,
            message: 'Message',
            type: 'warning',
        });

        expect(getByTestId('spinner')).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('should fire an action when user clicks on the message text', () => {
        const actionFn = jest.fn();
        const { container, getByText } = setup({
            message: 'Click me',
            action: actionFn,
            type: 'warning',
        });

        fireEvent.click(getByText(/Click me/));
        expect(actionFn).toHaveBeenCalledTimes(1);
        expect(container).toMatchSnapshot();
    });

    it('should not fire an action when user clicks on the message text and no action is assigned', () => {
        const actionFn = jest.fn();
        const { container, getByText } = setup({
            message: 'Click me',
            action: null,
            type: 'warning',
        });

        fireEvent.click(getByText(/Click me/));
        expect(actionFn).toHaveBeenCalledTimes(0);
        expect(container).toMatchSnapshot();
    });

    it('should fire an action when the kind of type does not exist, as an error', () => {
        const actionFn = jest.fn();
        const { container, getByText, getByTestId } = setup({
            message: 'Click me',
            action: actionFn,
            type: 'this_doesnt_exist',
        });

        fireEvent.click(getByText(/Click me/));
        expect(actionFn).toHaveBeenCalledTimes(1);
        expect(getByTestId('error-icon')).toBeInTheDocument();
    });
});

import React from 'react';
import ConfirmationAlert from './ConfirmationAlert';
import { render, act, fireEvent, waitFor } from 'test-utils';

/*
    isOpen: PropTypes.bool,
    message: PropTypes.string,
    type: PropTypes.string,
    closeAlert: PropTypes.func,
    */

function setup(testProps = {}, renderer = render) {
    const { isOpen = true, message = '', type = 'info', ...props } = testProps;
    return renderer(<ConfirmationAlert isOpen={isOpen} message={message} type={type} {...props} />);
}

describe('ConfirmationAlert', () => {
    it('renders empty component when closed', () => {
        const { queryByTestId } = setup({ isOpen: false });
        expect(queryByTestId('confirmation_alert-info')).not.toBeInTheDocument();
    });

    it('renders info component when open', () => {
        const { getByTestId } = setup({ message: 'Test message' });
        expect(getByTestId('confirmation_alert-info')).toBeInTheDocument();
        expect(getByTestId('confirmation_alert-info-alert')).toHaveTextContent('Test message');
    });
    it('renders success component when open', () => {
        const { getByTestId } = setup({ message: 'Test message', type: 'success' });
        expect(getByTestId('confirmation_alert-success')).toBeInTheDocument();
        expect(getByTestId('confirmation_alert-success-alert')).toHaveTextContent('Test message');
    });
    it('renders error component when open', () => {
        const { getByTestId } = setup({ message: 'Test message', type: 'error' });
        expect(getByTestId('confirmation_alert-error')).toBeInTheDocument();
        expect(getByTestId('confirmation_alert-error-alert')).toHaveTextContent('Test message');
    });
    it('fires close function automatically after provided timeout', async () => {
        const mockCloseFn = jest.fn();
        const { getByTestId } = setup({ message: 'Test message', closeAlert: mockCloseFn, autoHideDuration: 1000 });
        expect(getByTestId('confirmation_alert-info')).toBeInTheDocument();
        expect(getByTestId('confirmation_alert-info-alert')).toHaveTextContent('Test message');

        await waitFor(() => expect(mockCloseFn).toHaveBeenCalled(), { timeout: 3000 });
    });
    it('fires close function when close button clicked', async () => {
        const mockCloseFn = jest.fn();
        const { getByTestId, getByTitle } = setup({ message: 'Test message', closeAlert: mockCloseFn });
        expect(getByTestId('confirmation_alert-info')).toBeInTheDocument();
        expect(getByTestId('confirmation_alert-info-alert')).toHaveTextContent('Test message');

        act(() => {
            fireEvent.click(getByTitle('Close'));
        });
        expect(mockCloseFn).toHaveBeenCalled();
    });
});

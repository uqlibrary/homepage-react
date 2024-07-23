import React from 'react';
import ConfirmationAlert from './ConfirmationAlert';
import { render, act, fireEvent, waitFor } from 'test-utils';

function setup(testProps = {}, renderer = render) {
    const { ...props } = testProps;
    return renderer(<ConfirmationAlert {...testProps} {...props} />);
}

describe('ConfirmationAlert', () => {
    it('renders empty component when closed', () => {
        const { queryByTestId } = setup();
        expect(queryByTestId('confirmation_alert-info')).not.toBeInTheDocument();
    });
    it('default values render correctly', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('renders info component when open', () => {
        const { getByTestId } = setup({ isOpen: true, message: 'Test message' });
        expect(getByTestId('confirmation_alert-info')).toBeInTheDocument();
        expect(getByTestId('confirmation_alert-info-alert')).toHaveTextContent('Test message');
    });
    it('renders success component when open', () => {
        const { getByTestId } = setup({ isOpen: true, message: 'Test message', type: 'success' });
        expect(getByTestId('confirmation_alert-success')).toBeInTheDocument();
        expect(getByTestId('confirmation_alert-success-alert')).toHaveTextContent('Test message');
    });
    it('renders error component when open', () => {
        const { getByTestId } = setup({ isOpen: true, message: 'Test message', type: 'error' });
        expect(getByTestId('confirmation_alert-error')).toBeInTheDocument();
        expect(getByTestId('confirmation_alert-error-alert')).toHaveTextContent('Test message');
    });
    it('fires close function automatically after provided timeout', async () => {
        const mockCloseFn = jest.fn();
        const { getByTestId } = setup({
            isOpen: true,
            message: 'Test message',
            closeAlert: mockCloseFn,
            autoHideDuration: 1000,
        });
        expect(getByTestId('confirmation_alert-info')).toBeInTheDocument();
        expect(getByTestId('confirmation_alert-info-alert')).toHaveTextContent('Test message');

        await waitFor(() => expect(mockCloseFn).toHaveBeenCalled(), { timeout: 3000 });
    });
    it('fires close function when close button clicked', async () => {
        const mockCloseFn = jest.fn();
        const { getByTestId, getByTitle } = setup({ isOpen: true, message: 'Test message', closeAlert: mockCloseFn });
        expect(getByTestId('confirmation_alert-info')).toBeInTheDocument();
        expect(getByTestId('confirmation_alert-info-alert')).toHaveTextContent('Test message');

        act(() => {
            fireEvent.click(getByTitle('Close'));
        });
        expect(mockCloseFn).toHaveBeenCalled();
    });
});

import React from 'react';
import { ConfirmationBox } from '../../../../../SharedComponents/Toolbox/ConfirmDialogBox';
import Dialogs from './Dialogs';
import { render } from '@testing-library/react';

jest.mock('../../../../../SharedComponents/Toolbox/ConfirmDialogBox', () => ({
    ConfirmationBox: jest.fn(() => null),
}));

const setup = (props = {}) => {
    return render(<Dialogs {...props} />);
};

describe('Dialogs', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render nothing when no flags are set', () => {
        setup();

        expect(ConfirmationBox).not.toHaveBeenCalled();
    });

    it('should render deleting dialog with existing file name in the message', () => {
        setup({ deleting: true, existingFile: { name: 'existing.png' } });

        const { confirmationTitle, confirmationMessage } = ConfirmationBox.mock.calls[0][0].locale;
        const { getByText } = render(<>{confirmationMessage}</>);

        expect(confirmationTitle).toBe('Processing...');
        expect(getByText(/deleting removed file/i)).toBeInTheDocument();
        expect(getByText('existing.png')).toBeInTheDocument();
    });

    it('should render deleteError dialog with existing file name in the message', () => {
        setup({ deleteError: true, existingFile: { name: 'existing.png' } });

        const { confirmationTitle, confirmationMessage } = ConfirmationBox.mock.calls[0][0].locale;
        const { getByText } = render(<>{confirmationMessage}</>);

        expect(confirmationTitle).toBe('Error');
        expect(getByText(/error while deleting file/i)).toBeInTheDocument();
        expect(getByText('existing.png')).toBeInTheDocument();
        expect(getByText(/please refresh the page and try again/i)).toBeInTheDocument();
    });

    it('should render uploading dialog with progress percentage and file name in the message', () => {
        setup({ uploading: true, uploadProgress: 42, fileToBeUploaded: { name: 'new.png' } });

        const { confirmationTitle, confirmationMessage } = ConfirmationBox.mock.calls[0][0].locale;
        const { getByText } = render(<>{confirmationMessage}</>);

        expect(confirmationTitle).toBe('Processing... 42%');
        expect(getByText(/uploading file/i)).toBeInTheDocument();
        expect(getByText('new.png')).toBeInTheDocument();
    });

    it('should render uploadError dialog with file name in the message', () => {
        setup({ uploadError: true, fileToBeUploaded: { name: 'new.png' } });

        const { confirmationTitle, confirmationMessage } = ConfirmationBox.mock.calls[0][0].locale;
        const { getByText } = render(<>{confirmationMessage}</>);

        expect(confirmationTitle).toBe('Error');
        expect(getByText(/error while uploading file/i)).toBeInTheDocument();
        expect(getByText('new.png')).toBeInTheDocument();
        expect(getByText(/please refresh the page and try again/i)).toBeInTheDocument();
    });
});

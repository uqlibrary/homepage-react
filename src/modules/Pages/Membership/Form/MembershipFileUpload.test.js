import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { mui1theme } from 'config';

import { MAX_FILE_SIZE_BYTES } from '../membershipFileUpload';
import locale from '../membership.locale';
import MembershipFileUpload from './MembershipFileUpload';

const { upload } = locale;

const aFile = (name, type = 'application/pdf', size = 1024) => {
    const file = new File(['x'], name, { type });
    Object.defineProperty(file, 'size', { value: size });
    return file;
};

const setup = (props = {}) => {
    const handlers = {
        onChange: jest.fn(),
        onUpload: jest.fn().mockResolvedValue({ id: 'stored-1' }),
        onPendingChange: jest.fn(),
        ...props,
    };

    const utils = render(
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={mui1theme}>
                <MembershipFileUpload instructions="Please upload proof of eligibility." {...handlers} />
            </ThemeProvider>
        </StyledEngineProvider>,
    );

    return { ...utils, ...handlers };
};

describe('MembershipFileUpload', () => {
    describe('what it asks for', () => {
        it('shows the instructions the type config carries', () => {
            setup();

            expect(screen.getByTestId('membership-upload-instructions')).toHaveTextContent(
                'Please upload proof of eligibility.',
            );
        });

        it('renders the links in those instructions without injecting them as markup', () => {
            setup({ instructions: 'emailed to <a href="mailto:hhsl@library.uq.edu.au">hhsl@library.uq.edu.au</a>.' });

            expect(screen.getByRole('link', { name: 'hhsl@library.uq.edu.au' })).toHaveAttribute(
                'href',
                'mailto:hhsl@library.uq.edu.au',
            );
        });

        it('tells the applicant they can bring documents in person', () => {
            setup({ showInPersonNote: true });

            expect(screen.getByTestId('membership-upload-in-person')).toBeInTheDocument();
        });

        it('does not say that to the types that collect documents another way', () => {
            setup({ showInPersonNote: false });

            expect(screen.queryByTestId('membership-upload-in-person')).not.toBeInTheDocument();
        });

        it('states the limits, and ties them to the input', () => {
            setup();

            expect(screen.getByTestId('membership-upload-constraints')).toHaveTextContent(
                'Files must end in .png, .jpeg or .pdf, and be less than 3MB in size.',
            );
            expect(screen.getByTestId('membership-upload-input')).toHaveAttribute(
                'aria-describedby',
                'membership-upload-constraints',
            );
        });

        it('gives the file input a real label', () => {
            setup();

            expect(screen.getByLabelText(upload.selectLabel)).toBe(screen.getByTestId('membership-upload-input'));
        });
    });

    describe('choosing files', () => {
        it('lists what was chosen, with its size', async () => {
            setup();

            await userEvent.upload(
                screen.getByTestId('membership-upload-input'),
                aFile('card.pdf', 'application/pdf', 1572864),
            );

            expect(screen.getByTestId('membership-upload-table')).toHaveTextContent('card.pdf');
            expect(screen.getByTestId('membership-upload-table')).toHaveTextContent('1.50 MB');
        });

        it('tells the form there is something waiting to be uploaded', async () => {
            const { onPendingChange } = setup();

            await userEvent.upload(screen.getByTestId('membership-upload-input'), aFile('card.pdf'));

            expect(onPendingChange).toHaveBeenLastCalledWith(true);
        });

        it('says why a file it will not take was refused, and keeps the rest', async () => {
            setup();

            await userEvent.upload(screen.getByTestId('membership-upload-input'), [
                aFile('good.pdf'),
                aFile('big.pdf', 'application/pdf', MAX_FILE_SIZE_BYTES + 1),
            ]);

            expect(screen.getByTestId('membership-upload-rejections')).toHaveTextContent(
                'big.pdf is greater than 3MB in size.',
            );
            expect(screen.getByTestId('membership-upload-table')).toHaveTextContent('good.pdf');
            expect(screen.getByTestId('membership-upload-table')).not.toHaveTextContent('big.pdf');
        });

        // The `accept` attribute filters the file picker, but it is a hint - it is not enforced, and a file can
        // still arrive by other means. This is the picker ignored, which is what the check is there for.
        it('refuses a file of the wrong sort even when the picker let it through', () => {
            setup();

            fireEvent.change(screen.getByTestId('membership-upload-input'), {
                target: { files: [aFile('bad.gif', 'image/gif')] },
            });

            expect(screen.getByTestId('membership-upload-rejections')).toHaveTextContent(
                'bad.gif does not end in .png, .jpeg or .pdf.',
            );
            expect(screen.queryByTestId('membership-upload-table')).not.toBeInTheDocument();
        });

        it('shows nothing until something is chosen', () => {
            setup();

            expect(screen.queryByTestId('membership-upload-table')).not.toBeInTheDocument();
            expect(screen.queryByTestId('membership-upload-rejections')).not.toBeInTheDocument();
        });
    });

    describe('removing a file', () => {
        it('takes it off the list', async () => {
            setup();

            await userEvent.upload(screen.getByTestId('membership-upload-input'), aFile('card.pdf'));
            await userEvent.click(screen.getByTestId('membership-upload-remove-0'));

            expect(screen.queryByTestId('membership-upload-table')).not.toBeInTheDocument();
        });

        // Several buttons all announced as "Remove" tell a screen reader user nothing about which is which.
        it('names the remove button for the file it removes', async () => {
            setup();

            await userEvent.upload(screen.getByTestId('membership-upload-input'), aFile('card.pdf'));

            expect(screen.getByRole('button', { name: 'Remove card.pdf' })).toBeInTheDocument();
        });

        it('tells the form there is nothing waiting once the last one goes', async () => {
            const { onPendingChange } = setup();

            await userEvent.upload(screen.getByTestId('membership-upload-input'), aFile('card.pdf'));
            await userEvent.click(screen.getByTestId('membership-upload-remove-0'));

            expect(onPendingChange).toHaveBeenLastCalledWith(false);
        });
    });

    describe('uploading', () => {
        it('sends each chosen file and hands back what the API stored', async () => {
            const onUpload = jest
                .fn()
                .mockResolvedValueOnce({ id: 'stored-1' })
                .mockResolvedValueOnce({ id: 'stored-2' });
            const { onChange } = setup({ onUpload });

            await userEvent.upload(screen.getByTestId('membership-upload-input'), [aFile('a.pdf'), aFile('b.pdf')]);
            await userEvent.click(screen.getByTestId('membership-upload-submit'));

            await waitFor(() => expect(onUpload).toHaveBeenCalledTimes(2));
            await waitFor(() => expect(onChange).toHaveBeenCalledWith([{ id: 'stored-1' }, { id: 'stored-2' }]));
        });

        it('says which files are done', async () => {
            setup();

            await userEvent.upload(screen.getByTestId('membership-upload-input'), aFile('card.pdf'));
            await userEvent.click(screen.getByTestId('membership-upload-submit'));

            await waitFor(() =>
                expect(screen.getByTestId('membership-upload-status-0')).toHaveTextContent(upload.uploaded),
            );
        });

        it('tells the form there is nothing waiting once everything is uploaded', async () => {
            const { onPendingChange } = setup();

            await userEvent.upload(screen.getByTestId('membership-upload-input'), aFile('card.pdf'));
            await userEvent.click(screen.getByTestId('membership-upload-submit'));

            await waitFor(() => expect(onPendingChange).toHaveBeenLastCalledWith(false));
        });

        it('says when a file failed, and keeps it as still waiting', async () => {
            const onUpload = jest.fn().mockRejectedValue(new Error('Network error'));
            const { onPendingChange } = setup({ onUpload });

            await userEvent.upload(screen.getByTestId('membership-upload-input'), aFile('card.pdf'));
            await userEvent.click(screen.getByTestId('membership-upload-submit'));

            await waitFor(() =>
                expect(screen.getByTestId('membership-upload-status-0')).toHaveTextContent(upload.failed),
            );
            expect(onPendingChange).toHaveBeenLastCalledWith(true);
        });

        it('keeps the files that worked when one of them fails', async () => {
            const onUpload = jest
                .fn()
                .mockResolvedValueOnce({ id: 'stored-1' })
                .mockRejectedValueOnce(new Error('Network error'));
            const { onChange } = setup({ onUpload });

            await userEvent.upload(screen.getByTestId('membership-upload-input'), [aFile('a.pdf'), aFile('b.pdf')]);
            await userEvent.click(screen.getByTestId('membership-upload-submit'));

            await waitFor(() => expect(onChange).toHaveBeenCalledWith([{ id: 'stored-1' }]));
            expect(screen.getByTestId('membership-upload-status-1')).toHaveTextContent(upload.failed);
        });

        it('lets a failed file be tried again', async () => {
            const onUpload = jest
                .fn()
                .mockRejectedValueOnce(new Error('Network error'))
                .mockResolvedValueOnce({ id: 's' });
            setup({ onUpload });

            await userEvent.upload(screen.getByTestId('membership-upload-input'), aFile('card.pdf'));
            await userEvent.click(screen.getByTestId('membership-upload-submit'));
            await waitFor(() =>
                expect(screen.getByTestId('membership-upload-status-0')).toHaveTextContent(upload.failed),
            );

            await userEvent.click(screen.getByTestId('membership-upload-submit'));

            await waitFor(() =>
                expect(screen.getByTestId('membership-upload-status-0')).toHaveTextContent(upload.uploaded),
            );
        });

        // Uploading twice would store a second copy of the same document against the application.
        it('does not send a file that is already uploaded', async () => {
            const onUpload = jest.fn().mockResolvedValue({ id: 'stored-1' });
            setup({ onUpload });

            await userEvent.upload(screen.getByTestId('membership-upload-input'), aFile('card.pdf'));
            await userEvent.click(screen.getByTestId('membership-upload-submit'));
            await waitFor(() =>
                expect(screen.getByTestId('membership-upload-status-0')).toHaveTextContent(upload.uploaded),
            );

            expect(screen.getByTestId('membership-upload-submit')).toBeDisabled();
            expect(onUpload).toHaveBeenCalledTimes(1);
        });

        // Adding a second document after the first has gone must not send the first one twice.
        it('sends only the new file when one is added after an upload', async () => {
            const onUpload = jest
                .fn()
                .mockResolvedValueOnce({ id: 'stored-1' })
                .mockResolvedValueOnce({ id: 'stored-2' });
            const { onChange } = setup({ onUpload });

            await userEvent.upload(screen.getByTestId('membership-upload-input'), aFile('first.pdf'));
            await userEvent.click(screen.getByTestId('membership-upload-submit'));
            await waitFor(() =>
                expect(screen.getByTestId('membership-upload-status-0')).toHaveTextContent(upload.uploaded),
            );

            await userEvent.upload(screen.getByTestId('membership-upload-input'), aFile('second.pdf'));
            await userEvent.click(screen.getByTestId('membership-upload-submit'));

            await waitFor(() => expect(onUpload).toHaveBeenCalledTimes(2));
            expect(onUpload.mock.calls[0][0].name).toBe('first.pdf');
            expect(onUpload.mock.calls[1][0].name).toBe('second.pdf');
            // the first attachment is already held, so only the second is added to it
            expect(onChange).toHaveBeenLastCalledWith([{ id: 'stored-2' }]);
        });

        it('does not offer to remove a file that is already uploaded', async () => {
            setup();

            await userEvent.upload(screen.getByTestId('membership-upload-input'), aFile('card.pdf'));
            await userEvent.click(screen.getByTestId('membership-upload-submit'));

            await waitFor(() => expect(screen.queryByTestId('membership-upload-remove-0')).not.toBeInTheDocument());
        });

        it('counts the files when it names the button', async () => {
            setup();

            await userEvent.upload(screen.getByTestId('membership-upload-input'), aFile('a.pdf'));
            expect(screen.getByTestId('membership-upload-submit')).toHaveTextContent(upload.uploadOne);

            await userEvent.upload(screen.getByTestId('membership-upload-input'), aFile('b.pdf'));
            expect(screen.getByTestId('membership-upload-submit')).toHaveTextContent(upload.uploadMany);
        });
    });

    describe('an application that already carries documents', () => {
        it('counts them towards the cap', async () => {
            setup({ attachments: [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }] });

            await userEvent.upload(screen.getByTestId('membership-upload-input'), aFile('one-too-many.pdf'));

            expect(screen.getByTestId('membership-upload-rejections')).toHaveTextContent(
                'one-too-many.pdf was not added',
            );
            expect(screen.queryByTestId('membership-upload-table')).not.toBeInTheDocument();
        });

        it('adds new documents to the ones already held', async () => {
            const { onChange } = setup({ attachments: [{ id: 'already-here' }] });

            await userEvent.upload(screen.getByTestId('membership-upload-input'), aFile('card.pdf'));
            await userEvent.click(screen.getByTestId('membership-upload-submit'));

            await waitFor(() => expect(onChange).toHaveBeenCalledWith([{ id: 'already-here' }, { id: 'stored-1' }]));
        });
    });
});

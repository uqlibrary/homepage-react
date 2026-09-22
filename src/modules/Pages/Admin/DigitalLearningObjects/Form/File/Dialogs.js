import React from 'react';
import { ConfirmationBox } from '../../../../../SharedComponents/Toolbox/ConfirmDialogBox';

const Dialog = ({ title, text }) => (
    <ConfirmationBox
        actionButtonColor="primary"
        actionButtonVariant="contained"
        confirmationBoxId="dlor-object-file-dialog"
        contentProps={{ sx: { textAlign: 'center' } }}
        hideActionButton
        hideCancelButton
        isOpen
        locale={{ confirmationTitle: title, confirmationMessage: text }}
    />
);

const Dialogs = ({
    existingFile,
    fileToBeUploaded,
    uploadProgress = 0,
    deleting,
    deleteError,
    uploading,
    uploadError,
}) => (
    <>
        {deleting && (
            <Dialog
                open
                title="Processing..."
                text={
                    <>
                        Deleting removed file <b>{existingFile.name}</b>, please wait.
                    </>
                }
            />
        )}
        {deleteError && (
            <Dialog
                open
                title="Error"
                text={
                    <>
                        Error while deleting file <b>{existingFile.name}</b>
                        <br />
                        Please refresh the page and try again.
                    </>
                }
            />
        )}
        {uploading && (
            <Dialog
                open
                title={`Processing... ${uploadProgress}%`}
                text={
                    <>
                        Uploading file <b>{fileToBeUploaded.name}</b>, please wait.
                    </>
                }
            />
        )}
        {uploadError && (
            <Dialog
                open
                title="Error"
                text={
                    <>
                        Error while uploading file <b>{fileToBeUploaded.name}</b>
                        <br />
                        Please refresh the page and try again.
                    </>
                }
            />
        )}
    </>
);

export default React.memo(Dialogs);

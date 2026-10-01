import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import ConfigText from '../SharedComponents/ConfigText';
import { MAX_FILE_SIZE_MB, UPLOAD_STATUS, partitionFiles, toMegabytes } from '../membershipFileUpload';
import locale from '../membership.locale';

const { upload } = locale;

const STATUS_LABELS = {
    [UPLOAD_STATUS.READY]: upload.readyToUpload,
    [UPLOAD_STATUS.UPLOADING]: upload.uploading,
    [UPLOAD_STATUS.UPLOADED]: upload.uploaded,
    [UPLOAD_STATUS.FAILED]: upload.failed,
};

/**
 * The supporting documents an application carries.
 *
 * Files are chosen, then uploaded, then their stored form is handed to the form as `attachments` - which is
 * what is submitted. A file that has been chosen but not uploaded is not an attachment yet, and the form is
 * told so it can say as much rather than quietly applying without it.
 */
export const MembershipFileUpload = ({
    instructions,
    showInPersonNote,
    attachments,
    onChange,
    onUpload,
    onPendingChange,
}) => {
    const [selected, setSelected] = useState([]);
    const [rejections, setRejections] = useState([]);

    const updateSelected = next => {
        setSelected(next);
        onPendingChange?.(next.some(item => item.status !== UPLOAD_STATUS.UPLOADED));
    };

    const onFileSelect = event => {
        const { accepted, rejections: refused } = partitionFiles(event.target.files, attachments.length);

        setRejections(refused);
        updateSelected([...selected, ...accepted.map(file => ({ file, status: UPLOAD_STATUS.READY }))]);

        // So choosing the same file again after removing it still registers as a change.
        event.target.value = '';
    };

    const onRemoveFile = index => updateSelected(selected.filter((_item, at) => at !== index));

    const onUploadAll = async () => {
        const isDone = item => item.status === UPLOAD_STATUS.UPLOADED;

        // An upload already done is not repeated - the API would store a second copy of the same document.
        let working = selected.map(item => (isDone(item) ? item : { ...item, status: UPLOAD_STATUS.UPLOADING }));
        updateSelected(working);

        const withStatus = (index, status) => working.map((item, at) => (at === index ? { ...item, status } : item));

        const stored = [];
        // One at a time, so the stored attachments end up in the order they are listed in.
        for (let index = 0; index < selected.length; index++) {
            if (isDone(selected[index])) {
                continue;
            }
            try {
                stored.push(await onUpload(selected[index].file));
                working = withStatus(index, UPLOAD_STATUS.UPLOADED);
            } catch (error) {
                working = withStatus(index, UPLOAD_STATUS.FAILED);
            }
            updateSelected(working);
        }

        onChange([...attachments, ...stored]);
    };

    const isUploading = selected.some(item => item.status === UPLOAD_STATUS.UPLOADING);
    const canUpload = selected.some(
        item => item.status === UPLOAD_STATUS.READY || item.status === UPLOAD_STATUS.FAILED,
    );

    return (
        <Box data-testid="membership-file-upload">
            <Typography component="h2" variant="h6" sx={{ marginTop: 3, marginBottom: 1 }}>
                {upload.title}
            </Typography>

            <Typography component="div">
                <ConfigText component="span" data-testid="membership-upload-instructions" text={instructions} />{' '}
                {!!showInPersonNote && (
                    <span data-testid="membership-upload-in-person">
                        {upload.inPersonNote.before}
                        <a href={upload.inPersonNote.url} target="_blank" rel="noopener noreferrer">
                            {upload.inPersonNote.label}
                        </a>
                        {upload.inPersonNote.after}
                    </span>
                )}
            </Typography>

            <Box sx={{ marginTop: 2 }}>
                {/* A real label associated with the input, so it has an accessible name rather than only a
                    title attribute. */}
                <Typography component="label" htmlFor="membership-upload-input" sx={{ display: 'block' }}>
                    {upload.selectLabel}
                </Typography>
                <input
                    id="membership-upload-input"
                    data-testid="membership-upload-input"
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,application/pdf"
                    aria-describedby="membership-upload-constraints"
                    onChange={onFileSelect}
                />
                <Typography
                    id="membership-upload-constraints"
                    variant="body2"
                    color="text.secondary"
                    data-testid="membership-upload-constraints"
                >
                    {upload.constraints(MAX_FILE_SIZE_MB)}
                </Typography>
            </Box>

            {rejections.length > 0 && (
                <Alert severity="error" sx={{ marginTop: 2 }} data-testid="membership-upload-rejections">
                    {upload.problemsHeading}
                    <ul>
                        {rejections.map(rejection => (
                            <li key={rejection}>{rejection}</li>
                        ))}
                    </ul>
                </Alert>
            )}

            {selected.length > 0 && (
                <Box sx={{ marginTop: 2 }}>
                    <TableContainer>
                        <Table size="small" data-testid="membership-upload-table">
                            <caption style={{ captionSide: 'top' }}>{upload.selectedHeading}</caption>
                            <TableHead>
                                <TableRow>
                                    <TableCell>{upload.columnName}</TableCell>
                                    <TableCell>{upload.columnSize}</TableCell>
                                    <TableCell>{upload.columnStatus}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selected.map((item, index) => (
                                    <TableRow key={`${item.file.name}-${index}`}>
                                        <TableCell component="th" scope="row">
                                            {item.file.name}
                                        </TableCell>
                                        <TableCell>{upload.sizeInMb(toMegabytes(item.file.size))}</TableCell>
                                        <TableCell>
                                            {/* Announced as it changes, so progress is not sight-only. */}
                                            <span role="status" data-testid={`membership-upload-status-${index}`}>
                                                {STATUS_LABELS[item.status]}
                                            </span>
                                            {item.status !== UPLOAD_STATUS.UPLOADING &&
                                                item.status !== UPLOAD_STATUS.UPLOADED && (
                                                    <Button
                                                        size="small"
                                                        onClick={() => onRemoveFile(index)}
                                                        data-testid={`membership-upload-remove-${index}`}
                                                        // Named for its file, so several Remove buttons are not
                                                        // all announced identically.
                                                        aria-label={upload.removeLabel(item.file.name)}
                                                        sx={{ marginLeft: 1 }}
                                                    >
                                                        {upload.remove}
                                                    </Button>
                                                )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={onUploadAll}
                        disabled={!canUpload || isUploading}
                        data-testid="membership-upload-submit"
                        sx={{ marginTop: 1 }}
                    >
                        {selected.length === 1 ? upload.uploadOne : upload.uploadMany}
                    </Button>
                </Box>
            )}
        </Box>
    );
};

MembershipFileUpload.propTypes = {
    instructions: PropTypes.string,
    showInPersonNote: PropTypes.bool,
    attachments: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    onUpload: PropTypes.func.isRequired,
    onPendingChange: PropTypes.func,
};

MembershipFileUpload.defaultProps = {
    attachments: [],
};

export default MembershipFileUpload;

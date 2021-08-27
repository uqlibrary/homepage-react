import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';

import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import { default as locale } from './spotlightsadmin.locale';

const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
};

const thumbBlock = {
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    height: 200,
    padding: 4,
    boxSizing: 'border-box',
};

const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden',
};

const thumbImg = {
    display: 'block',
    height: 200,
};

const deleteButton = {
    width: 80,
    height: 80,
};

export function SpotlightFileUploadDropzone({ onAddFile, onClearFile }) {
    const [files, setFiles] = useState([]);
    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        onDrop: acceptedFiles => {
            setFiles(
                acceptedFiles.map(file =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    }),
                ),
            );
            onAddFile(acceptedFiles);
        },
        maxFiles: 1,
    });

    const thumbs = files.map(file => (
        <div style={thumbBlock} key={file.name}>
            <h3>Preview:</h3>
            <div style={thumbInner}>
                <img alt="preview of uploaded spotlight file" src={file.preview} style={thumbImg} />
            </div>
        </div>
    ));

    useEffect(
        () => () => {
            // Make sure to revoke the data uris to avoid memory leaks
            files.forEach(file => URL.revokeObjectURL(file.preview));
        },
        [files],
    );

    const removeUpload = () => {
        console.log('remove uploaded file ', files);
        files.forEach(file => URL.revokeObjectURL(file.preview));
        setFiles([]);

        onClearFile();
    };

    return (
        <section className="container" data-testid="spotlights-form-upload-dropzone">
            {!thumbs || thumbs.length === 0 ? (
                <div
                    {...getRootProps({ className: 'dropzone' })}
                    style={{
                        border: 'thin solid black',
                        backgroundColor: 'lightgrey',
                        padding: '1rem',
                        cursor: 'pointer',
                    }}
                >
                    <input data-testid="dropzone-dragarea" {...getInputProps()} />
                    <p>{locale.form.labels.dragareaInstructions}</p>
                </div>
            ) : (
                <aside data-testid="dropzone-preview" style={thumbsContainer}>
                    {thumbs}
                    <IconButton style={deleteButton} onClick={removeUpload} title="Delete uploaded spotlight image">
                        <DeleteIcon />
                    </IconButton>
                </aside>
            )}
        </section>
    );
}

SpotlightFileUploadDropzone.propTypes = {
    onAddFile: PropTypes.func,
    onClearFile: PropTypes.func,
};

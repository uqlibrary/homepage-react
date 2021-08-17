import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';

import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
};

const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    // width: 100,
    height: 200,
    padding: 4,
    boxSizing: 'border-box',
};

const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden',
};

const img = {
    display: 'block',
    width: 'auto',
    height: '100%',
};

export function SpotlightUploader({ onAddFile }) {
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
        <div style={thumb} key={file.name}>
            <div style={thumbInner}>
                <img src={file.preview} style={img} />
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
    };

    return (
        <section className="container">
            {!thumbs || thumbs.length === 0 ? (
                <div
                    {...getRootProps({ className: 'dropzone' })}
                    style={{ border: 'thin solid black', backgroundColor: 'lightgrey', padding: '1rem' }}
                >
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
            ) : (
                <aside style={thumbsContainer}>
                    {thumbs}
                    <IconButton
                        onClick={removeUpload}
                        // aria-label="Delete uploaded spotlight image"
                        title="Delete uploaded spotlight image"
                    >
                        <DeleteIcon />
                    </IconButton>
                </aside>
            )}
        </section>
    );
}

SpotlightUploader.propTypes = {
    onAddFile: PropTypes.func,
};

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';

import Grid from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import { default as locale } from './spotlightsadmin.locale';

const thumbsContainer = {
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    height: 200,
    padding: 4,
    boxSizing: 'border-box',
    minHeight: 320,
};

const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden',
};

const thumbImg = {
    maxWidth: '100%',
    maxHeight: 200,
};

const deleteButton = {
    width: 80,
    height: 80,
};

const warningDimensions = {
    color: 'red',
    fontWeight: 'bold',
};
const okDimensions = {
    // it doesnt like not having a style provided in the else
    color: 'inherit',
};

const dimensionBox = {
    padding: '1rem',
};

export function SpotlightFileUploadDropzone({ onAddFile, onClearFile }) {
    const [files, setFiles] = useState([]);
    const [imageWidth, setImageWidth] = useState(0);
    const [imageHeight, setImageHeight] = useState(0);

    const getDimensions = acceptedFiles => {
        if (!acceptedFiles || acceptedFiles.ength === 0) {
            return;
        }
        const url = URL.createObjectURL(acceptedFiles[0]);
        const img = new Image();

        img.onload = () => {
            setImageWidth(img.width);
            setImageHeight(img.height);

            URL.revokeObjectURL(img.src);
        };
        img.src = url;
    };

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
            getDimensions(acceptedFiles);
        },
        maxFiles: 1,
    });

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
            {!files || files.length === 0 ? (
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
                <Grid container data-testid="dropzone-preview" style={thumbsContainer}>
                    <Grid item xs={12}>
                        <h3>Preview:</h3>
                    </Grid>
                    <Grid item xs={10}>
                        {files.map(file => (
                            <div style={thumbInner} key={file.name}>
                                <img alt="preview of uploaded spotlight file" src={file.preview} style={thumbImg} />
                            </div>
                        ))}
                    </Grid>
                    <Grid item xs={2} align="center">
                        <IconButton style={deleteButton} onClick={removeUpload} title={locale.form.tooltips.deleteIcon}>
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                    <Grid item xs={12}>
                        {files.map(file => (
                            <div key={`${file.name}-dimensions`}>
                                {imageWidth > 0 && imageHeight > 0 && (
                                    <div style={dimensionBox} data-testid="dropzone-dimension-warning">
                                        <div
                                            style={
                                                imageWidth > locale.form.image.maxWidth ||
                                                imageHeight > locale.form.image.maxHeight
                                                    ? warningDimensions
                                                    : okDimensions
                                            }
                                        >
                                            Dimensions:{' '}
                                            <strong>
                                                {imageWidth}px x {imageHeight}px
                                            </strong>
                                        </div>
                                        {locale.form.image.dimensionsNotification}: {locale.form.image.maxWidth}px x{' '}
                                        {locale.form.image.maxHeight}px
                                    </div>
                                )}
                            </div>
                        ))}
                    </Grid>
                </Grid>
            )}
        </section>
    );
}

SpotlightFileUploadDropzone.propTypes = {
    onAddFile: PropTypes.func,
    onClearFile: PropTypes.func,
};

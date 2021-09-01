import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useConfirmationState } from 'hooks';

import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Warning from '@material-ui/icons/Warning';
import { default as locale } from './spotlightsadmin.locale';

const thumbsContainer = {
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    height: 200,
    padding: 4,
    boxSizing: 'border-box',
    minHeight: 340,
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
    color: '#bf5000',
    fontWeight: 'bold',
};

const dimensionBox = {
    padding: '1rem',
};

export function SpotlightFileUploadDropzone({ onAddFile, onClearFile, currentImage }) {
    const [files, setFiles] = useState(
        !!currentImage
            ? [
                  {
                      preview: currentImage,
                      name: 'existingFile',
                  },
              ]
            : [],
    );
    const [imageWidth, setImageWidth] = useState(0);
    const [imageHeight, setImageHeight] = useState(0);

    const [isFileProblemConfirmOpen, showFileProblemConfirmation, hideFileProblemConfirmation] = useConfirmationState();

    const getDimensions = acceptedFiles => {
        // based on https://stackoverflow.com/a/8904008/1246313
        if (!acceptedFiles || acceptedFiles.length === 0) {
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
            if (
                !!acceptedFiles &&
                acceptedFiles.length > 0 &&
                acceptedFiles[0].size &&
                acceptedFiles[0].size > locale.form.upload.maxSize
            ) {
                showFileProblemConfirmation();
            }
        },
        maxFiles: 1,
    });

    useEffect(() => {
        if (!!currentImage) {
            const img = new Image();
            img.addEventListener('load', function setSizes() {
                !!this.naturalWidth && setImageWidth(this.naturalWidth);
                !!this.naturalHeight && setImageHeight(this.naturalHeight);
            });
            img.src = currentImage;
        }
    }, [currentImage]);

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

    const closeFileProblemConfirmation = () => {
        removeUpload();
        hideFileProblemConfirmation();
    };

    const imageIsTooBig = (imageWidthIn, imageHeightIn) => {
        return imageWidthIn > locale.form.image.maxWidth || imageHeightIn > locale.form.image.maxHeight;
    };

    const uploadErrorLocale = {
        ...locale.form.upload.fileTooLarge,
        confirmationTitle: `${locale.form.upload.fileTooLarge.confirmationTitle} (max ${locale.form.upload.maxSize /
            1000}kb)`,
    };
    return (
        <React.Fragment>
            <ConfirmationBox
                actionButtonColor="primary"
                actionButtonVariant="contained"
                confirmationBoxId="spotlight-form-file-upload-error-dialog"
                onAction={() => closeFileProblemConfirmation()}
                onClose={() => closeFileProblemConfirmation()}
                hideCancelButton
                isOpen={isFileProblemConfirmOpen}
                locale={uploadErrorLocale}
            />
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
                        <div>{locale.form.labels.dragareaInstructions}</div>
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
                            <IconButton
                                data-testid="spotlights-form-remove-image"
                                style={deleteButton}
                                onClick={removeUpload}
                                title={locale.form.tooltips.deleteIcon}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                        {files.map(file => (
                            <Grid item xs={12} key={`${file.name}-dimensions`}>
                                <Grid container style={dimensionBox} data-testid="dropzone-dimension-warning">
                                    {imageWidth > 0 && imageHeight > 0 && (
                                        <Grid
                                            item
                                            style={imageIsTooBig(imageWidth, imageHeight) ? warningDimensions : null}
                                        >
                                            {!imageIsTooBig(imageWidth, imageHeight) ? (
                                                <CheckIcon fontSize="small" style={{ color: 'green', height: 15 }} />
                                            ) : (
                                                <Warning fontSize="small" style={{ height: 15 }} />
                                            )}
                                            Dimensions:{' '}
                                            <strong>
                                                {imageWidth}px x {imageHeight}px
                                            </strong>
                                        </Grid>
                                    )}
                                    <Grid item xs={12}>
                                        {locale.form.image.dimensionsNotification}: {locale.form.image.maxWidth}px x{' '}
                                        {locale.form.image.maxHeight}px
                                    </Grid>
                                    {imageWidth > 0 && imageHeight > 0 && imageIsTooBig(imageWidth, imageHeight) && (
                                        <Grid item xs={12}>
                                            {locale.form.image.dimensionsWarning}
                                        </Grid>
                                    )}
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </section>
        </React.Fragment>
    );
}

SpotlightFileUploadDropzone.propTypes = {
    onAddFile: PropTypes.func,
    onClearFile: PropTypes.func,
    currentImage: PropTypes.string,
};

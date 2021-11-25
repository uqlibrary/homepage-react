import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useConfirmationState } from 'hooks';

import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { default as locale } from './spotlightsadmin.locale';
import { addConstantsToDisplayValues } from './spotlighthelpers';
import { SpotlightSizeWarning } from './SpotlightSizeWarning';

const emptyDropzone = {
    border: 'thin solid black',
    backgroundColor: 'lightgrey',
    padding: '1rem',
    cursor: 'pointer',
};
const thumbsContainer = {
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    height: 200,
    padding: 4,
    boxSizing: 'border-box',
    minHeight: 400,
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

const dimensionBox = {
    padding: '1rem',
};

export function SpotlightFileUploadDropzone({ onAddFile, onClearFile, currentImage }) {
    // files is setup as an array, even though we only handle a single file here
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

    const setDimensions = acceptedFiles => {
        // based on https://stackoverflow.com/a/8904008/1246313
        /* istanbul ignore next */
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
            setDimensions(acceptedFiles);
            /* istanbul ignore next */
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
        const img = new Image();
        function setSizes() {
            !!this.naturalWidth && setImageWidth(this.naturalWidth);
            !!this.naturalHeight && setImageHeight(this.naturalHeight);
        }
        if (!!currentImage) {
            img.addEventListener('load', setSizes);
            img.src = currentImage;
        }
        return function cleanup() {
            img.removeEventListener('load', setSizes);
        };
    }, [currentImage]);

    useEffect(
        () => () => {
            // Make sure to revoke the data uris to avoid memory leaks
            !!files && files.length > 0 && files.forEach(file => URL.revokeObjectURL(file.preview));
        },
        [files],
    );

    const removeUpload = () => {
        files.forEach(file => URL.revokeObjectURL(file.preview));
        setFiles([]);

        onClearFile();
    };

    /* istanbul ignore next */
    const closeFileProblemConfirmation = () => {
        removeUpload();
        hideFileProblemConfirmation();
    };

    const idealDimensionsNotification = () => {
        return addConstantsToDisplayValues(
            locale.form.upload.recommendedDimensionsNotification,
            locale.form.upload.ideal.width,
            locale.form.upload.ideal.height,
            locale.form.upload.ideal.ratio,
        );
    };

    const uploadErrorLocale = {
        ...locale.form.upload.fileTooLarge,
        confirmationTitle: addConstantsToDisplayValues(
            locale.form.upload.fileTooLarge.confirmationTitle,
            locale.form.upload.ideal.width,
            locale.form.upload.ideal.height,
            locale.form.upload.ideal.ratio,
        ),
    };

    return (
        <React.Fragment>
            <ConfirmationBox
                actionButtonColor="primary"
                actionButtonVariant="contained"
                confirmationBoxId="spotlight-form-file-upload-error-dialog"
                onAction={/* istanbul ignore next */ () => /* istanbul ignore next */ closeFileProblemConfirmation()}
                onClose={/* istanbul ignore next */ () => /* istanbul ignore next */ closeFileProblemConfirmation()}
                hideCancelButton
                isOpen={isFileProblemConfirmOpen}
                locale={uploadErrorLocale}
            />
            <section className="container" data-testid="spotlights-form-upload-dropzone">
                {!!files && files.length > 0 && !!files[0].preview ? (
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
                        {/* show the size info & possible warning */}
                        {files.map(file => (
                            <Grid
                                item
                                xs={12}
                                key={`${file.name}-dimensions`}
                                style={dimensionBox}
                                data-testid="dropzone-dimension-warning"
                            >
                                {imageWidth > 0 && imageHeight > 0 && (
                                    <SpotlightSizeWarning imgWidth={imageWidth} imgHeight={imageHeight} />
                                )}
                                <p>{idealDimensionsNotification()}</p>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <div {...getRootProps({ className: 'dropzone' })} style={emptyDropzone}>
                        <input data-testid="dropzone-dragarea" {...getInputProps()} />
                        {locale.form.labels.dragareaInstructions.map((line, index) => {
                            return (
                                <p key={`instruction-${index}`}>
                                    {addConstantsToDisplayValues(
                                        line,
                                        locale.form.upload.ideal.width,
                                        locale.form.upload.ideal.height,
                                        locale.form.upload.ideal.ratio,
                                    )}
                                </p>
                            );
                        })}
                    </div>
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

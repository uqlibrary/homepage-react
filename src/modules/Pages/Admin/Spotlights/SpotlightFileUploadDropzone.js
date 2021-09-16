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
import { mui1theme } from '../../../../config';

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
    color: mui1theme.palette.warning.main,
    fontWeight: 'bold',
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
            console.log('ondrop');
            setFiles(
                acceptedFiles.map(file =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    }),
                ),
            );
            onAddFile(acceptedFiles);
            setDimensions(acceptedFiles);
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
            console.log('cleanup');
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
        console.log('remove uploaded file ', files);
        files.forEach(file => URL.revokeObjectURL(file.preview));
        setFiles([]);

        onClearFile();
    };

    const closeFileProblemConfirmation = () => {
        removeUpload();
        hideFileProblemConfirmation();
    };

    // this is a bit of a misnomer - we dont want them to go smaller than this because that will make the image fuzzy
    // when the spotlights are occupying the entire width of the screen (ipad view)
    // but the bigger than this they get, the longer the page will take to load
    const ImageSizeIsPoor = (imageWidthIn, imageHeightIn) => {
        const ratio = (imageWidth / imageHeight).toFixed(2);
        return (
            imageWidthIn < locale.form.upload.ideal.width - locale.form.upload.heightWidthFlex ||
            imageWidthIn > locale.form.upload.ideal.width + locale.form.upload.heightWidthFlex ||
            imageHeightIn < locale.form.upload.ideal.height - locale.form.upload.heightWidthFlex ||
            imageHeightIn > locale.form.upload.ideal.height + locale.form.upload.heightWidthFlex ||
            ratio < locale.form.upload.minRatio ||
            ratio > locale.form.upload.maxRatio
        );
    };

    const actualDimensionsNotification = (imageWidthIn, imageHeightIn) => {
        const ratio = (imageWidthIn / imageHeightIn).toFixed(2);
        return (
            <React.Fragment>
                {!ImageSizeIsPoor(imageWidth, imageHeight) ? (
                    <CheckIcon fontSize="small" style={{ color: 'green', height: 15 }} />
                ) : (
                    <Warning fontSize="small" style={{ height: 15 }} />
                )}

                {locale.form.upload.currentDimensionsNotification
                    .replace('[WIDTH]', imageWidthIn)
                    .replace('[HEIGHT]', imageHeightIn)
                    .replace('[RATIO]', ratio)
                    .replace('[MAXFILESIZE]', locale.form.upload.maxSize / 1000)}
            </React.Fragment>
        );
    };

    const idealDimensionsNotification = () => {
        return locale.form.upload.recommendedDimensionsNotification
            .replace('[WIDTH]', locale.form.upload.ideal.width)
            .replace('[HEIGHT]', locale.form.upload.ideal.height)
            .replace('[RATIO]', locale.form.upload.ideal.ratio)
            .replace('[MAXFILESIZE]', locale.form.upload.maxSize / 1000);
    };

    const uploadErrorLocale = {
        ...locale.form.upload.fileTooLarge,
        confirmationTitle: `${locale.form.upload.fileTooLarge.confirmationTitle.replace(
            '[MAXFILESIZE]',
            locale.form.upload.maxSize / 1000,
        )}`,
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
                            <Grid item xs={12} key={`${file.name}-dimensions`}>
                                <Grid container style={dimensionBox} data-testid="dropzone-dimension-warning">
                                    {imageWidth > 0 && imageHeight > 0 && (
                                        <Grid
                                            item
                                            style={ImageSizeIsPoor(imageWidth, imageHeight) ? warningDimensions : null}
                                        >
                                            {actualDimensionsNotification(imageWidth, imageHeight)}
                                        </Grid>
                                    )}
                                    <Grid item xs={12}>
                                        {idealDimensionsNotification()}
                                    </Grid>
                                    {imageWidth > 0 && imageHeight > 0 && ImageSizeIsPoor(imageWidth, imageHeight) && (
                                        <Grid item xs={12}>
                                            {locale.form.upload.dimensionsWarning}
                                        </Grid>
                                    )}
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <div {...getRootProps({ className: 'dropzone' })} style={emptyDropzone}>
                        <input data-testid="dropzone-dragarea" {...getInputProps()} />
                        {locale.form.labels.dragareaInstructions.map((line, index) => {
                            return (
                                <p key={`instruction-${index}`}>
                                    {line.replace('[MAXFILESIZE]', locale.form.upload.maxSize / 1000)}
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

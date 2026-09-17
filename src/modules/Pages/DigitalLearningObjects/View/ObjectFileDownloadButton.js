import React from 'react';
import Button from '@mui/material/Button';
import { getDlorFileViewPageUrl, getFileSizeString } from '../dlorHelpers';
import PropTypes from 'prop-types';

const ObjectFileDownloadButton = ({ object, ...buttonProps }) => {
    if (!object?.object_file_name) return;
    const onClick = () => window.open(getDlorFileViewPageUrl(object), '_blank', 'noopener,noreferrer');
    const type = object.object_file_name.match(/(?:\.)([^\.\s]+)$/)?.[1].toUpperCase?.() || '';
    const size = (object.object_file_size && getFileSizeString(object.object_file_size / 1000)) || '';
    return (
        <Button
            {...buttonProps}
            onClick={onClick}
            aria-label="Click to access the object"
            data-testid="dlor-view-object-download-file-button"
        >
            ACCESS THE OBJECT
            {(type || size) && (
                <>
                    <br />({`${type} ${size}`.trim()})
                </>
            )}
        </Button>
    );
};

ObjectFileDownloadButton.propTypes = {
    object: PropTypes.object,
};

export default React.memo(ObjectFileDownloadButton);

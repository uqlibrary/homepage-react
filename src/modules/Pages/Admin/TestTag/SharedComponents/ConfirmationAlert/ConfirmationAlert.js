import React from 'react';
import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const rootId = 'confirmation_alert';

const ConfirmationAlert = ({
    isOpen = /* istanbul ignore next */ false,
    message = /* istanbul ignore next */ '',
    type = 'info',
    closeAlert,
    ...props
}) => {
    const componentId = `${rootId}-${type}`;
    return (
        <Snackbar
            id={`${componentId}`}
            data-testid={`${componentId}`}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            open={isOpen}
            onClose={closeAlert}
            message={message}
            {...props}
        >
            <Alert
                onClose={closeAlert}
                severity={type}
                id={`${componentId}-alert`}
                data-testid={`${componentId}-alert`}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

ConfirmationAlert.propTypes = {
    isOpen: PropTypes.bool,
    message: PropTypes.string,
    type: PropTypes.string,
    closeAlert: PropTypes.func,
};

export default React.memo(ConfirmationAlert);

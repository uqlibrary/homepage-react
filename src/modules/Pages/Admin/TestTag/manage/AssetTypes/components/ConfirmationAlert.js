import React from 'react';
import PropTypes from 'prop-types';

import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
export const ConfirmationAlert = ({ isOpen, message, type, closeAlert, autoHide }) => {
    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            open={isOpen}
            autoHideDuration={!!autoHide ? 6000 : null}
            onClose={closeAlert}
            message={message}
        >
            <Alert onClose={closeAlert} severity={type}>
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
    autoHide: PropTypes.bool,
};

ConfirmationAlert.defaultProps = {
    isOpen: false,
    message: '',
    type: 'info',
    autoHide: true,
};

export default React.memo(ConfirmationAlert);

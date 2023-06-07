import React from 'react';
import PropTypes from 'prop-types';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

const ConfirmationAlert = ({ isOpen, message, type, closeAlert, ...props }) => {
    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            open={isOpen}
            onClose={closeAlert}
            message={message}
            {...props}
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
};

ConfirmationAlert.defaultProps = {
    isOpen: false,
    message: '',
    type: 'info',
};

export default React.memo(ConfirmationAlert);
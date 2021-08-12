/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable no-trailing-spaces */
import React, { Fragment } from 'react';

export default {
    listPage: {
        confirmDelete: {
            confirmationTitle: 'Remove [N] spotlights?',
            confirmationMessage: (
                <Fragment>
                    Are you sure you want to remove the selected spotlights?
                    <br />
                    Removed spotlights cannot be brought back.
                </Fragment>
            ),
            cancelButtonLabel: 'Cancel',
            confirmButtonLabel: 'Proceed',
        },
        deleteError: {
            confirmationTitle: 'Record Deletion was not successful',
            confirmationMessage: <Fragment>Please try again later</Fragment>,
            confirmButtonLabel: 'OK',
        },
    },
};

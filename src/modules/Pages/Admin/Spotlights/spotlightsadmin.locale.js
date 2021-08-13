/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable no-trailing-spaces */
import React, { Fragment } from 'react';

export default {
    form: {
        add: {
            addSpotlightConfirmation: {
                confirmationTitle: 'A spotlight has been added',
                confirmationMessage: '',
                cancelButtonLabel: 'View spotlight list',
                confirmButtonLabel: 'Add another spotlight',
            },
            addSpotlightError: {
                confirmationTitle: 'An error occurred while saving',
                confirmButtonLabel: 'OK',
            },
            editSpotlightError: {
                confirmationTitle: 'We could not load this spotlight',
                confirmButtonLabel: 'OK',
            },
        },
        edit: {
            editSpotlightConfirmation: {
                confirmationTitle: 'The spotlight has been updated',
                confirmationMessage: '',
                confirmButtonLabel: 'View spotlight list',
            },
        },
        clone: {
            cloneSpotlightConfirmation: {
                confirmationTitle: 'The spotlight has been cloned',
                confirmationMessage: '',
                confirmButtonLabel: 'Clone again',
                cancelButtonLabel: 'View spotlight list',
            },
        },
        help: {
            title: 'Add/Edit/Clone help',
            text: <p data-testid="admin-spotlights-help-example">Form help goes here</p>,
        },
    },
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
        help: {
            title: 'Spotlights listing',
            text: <p>List page help goes here</p>,
        },
    },
};

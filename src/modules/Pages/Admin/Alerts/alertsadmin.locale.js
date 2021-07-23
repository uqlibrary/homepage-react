/* eslint-disable max-len */
import React, { Fragment } from 'react';

export default {
    helpPopupText: (
        <Fragment>
            <h2>About</h2>
            <p>
                UQ Library's Alert Management application provides authorized users with an interface to add, update and
                remove alerts. These alerts are displayed above the header on all UQ Library pages.
            </p>

            <h2>Alert listing</h2>
            <p>
                Alerts are listed on the main page and are split into three tables: "Current Alerts", "Scheduled Alerts"
                and "Past Alerts".
            </p>
            <p>Full dates can be seen by mousing over the short date display.</p>

            <h2 id="adding-alert" data-testid="admin-alerts-help-example">
                Adding an alert
            </h2>
            <p>
                Adding alerts is done via the "ADD ALERT" button in the top right corner of the main alert list view. An
                alert consists of the following components:
            </p>
            <ul>
                <li>
                    Title
                    <div className="description">(cannot be empty)</div>
                </li>
                <li>
                    Description
                    <div className="description">(cannot be empty, cannot contain HTML tags</div>
                </li>
                <li>
                    Start date/time
                    <div className="description">(cannot be empty, must be before the end date / time)</div>
                </li>
                <li>
                    End date/time
                    <div className="description">(cannot be empty, must be after the start date / time)</div>
                </li>
                <li>
                    Urgent
                    <div className="description">
                        Changes the color of the alert when displayed (urgent = red, non-urgent = blue)
                    </div>
                </li>
                <li>
                    Permanent
                    <div className="description">The alert cannot be dismissed</div>
                </li>
                <li>
                    Add info link
                    <div className="description">Shows/hides the URL fields</div>
                </li>
                <li>
                    Link Title
                    <div className="description">(cannot be empty)</div>
                </li>
                <li>
                    Link URL
                    <div className="description">(cannot be empty)</div>
                </li>
            </ul>
            <p>
                Validation is offered on the form, but staff are urged to double check all entered data before clicking
                "Save".
            </p>

            <h2>Editing an alert</h2>
            <p>
                Editing an existing alert is done by pressing the "Edit" button at the back of an alert row in the main
                alert list view. This will take the user to the "Edit Alert" view, which is functionally identical to
                the "Add Alert" view. Please see the <a href="#adding-alert">"Adding an alert"</a> section for more
                details.
            </p>

            <h2>Removing alerts</h2>
            <p>
                Removing alerts is done via the main alert list view. Simply select all the alerts that need to be
                removed and press the delete icon (looks like a trash can). A confirmation will be displayed before the
                alerts are removed.
            </p>
            <p>
                <strong>Warning! Removed alerts cannot be brought back</strong>
            </p>
        </Fragment>
    ),
    editForm: {
        editAlertConfirmation: {
            confirmationTitle: 'The alert has been updated',
            confirmationMessage: '',
            confirmButtonLabel: 'View alert list',
        },
    },
    addForm: {
        help: {},
        urgentTooltip: 'Use for urgent/important alerts. Alert colour will change to orange.',
        permanentTooltip: 'Permanent alerts cannot be dismissed by the client. The close button is removed.',
        addAlertConfirmation: {
            confirmationTitle: 'An alert has been added',
            confirmationMessage: '',
            cancelButtonLabel: 'View alert list',
            confirmButtonLabel: 'Add another alert',
        },
        addAlertError: {
            confirmationTitle: 'An error occurred while saving',
            confirmButtonLabel: 'OK',
        },
        editAlertError: {
            confirmationTitle: 'We could not load this alert',
            confirmButtonLabel: 'OK',
        },
    },
    listPage: {
        confirmDelete: {
            confirmationTitle: 'Remove [N] alerts?',
            confirmationMessage: (
                <Fragment>
                    Are you sure you want to remove the selected alerts?
                    <br />
                    Removed alerts cannot be brought back.
                </Fragment>
            ),
            cancelButtonLabel: 'Cancel',
            confirmButtonLabel: 'Proceed',
        },
        deleteError: {
            confirmationTitle: 'Record Deletion was not successful',
            confirmationMessage: <p>Please try again later</p>,
            confirmButtonLabel: 'OK',
        },
    },
};

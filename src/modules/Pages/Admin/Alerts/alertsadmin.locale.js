/* eslint-disable max-len */
/* eslint-disable no-trailing-spaces */
import React, { Fragment } from 'react';

export default {
    form: {
        add: {
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
        edit: {
            editAlertConfirmation: {
                confirmationTitle: 'The alert has been updated',
                confirmationMessage: '',
                confirmButtonLabel: 'View alert list',
            },
        },
        help: {
            title: 'Entering an alert',
            text: (
                <Fragment>
                    <ul>
                        <li>
                            Press <strong>Preview</strong> to check your alert. A preview alert will appear at the top
                            of the page. The More info button will not navigate you to the new page, however it will
                            confirm the URL once the alert is live.
                        </li>
                        <li>
                            Press <strong>Save</strong> to create the alert. The system will confirm the alert has been
                            created and enable you to create another alert or proceed to the Alerts listing screen
                        </li>
                    </ul>
                    <h3>Fields</h3>
                    <dl data-testid="admin-alerts-help-example">
                        <dt>Title</dt>
                        <dd>
                            <p>Alert lead text. Appears in bold.</p>
                            <p>Required field. Max length of 255 characters.</p>
                        </dd>
                        <dt>Message</dt>
                        <dd>
                            <p>Alert body text.</p>
                            <p>Required field. Max length of 550 characters.</p>
                        </dd>
                        <dt>Start date</dt>
                        <dd>
                            <p>Date and time when the alert should be published for clients.</p>
                            <p>Defaults to current date and time. Cannot be in the past.</p>
                            <p>Set into the future to schedule an alert.</p>
                            <p>Full date information can be seen by mousing over the short date display.</p>
                        </dd>
                        <dt>End date</dt>
                        <dd>
                            <p>Date and time when alert should be unpublished.</p>
                            <p>Defaults to 11.59pm on date of alert creation. Must be after Start Date.</p>
                            <p>Full date information can be seen by mousing over the short date display.</p>
                        </dd>
                        <dt>Add info link</dt>
                        <dd>
                            <p>Displays more info link/button for clients.</p>
                            <p>Optional field. When checked, displays Link title and Link URL fields for button.</p>
                        </dd>
                        <dt>*Link title</dt>
                        <dd>
                            <p>More info button text.</p>
                            <p>Conditional required field. Max length of 55 characters.</p>
                            <p>
                                Ensure clear call to action. Preferably use destination page title. Minimise field
                                length for display and accessibility reasons.
                            </p>
                        </dd>
                        <dt>*Link URL</dt>
                        <dd>
                            <p>More info button URL.</p>
                            <p>Conditional required field. Field accepts full URL only.</p>
                        </dd>
                        <dt>Permanent</dt>
                        <dd>
                            <p>Removes ‘close’ button on alert for clients so alert is always visible.</p>
                        </dd>
                        <dt>Urgent</dt>
                        <dd>
                            <p>Changes alert colour to orange and changes icon to indicate alert is urgent.</p>
                            <p>Default non-urgent alert is blue.</p>
                        </dd>
                    </dl>
                    <p>The alert will appear between the start time and the end time set in the alert.</p>
                </Fragment>
            ),
        },
    },
    listPage: {
        help: {
            title: 'Alerts listing',
            text: (
                <Fragment>
                    <p>
                        This application enables authorised users to post alerts for library clients in the website
                        header. header. Alerts appear as part of the reusable header on sites that include the Library
                        Homepage apps, Drupal Website, Libguides and Library CRM pages.
                    </p>

                    <h2>Alert listing screen</h2>
                    <p>
                        Alerts are listed in three tables, Current alerts, Scheduled alerts and Past alerts, based on
                        their start and end date and time.
                    </p>
                    <ul>
                        <li>
                            <strong>Current alerts</strong>: displays alerts published on the website now based on start
                            and end date/time. List is ordered by start time.
                        </li>
                        <li>
                            <strong>Scheduled alerts</strong>: displays alerts to be displayed in the future based on
                            start date/time. List is ordered by alert start time.
                        </li>
                        <li>
                            <strong>Past alerts</strong>: displays past alerts. List is ordered reverse chronologically
                            by end date/time.
                        </li>
                    </ul>
                    <h2 id="adding-alert" data-testid="admin-alerts-help-example">
                        Add an alert
                    </h2>
                    <p>
                        Press the <strong>Add alert</strong> button on the Alert listing screen. The Create alert form
                        will appear.
                    </p>
                    <h2>Edit an alert</h2>
                    <ol>
                        <li>
                            Press <strong>Edit</strong> beside an alert on the Alerts listing screen. The Edit alert
                            form will appear with the alert information prefilled.
                        </li>
                    </ol>
                    <h2>Remove alerts</h2>
                    <p>
                        <strong>Deleted alerts cannot be restored. Past alerts should generally be retained.</strong>
                    </p>
                    <p>On the Alerts listing screen:</p>
                    <ol>
                        <li>
                            Check one or more alerts within one of the tables, e.g. Past alerts. A blue bar with a
                            Delete button (bin) and a Deselect button (cross) will appear in the table title row.
                        </li>
                        <li>
                            Press <strong>Delete</strong> (the bin icon) to proceed with deleting the alerts. You will
                            be asked to confirm you wish to proceed. The system will confirm the alerts are permanently
                            deleted.
                        </li>
                    </ol>
                    <p>
                        Press <strong>Close (the cross icon)</strong> to deselect all selected alerts.
                    </p>
                </Fragment>
            ),
        },
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
            confirmationMessage: <Fragment>Please try again later</Fragment>,
            confirmButtonLabel: 'OK',
        },
    },
};

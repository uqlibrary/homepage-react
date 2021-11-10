/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable no-trailing-spaces */
import React, { Fragment } from 'react';

export default {
    form: {
        labels: {
            title: 'Title *',
            message: 'Message *',
            startdate: 'Start date',
            enddate: 'End date',
            link: {
                checkbox: 'Add info link',
                title: 'Link title *',
                url: 'Link URL *',
            },
            permanent: 'Permanent',
            urgent: 'Urgent',
            systems:
                'Use these checkboxes to target your alert to selected systems only. Leave checkboxes blank to show alert on all systems.',
        },
        tooltips: {
            title: 'Alert lead text. Appears in bold. Field length of 100 characters.',
            message: 'Regular body text. Field length of 550 characters.',
            link: {
                checkbox: 'Check to add button to alert linking to more information. Displays extra form fields.',
                title: 'Use destination page title or clear call to action. Minimise length; max length 55 characters.',
                url: 'Please enter a valid URL.',
            },
            permanent: 'Permanent alerts cannot be dismissed by the client. The close button is removed.',
            urgent: 'Use for urgent/important alerts. Alert colour will change to orange.',
            addAnotherDateSet: 'Add another alert with the same text but different start and end times',
            removeDateSet: 'Remove this date/time set from the alert series',
        },
        add: {
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
        clone: {
            cloneAlertConfirmation: {
                confirmationTitle: 'The alert has been cloned',
                confirmationMessage: '',
                confirmButtonLabel: 'Clone again',
                cancelButtonLabel: 'View alert list',
            },
        },
        help: {
            title: 'Add/edit/clone an alert',
            text: (
                <Fragment>
                    <ul data-testid="admin-alerts-help-example">
                        <li>
                            Enter a short user focused alert. Use language that explains the issue the client may be
                            experiencing (“You may be unable to access the internet.”) and any solutions or alternative
                            services available (“Please use an alternative location.”). If possible, link to more
                            information or assistance. Avoid overly technical language.
                        </li>
                        <li>
                            Press <strong>Preview</strong> to check your alert. Your preview alert will appear at the
                            top of the page. If you change any details, the preview will disappear. Select Preview again
                            to review your changes.
                        </li>
                        <li>
                            Press <strong>Create</strong> to create or clone an alert. The system will confirm the alert
                            has been created. When editing alerts, Save will only be enabled when you have made a change
                            to a field.
                        </li>
                    </ul>
                    <h3>Fields</h3>
                    <dl>
                        <dt>Title</dt>
                        <dd>
                            <p>Alert lead text. Appears in bold.</p>
                            <p>Required field. Max length of 100 characters.</p>
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
                        </dd>
                        <dt>End date</dt>
                        <dd>
                            <p>Date and time when alert should be unpublished.</p>
                            <p>Defaults to 11.59pm on date of alert creation. Must be after Start Date.</p>
                        </dd>
                        <dt>Add another alert with the same text but different start and end times (+ button)</dt>
                        <dd>
                            <p>
                                Adds another set of Start date and End date fields to create another copy of this alert.
                            </p>
                            <p>Use to create multiple alerts with the same content and different dates at once.</p>
                            <p>Start date: Defaults to current date and time. Cannot be in the past.</p>
                            <p>End date: Defaults to 11.59pm on date of alert creation. Must be after Start Date.</p>
                            <p>
                                Upon save, system creates alerts using all form content and the specified dates. After
                                they are created, these alerts are separate and can be edited or deleted individually
                                only.
                            </p>
                        </dd>
                        <dt>Remove this date/time set from the alert series (- button)</dt>
                        <dd>
                            <p>
                                Removes a Start date and End date set to cancel the creation of the alert copy. Only
                                visible when you have pressed the <strong>Add another alert</strong> (+ button).
                            </p>
                            <p>Use to cancel the creation of one of the copies of this alert.</p>
                            <p>Start date: Defaults to current date and time. Cannot be in the past.</p>
                            <p>End date: Defaults to 11.59pm on date of alert creation. Must be after Start Date.</p>
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
                            <p>Removes the ‘close’ button on alert for clients so alert is always visible.</p>
                            <p>
                                Use for essential messages that clients should not be able to close only, e.g. a mask
                                wearing requirement.
                            </p>
                            <p>
                                When an alert is non-permanent, clients may close the alert for 24 hours. A cookie will
                                be set in their browser for each alert closed.
                            </p>
                        </dd>
                        <dt>Urgent</dt>
                        <dd>
                            <p>Changes alert colour to orange and changes icon to indicate alert is urgent.</p>
                            <p>Default non-urgent alert is blue.</p>
                            <p>
                                Use discretion, field for high impact alerts only (e.g. COVID lockdown, major system
                                outage, major network outage, serious campus issue etc).
                            </p>
                        </dd>
                    </dl>
                    <p>The alert will appear between the start time and the end time set in the alert.</p>
                </Fragment>
            ),
        },
    },
    view: {
        help: {
            title: 'View a past alert',
            text: (
                <Fragment>
                    <p data-testid="admin-alerts-view-help-example">
                        The View alerts form is read only as past alerts cannot be edited. This is so they are preserved
                        as a record of past important notices to clients.
                    </p>
                    <h3>Copy and reuse (clone) a past alert</h3>
                    <p>
                        Press <b>Clone</b> to create a copy of the alert. The Clone alert form will appear and be
                        prefilled with the same alert information.
                    </p>
                    <ul>
                        <li>The start date will be the current date and time now.</li>
                        <li>The end date will be set to tonight at 11.59pm.</li>
                    </ul>
                    <h3>Return to alerts list</h3>
                    <p>
                        Press <b>Cancel</b> to return to the Alerts listing page.
                    </p>
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
                        header. Alerts appear as part of the reusable header on sites that include the Library Homepage
                        apps, Drupal Website, Libguides and Library CRM pages.
                    </p>

                    <h2>Alert listing screen</h2>
                    <p>
                        Alerts are listed in three tables, Current alerts, Scheduled alerts and Past alerts, based on
                        their Publish (start) and Unpublish (end) date and time. Full date information can be seen by
                        mousing over the short date display.
                    </p>
                    <ul>
                        <li>
                            <strong>Current alerts</strong>: displays alerts published on the website now based on
                            Publish date and Unpublish date. List is ordered by Unpublish date (oldest to newest).
                        </li>
                        <li>
                            <strong>Scheduled alerts</strong>: displays future alerts based on Publish date. List is
                            ordered by alert start time (oldest to newest).
                        </li>
                        <li>
                            <strong>Past alerts</strong>: displays past alerts. List is ordered by Unpublish date
                            (newest to oldest).
                        </li>
                    </ul>
                    <h3>Alert action buttons</h3>
                    <p>
                        Each alert has two action buttons. There is a primary action and a More actions button (downward
                        arrow). Use the actions to interact with alerts:
                    </p>
                    <ul>
                        <li>Current alerts: Edit (primary), Clone and Delete</li>
                        <li>Future alerts: Edit (primary), Clone and Delete</li>
                        <li>Past alerts: View (primary), Clone and Delete.</li>
                    </ul>
                    <h3>Alert check boxes</h3>
                    <p>
                        Use the check boxes to select multiple alerts. You can only select alerts from one table at a
                        time, e.g. Current alerts. The number of alerts selected and actions for multiple alerts will
                        appear in the table title row and include:
                    </p>
                    <ul>
                        <li>Deselect all (the X button)</li>
                        <li>Delete selected (the bin button).</li>
                    </ul>

                    <h2 id="adding-alert" data-testid="admin-alerts-help-example">
                        Add an alert
                    </h2>
                    <p>
                        Press the <strong>Add alert</strong> button on the Alert listing screen. The Create alert form
                        will appear.
                    </p>
                    <p>
                        Saved alerts will appear on the website within two minutes of their start time. Hard refresh
                        your browser to view the alert.
                    </p>
                    <h2>Edit an alert</h2>
                    <p>
                        Press <strong>Edit</strong> beside an alert on the Alerts listing screen. The Edit alert form
                        will appear with the alert information prefilled.
                    </p>
                    <p>
                        The Save button will not be enabled unless you change something. Press Cancel or your browser’s
                        Back button to exit.
                    </p>
                    <p>
                        Updated alerts will change on the website within two minutes. Hard refresh your browser to view
                        the alert.
                    </p>

                    <h2>Clone (copy) an alert</h2>
                    <p>
                        Press the <strong>More actions</strong> button beside an alert, then press{' '}
                        <strong>Clone</strong>. The Clone alert form will appear with the alert information prefilled
                        and the dates automatically updated.
                    </p>
                    <p>
                        Cloned alerts are the same as creating a new alert. It will appear on the website within two
                        minutes of their start time. Hard refresh your browser to view the alert.
                    </p>
                    <h2>View a past alert</h2>
                    <p>
                        Press <strong>View</strong> beside a past alert. The View alert form will appear in read only
                        mode to ensure past alerts are retained as a record of past messages to clients.
                    </p>
                    <ul>
                        <li>
                            Press <strong>Clone</strong> to create a copy of this alert. The Clone alert form will
                            appear with alert information prefilled and the dates automatically updated.
                        </li>
                        <li>
                            Press <strong>Cancel</strong> to return to the alerts listing screen.
                        </li>
                    </ul>

                    <h2>Remove alerts</h2>
                    <p>
                        <strong>
                            Deleted alerts cannot be restored. Past alerts should generally be retained so please limit
                            deletions to recently created alerts with errors and alerts that have not yet been published
                            which are no longer required.
                        </strong>
                    </p>
                    <p>
                        <strong>To unpublish a current alert</strong>: edit the alert and change its Unpublish date/time
                        to now.
                    </p>

                    <p>To delete alerts:</p>
                    <ul>
                        <li>
                            <strong>One only:</strong> press the <strong>More actions</strong> button beside an alert,
                            then press <strong>Delete</strong>
                        </li>
                        <li>
                            <strong>Multiple:</strong> use the checkboxes to select multiple alerts within one table.
                            Your selection will appear in the table’s title row with a Delete button (bin) and a
                            Deselect button (cross). Press <strong>Delete</strong> to proceed.
                        </li>
                    </ul>
                    <p>
                        In both cases, you will be asked to confirm you wish to proceed. The system will confirm the
                        alerts are permanently deleted.
                    </p>

                    <h2>Language, tone and voice</h2>
                    <ul>
                        <li>
                            Use user focused language: write about the issue from their perspective, what they may
                            experience and any alternative services/assistance available.
                        </li>
                        <li>Use short sentences and everyday words</li>
                    </ul>
                    <p>
                        See the{' '}
                        <a target="_blank" href="https://marketing-communication.uq.edu.au/written-style-guide">
                            UQ Written Style Guide
                        </a>{' '}
                        for formatting advice.
                    </p>
                    <h2>User permissions </h2>
                    <p>
                        Access to this system is limited to staff authorised to publish real time web content across
                        Library systems.
                    </p>
                    <p>
                        Email <a href="mailto:ithelp@library.uq.edu.au">ithelp@library.uq.edu.au</a> for new staff
                        access.
                    </p>
                    <p>Requests will be reviewed by Library Technology Service. </p>
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

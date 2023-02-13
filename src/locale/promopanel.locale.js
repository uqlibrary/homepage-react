/* istanbul ignore file */

/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable no-trailing-spaces */
import React, { Fragment } from 'react';


const moment = require('moment');

export default {
    
    editor: {
        config: {
            removePlugins: [
                'Image',
                'ImageCaption',
                'ImageStyle',
                'ImageToolbar',
                'ImageUpload',
                'EasyImage',
                'CKFinder',
                'BlockQuote',
                'Table',
                'MediaEmbed',
                'Heading',
            ],
        },
    },
    form: {
        defaultGroups: {
           alert: (groupNames) => (
            <>
                <div>The chosen panel will become the DEFAULT panel for the following groups:</div>
                <div style={{ width: '100%' }}>
                    <ul>
                    {groupNames.map(item => 
                        <li>{item}</li>
                    )}
                    </ul>
                </div>
                <div>
                Are you sure you want to continue?
                </div>
            </>
           ), 
        },
        scheduleConflict: {
            alert: (group, panelTitle, panelStart, panelEnd) => (
             <div style={{ width: '100%' }}>
                 <p>{`${group}`} has a conflict with the following panel</p>
                 <p><strong>{`${panelTitle}`}</strong><br /> scheduled to run between <br />{`${moment(panelStart).format('dddd DD/MM/YYYY HH:mm a')}`}<br /> and<br /> {`${moment(panelEnd).format('dddd DD/MM/YYYY HH:mm a')}`}</p>
                 <p>
                 Please resolve this conflict.
                 </p>
             </div>
            ), 
         },
        labels: {
            titleField: 'Title of the Promo Panel',
            titleLabel: 'Title',
            startDate: 'Panel Start Date',
            endDate: 'Panel End Date',
            defaultPanelLabel: 'Schedule or set a default panel',
            defaultPanelHelp: 'Schedule this promo or set the default panel for one or more user groups.',
            defaultPanelCheckbox: 'Set the default for selected user groups',
            groupSelectorLabel: 'Select user groups',
            nameField: 'Name of the Panel (not displayed)',
            adminNotesField: 'Admin notes - anything non-public the admin needs to record about this promo panel',
            adminNotesLabel: 'Admin notes',
            contentLabel: 'Message',
        },
        tooltips: {
            titleField: 'Enter title that will appear on Promo Panel',
            nameField: 'An Internal-use name for the panel - for administrators only',
        },
        
        
        splitButton: {
            labels: {
                clone: 'Clone',
                delete: 'Delete',
                history: 'View history',
                edit: 'Edit',
                view: 'View',
            },
        },
    },
    listPage: {
        confirmDelete: {
            confirmationTitle: 'Remove selected panels?',
            confirmationMessage: (
                <Fragment>
                    Are you sure you want to remove the selected panels?
                    <br />
                    Removed panels cannot be brought back.
                </Fragment>
            ),
            cancelButtonLabel: 'Cancel',
            confirmButtonLabel: 'Proceed',
        },
        confirmUnschedule: {
            confirmationTitle: 'Unschedule panel?',
            confirmationMessage: (
                <Fragment>
                    Are you sure you want to unschedule the selected panel for this group?
                    <br />
                    The panel will no longer be scheduled for this group.
                </Fragment>
            ),
            cancelButtonLabel: 'Cancel',
            confirmButtonLabel: 'Proceed',
        },
        deleteError: {
            confirmationTitle: 'Some records did not delete successfully',
            confirmationMessage: (
                <Fragment>Refresh the page to see current status and try deletion again later</Fragment>
            ),
            confirmButtonLabel: 'OK',
        },
        unscheduleError: {
            confirmationTitle: 'There was an error unscheduling panel(s)',
            confirmationMessage: (
                <Fragment>Refresh the page to see current status and try unscheduling again later</Fragment>
            ),
            confirmButtonLabel: 'OK',
        },
        saveError: {
            confirmationTitle: 'We are unable to save this change right now',
            confirmationMessage: <Fragment>Please try again later</Fragment>,
            confirmButtonLabel: 'OK',
        },
        help: {
            title: 'Promo Panels',
            text: (
                <div>
                    <p>The Promotional Panel Management Application enables you (an authorised user) to set promotional messages for library users via the Promo Panel Box on the website homepage.</p>
                    <p>You can:</p>
                    <ul>
                        <li>add, update and remove scheduled messages</li>
                        <li>target the logged-out homepage and select logged-in user groups e.g. UQ students, HDR students or UQ staff</li>
                        <li>set default (fallback) messages for user groups for times when no scheduled messages are set.</li>
                    </ul>
                    <h3>How to manage promo panels</h3>
                    <h4>Preview (view) a panel</h4>
                    <p>Press the&nbsp;<strong>View&nbsp;</strong>button beside a panel. A preview window will appear showing the style promo box (title and message).</p>
                    <p>Click off the Preview window to close it.</p>
                    <h4>Add a panel</h4>
                    <p>To reuse an existing message, use&nbsp;<strong>Clone</strong> -&nbsp;<strong>More actions (downward arrow) </strong>button &gt;&nbsp;<strong>Clone&nbsp;</strong>button - beside an existing panel.&nbsp;</p>
                    <p>To create a new promo panel press the&nbsp;<strong>Add panel&nbsp;</strong>button. The Create a promo form will appear.</p>
                    <p>Scheduled promos will appear on the website within two minutes of their start time. Hard refresh your browser to view the promo panel.</p>
                    <h4>Edit a panel</h4>
                    <p>Press&nbsp;<strong>More actions (downward arrow)&nbsp;</strong>&gt;&nbsp;<strong>Edit&nbsp;</strong>beside a panel on the listing screen. The Edit a promo form will appear with fields prefilled.</p>
                    <p><strong>Check the user groups for a promo before changing the content&nbsp;</strong>as a panel may affect multiple user groups.&nbsp;</p>
                    <p>Updated panels will change on the website within two minutes. Hard refresh your browser to view the updated message.</p>
                    <h4>Clone (copy) a panel</h4>
                    <p>Press the&nbsp;<strong>More actions (downward arrow)&nbsp;</strong>&gt;&nbsp;<strong>Clone</strong>&nbsp;button beside a panel. The Clone a promo form will appear with the Admin notes, Title and Message fields prefilled<em>.</em></p>
                    <p>Your cloned panel will appear on the website within two minutes of its scheduled start time. Hard refresh your browser to view the updated message.</p>
                    <h4>Unschedule a panel</h4>
                    <p><strong>Default and scheduled panels table only.</strong></p>
                    <p>To expire a message that you would like to end early,&nbsp;<strong>Edit&nbsp;</strong>the panel and adjust its end date. The panel will expire and move to the&nbsp;Past panels table.</p>
                    <p>To unschedule a message that hasn't run to be used at some unknown future time, press&nbsp;<strong>More actions (downward arrow)&nbsp;</strong>&gt;&nbsp;<strong>Unschedule</strong>.</p>
                    <p>The panel (admin notes, title and message) will be moved to the Unallocated panels table to be used later or deleted.</p>
                    <p><strong>Delete a panel</strong></p>
                    <p><strong>Unallocated panels table only</strong>.</p>
                    <p>Delete should generally only be used for messages that we did not end up displaying to clients so we can keep track of our promos.</p>
                    <p>If a scheduled promo ran for clients for any period of time, it should be expired by changing the scheduled end date and moving the promo to the Past promos table.</p>
                    <p>To delete a promo from the Unallocated panels table:</p>
                    <ol>
                        <li>Press the&nbsp;<strong>More actions (downward arrow)&nbsp;</strong>&gt;&nbsp;<strong>Delete&nbsp;</strong>button<br /><br /></li>
                        <li>Confirm you wish to proceed. Deleted panels cannot be restored.</li>
                    </ol>
                    <h3>About the Promo Panel listing screen</h3>
                    <p>The Listing Screen has several tables:</p>
                    <ul>
                        <li><strong>Currently shown panels -&nbsp;</strong>a summary of the promo running now for each user group and whether it is a default or scheduled message.<br /><br /></li>
                        <li><strong>Default and scheduled panels&nbsp;</strong><strong>-&nbsp;</strong>lists the scheduled messages and the default promos for each user group based on the start (From) date. The default user group promo is listed last. The table can be filtered by user group.<br /><br /></li>
                        <li><strong>Unallocated panels -&nbsp;</strong>lists panels (i.e. at least as title and message) without a schedule (a start and end date/time). These promos can be scheduled, be set as a default message, or deleted.<br /><br /></li>
                        <li><strong>Past panels -&nbsp;</strong>lists past scheduled promotions (does not include defaults yet). View or clone past messages you wish to use again.</li>
                    </ul>
                    <h4>Schedule panel and set default buttons</h4>
                    <p>Use the&nbsp;<strong>Schedule panel</strong>&nbsp;and<strong>&nbsp;Set&nbsp;</strong>default buttons for a particular user group in the Default and Scheduled panels table to choose a promo from the Unallocated panels table and:</p>
                    <ul>
                        <li><strong>Schedule panel -&nbsp;</strong>provide a schedule (start and end date)</li>
                        <li><strong>Set default&nbsp;</strong>- set it as the default message</li>
                    </ul>
                    <p>for this user group only.</p>
                    <h4>Promo action buttons</h4>
                    <p>Each promotion has two action buttons. There is a primary action and a&nbsp;<strong>More actions (</strong><strong>downwards arrow)&nbsp;</strong>button. Use the actions to interact with the messages:&nbsp;</p>
                    <ul>
                        <li><strong>Default and scheduled</strong>: View (primary), Edit, Clone and Unschedule<br /><br /></li>
                        <li><strong>Unallocated</strong>:&nbsp;View (primary), Edit, Clone and Delete<br /><br /></li>
                        <li><strong>Past:&nbsp;</strong>View (primary) and clone.</li>
                    </ul>
                </div>
            ),
        },
    },
    addPage: {
        help: {
            title: 'Create a panel',
            text: (
                <div>
                    <p>Promos should be short and user-focused with relevant links to services and resources. They should largely be about one key theme. Keep the message tightly focused on that.</p>
                    <ul>
                        <li>For logged in users, tailor the content to their user type and interests</li>
                        <li>Use active voice, everyday words and short sentences</li>
                        <li>Consult the UQ style guide for language, tone and voice</li>
                    </ul>
                    <h3>How to create a promo</h3>
                    <ol>
                        <li>Enter a title and message.<br />Optionally provide a useful Admin notes message.<br /><br /></li>
                        <li>Press&nbsp;<strong>Preview</strong> and check your title length and content.<br /><br /><strong>Optionally:&nbsp;</strong>you can <strong>Save</strong> this panel to the Unallocated panels table for use later. Or continue to Schedule/set default.</li>
                        <li>Scheduled or default panel?
                            <ul>
                                <li>Scheduled:
                                    <ol>
                                        <li><strong>Select&nbsp;user groups</strong> using the dropdown</li>
                                        <li>Select a&nbsp;<strong>Panel Start Date&nbsp;</strong>and&nbsp;<strong>Panel End Date</strong> for all selected user groups</li>
                                        <li>Press&nbsp;<strong>Add Schedule&nbsp;</strong>to lock in your changes</li>
                                        <li>Repeat 1-3 for additional groups and date/times.<strong><br /><br /></strong>When saving, if the system detects overlapping promos for a user group it will ask you to resolve the conflict. Save the panel to the Unallocated panels table (without a schedule) and adjust the relevant dates on the conflicting panel to proceed.<br /><br /></li>
                                    </ol>
                                </li>
                                <li>Default
                                    <ol>
                                        <li>Check&nbsp;<strong>Set the default for selected user groups</strong></li>
                                        <li><strong>Select user groups&nbsp;</strong>using the dropdown</li>
                                        <li><strong>Press Add Default</strong> to lock in your changes</li>
                                    </ol>
                                </li>
                            </ul>
                        </li>
                        <li>Press&nbsp;<strong>Save</strong>&nbsp;</li>
                    </ol>
                    <h3>About panel types</h3>
                    <p>You can schedule alerts or set default alerts.</p>
                    <h4>Scheduled</h4>
                    <p>Scheduled alerts appear between their Start Date and End Date. They should be relevant for the time of semester/year and the client group.</p>
                    <p>As a guide, schedule them for between a few days and a month so the messages stay fresh and feel useful to clients.</p>
                    <h4>Default</h4>
                    <p>Default promo panels appear when there is no scheduled panel for a client group.</p>
                    <p>Defaults should be broadly useful and cover a few generic/relevant things (e.g. 1 or 2 relevant links, connect with us online and contact AskUs for assistance) so they are useful and seamless when they appear.</p>
                    <h3>About the form fields</h3>
                    <h4>Message fields section</h4>
                    <p>Set the content of the panel. This section can be saved without a schedule/default which appears in the Unallocated panels table on the listing page.</p>
                    <h5>Admin notes</h5>
                    <h5>Title</h5>
                    <p>Panel title text. Appears in the purple-styled header of the promo panel box.</p>
                    <p>Required field. No set field length. Use&nbsp;<strong>Preview</strong> to check the length (at different browser widths) as titles will truncate with (...) where they are too long.&nbsp;</p>
                    <h5>Message</h5>
                    <p>Panel body text.</p>
                    <p>Required field. No set field length; the box extends vertically. Use&nbsp;<strong>Preview&nbsp;</strong>to check the length and that content displays and wraps.</p>
                    <p>Aim for a short sharp message. Use lists and links as needed.</p>
                    <h4>Schedule or set default section</h4>
                    <p>Schedule a panel or set the panel as a default for one or more user groups. This section works with the Message fields section of the form.</p>
                    <h5>Set the default for selected user groups</h5>
                    <p>Optional check box to set the default panel for one or more user groups.&nbsp;Default panels are seen by clients when there is no scheduled message.&nbsp;</p>
                    <p>Use in conjunction with the&nbsp;<em>Select user groups&nbsp;</em>field. Defaults do not have a start or end date.</p>
                    <h5>Select user groups</h5>
                    <p>Select one or more user groups for the alert. Press the&nbsp;<strong>Add&nbsp;</strong>button to add the selection into the table so it will be saved.&nbsp;</p>
                    <ul>
                        <li><strong>Scheduled panels</strong> - use in conjunction with the <em>Panel Start Date</em> and <em>Panel End Date</em> fields and press&nbsp;<strong>Add Schedule&nbsp;</strong>to add the user group and date/times.&nbsp;</li>
                        <li><strong>Default panels&nbsp;</strong>- use in conjunction with the&nbsp;<em>Set default for selected user groups&nbsp;</em>check box. Press&nbsp;<strong>Add Default</strong> to add the user group.</li>
                    </ul>
                    <h5>Panel Start Date</h5>
                    <p>The start date/time for scheduled panels.</p>
                    <p>Defaults to next Monday at 12:01am.</p>
                    <p>Use the date and time picker tool. Text input is problematic at the moment.</p>
                    <h5>Panel End Date</h5>
                    <p>The end date/time for scheduled panels.</p>
                    <p>Defaults to Sunday 11:59pm following the panel start time.</p>
                    <p>Use the date and time picker tool. Text input is problematic at the moment.</p>
                </div>
            ),
        },
    },
    clonePage: {
        help: {
            title: 'Clone a panel',
            text: (
               <div>
                    <p>Clone a panel to create a new promo with the Admin notes, Title and Message prefilled. From there:</p>
                    <ol>
                        <li>Update the content</li>
                        <li>Schedule or set a default and choose user groups</li>
                        <li>Press&nbsp;<strong>Create</strong></li>
                    </ol>
                    <h3><strong>Wording tips</strong></h3>
                    <p>Promos should be short and user-focused with relevant links to services and resources. They should largely be about one key theme. Keep the message tightly focused on that.</p>
                    <ul>
                        <li>For logged in users, tailor the content to their user type and interests</li>
                        <li>Use active voice, everyday words and short sentences</li>
                        <li>Consult the UQ style guide for language, tone and voice</li>
                    </ul>
                    <h3>About panel types</h3>
                    <p>You can schedule alerts or set default alerts.</p>
                    <h4>Scheduled</h4>
                    <p>Scheduled alerts appear between their Start Date and End Date. They should be relevant for the time of semester/year and the client group.</p>
                    <p>As a guide, schedule them for between a few days and a month so the messages stay fresh and feel useful to clients.</p>
                    <h4>Default</h4>
                    <p>Default promo panels appear when there is no scheduled panel for a client group.</p>
                    <p>Defaults should be broadly useful and cover a few generic/relevant things (e.g. 1 or 2 relevant links, connect with us online and contact AskUs for assistance) so they are useful and seamless when they appear.</p>
                    <h3>About the form fields</h3>
                    <h4>Message fields section</h4>
                    <p>Set the content of the panel. This section can be saved without a schedule/default which appears in the Unallocated panels table on the listing page.</p>
                    <h5>Admin notes</h5>
                    <h5>Title</h5>
                    <p>Panel title text. Appears in the purple-styled header of the promo panel box.</p>
                    <p>Required field. No set field length. Use&nbsp;<strong>Preview</strong> to check the length (at different browser widths) as titles will truncate with (...) where they are too long.&nbsp;</p>
                    <h5>Message</h5>
                    <p>Panel body text.</p>
                    <p>Required field. No set field length; the box extends vertically. Use&nbsp;<strong>Preview&nbsp;</strong>to check the length and that content displays and wraps.</p>
                    <p>Aim for a short sharp message. Use lists and links as needed.</p>
                    <h4>Schedule or set default section</h4>
                    <p>Schedule a panel or set the panel as a default for one or more user groups. This section works with the Message fields section of the form.</p>
                    <h5>Set the default for selected user groups</h5>
                    <p>Optional check box to set the default panel for one or more user groups.&nbsp;Default panels are seen by clients when there is no scheduled message.&nbsp;</p>
                    <p>Use in conjunction with the&nbsp;<em>Select user groups&nbsp;</em>field. Defaults do not have a start or end date.</p>
                    <h5>Select user groups</h5>
                    <p>Select one or more user groups for the alert. Press the&nbsp;<strong>Add&nbsp;</strong>button to add the selection into the table so it will be saved.&nbsp;</p>
                    <ul>
                        <li><strong>Scheduled panels</strong> - use in conjunction with the <em>Panel Start Date</em> and <em>Panel End Date</em> fields and press&nbsp;<strong>Add Schedule&nbsp;</strong>to add the user group and date/times.&nbsp;</li>
                        <li><strong>Default panels&nbsp;</strong>- use in conjunction with the&nbsp;<em>Set default for selected user groups&nbsp;</em>check box. Press&nbsp;<strong>Add Default</strong> to add the user group.</li>
                    </ul>
                    <h5>Panel Start Date</h5>
                    <p>The start date/time for scheduled panels.</p>
                    <p>Defaults to next Monday at 12:01am.</p>
                    <p>Use the date and time picker tool. Text input is problematic at the moment.</p>
                    <h5>Panel End Date</h5>
                    <p>The end date/time for scheduled panels.</p>
                    <p>Defaults to Sunday 11:59pm following the panel start time.</p>
                    <p>Use the date and time picker tool. Text input is problematic at the moment.</p>
                </div>
            ),
        },
    },
    editPage: { 
        help: {
            title: 'Edit a panel',
            text: (
                <div>
                    <h3>Editing types of promo panels</h3>
                    <p>There are different things you can change depending on whether you're editing a scheduled or default promo panel. When editing you cannot switch between scheduled and default.</p>
                    <h4>Scheduled</h4>
                    <p>For scheduled alerts you can:</p>
                    <ul>
                        <li>Update panel details including Admin notes, Title or Message.&nbsp;<br /><br />Where you want to substantially change the content, consider expiring the panel by changing its Panel End Date and creating a new/clone the panel. This helps us keep a record of the messages we have shared.<br /><br /></li>
                        <li>Change the schedule for one or more user groups.<br /><br />You cannot remove a user group. To stop a panel adjust the panel end date to the date and time now.</li>
                        <li>Add additional user groups and schedules. Press&nbsp;<strong>Add Schedule&nbsp;</strong>to lock in your changes.</li>
                    </ul>
                    <h4>Default</h4>
                    <p>&nbsp;For default panels you can:</p>
                    <ul>
                        <li>Update the details including Admin notes, Title or Message.<br /><br /></li>
                        <li>Add additional user groups that should use this default panel.</li>
                    </ul>
                    <h3>About panel types</h3>
                    <h4>Scheduled</h4>
                    <p>Scheduled alerts appear between their Start Date and End Date. They should be relevant for the time of semester/year and the client group.</p>
                    <p>As a guide, schedule them for between a few days and a month so the messages stay fresh and feel useful to clients.</p>
                    <h4>Default</h4>
                    <p>Default promo panels appear when there is no scheduled panel for a client group.</p>
                    <p>Defaults should be broadly useful and cover a few generic/relevant things (e.g. 1 or 2 relevant links, connect with us online and contact AskUs for assistance) so they are useful and seamless when they appear.</p>
                </div>
            ),
        },
        Title: (isEdit, isClone) => {
            if (isEdit) {
                return 'Edit a promo';
            } else if (isClone) {
                return 'Clone a promo';
            } else {
                return 'Create a promo';
            }
        },
    },

};

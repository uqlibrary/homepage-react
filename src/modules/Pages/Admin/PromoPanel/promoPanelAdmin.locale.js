/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable no-trailing-spaces */
import React, { Fragment } from 'react';


const moment = require('moment');

export default {
    editPage: {
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
            defaultPanelLabel: 'Schedule or set a default panel',
            defaultPanelHelp: 'Schedule this promo or set the default panel for one or more user groups.',
            defaultPanelCheckbox: 'Set the default for selected user groups',
            groupSelectorLabel: 'Select user groups',
            nameField: 'Name of the Panel (not displayed)',
            adminNotesField: 'Admin notes - anything non-public the admin needs to record about this promo panel',
            adminNotesLabel: 'Admin notes',
            contentLabel: 'Message',
            linkDescAriaField: 'Link title *',
            imgAltField: 'Image alt text *',
            linkField: 'Spotlight link *',
            publishDate: 'Panel start date', // also on List page
            unpublishDate: 'Panel end date', // also on List page
            publishedCheckbox: 'Published?', // also on List page
            dragareaInstructions: [
                'Drag and drop a spotlight image, or click to select an image. *',
                'Max image size: [MAXFILESIZE] KB. Recommended dimensions: [WIDTH]px by [HEIGHT]px (aspect ratio: [RATIO]).',
                'Click the Help button for image requirements.',
            ],
            datePopupNowButton: 'Now',
        },
        tooltips: {
            titleField: 'Enter title that will appear on Promo Panel',
            nameField: 'An Internal-use name for the panel - for administrators only',
            adminNotesField: 'Anything non-public the admin needs to record about this spotlight',
            linkDescAriaField: 'Link aria label - describe title and destination. Field length of 100 characters',
            imgAltField: 'Image alt text - include all text in image.  Field length of 255 characters',
            linkField: 'Please enter a valid URL',
            publishDate: 'Select publish date-time',
            unpublishDate: 'Select unpublish date-time',
            publishedCheckbox: 'Check to add button to alert linking to more information. Displays extra form fields.',
            deleteIcon: 'Remove image',
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
            confirmationTitle: 'Remove [N] panels?',
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
                    <p>
                        UQ Library's Promo Panel Management application provides authorised users with an interface to
                        add, update, remove and schedule promo panels (shown on the homepage), for either a logged out user, or a specified logged in user group.
                    </p>
                </div>
            ),
        },
        tooltips: {
            deleteSelectedSpotlightsButton: 'Delete spotlight(s)',
            clearSelectedSpotlightsButton: 'Deselect all',
        },
        textSearch: {
            displayLabel: 'Quick search',
            ariaLabel: 'Filter spotlights by entering a word',
        },
    },
    viewPage: {
        help: {
            title: 'View help',
            text: (
                <Fragment>
                    <p data-testid="admin-spotlights-view-help-example">
                        The View spotlights page is read only as past spotlights cannot be edited. This is so they are
                        preserved as a record of past notices to clients.
                    </p>
                    <h3>Copy and reuse (clone) a past spotlight</h3>
                    <p>
                        Press <strong>Clone</strong> to create a copy of the spotlight. The Clone spotlight form will
                        appear and be prefilled with the same spotlight information. The dates will be set as:
                    </p>
                    <ul>
                        <li>Date published: 12.01am next Monday</li>
                        <li>Date unpublished: 11.59pm the following Sunday.</li>
                    </ul>
                    <h3>Return to spotlights list</h3>
                    <p>
                        Press <strong>Cancel</strong> to return to the Spotlights listing page.
                    </p>
                </Fragment>
            ),
        },
    },
    viewByHistory: {
        title: 'All uses of this image',
        linkTitle: 'Link title',
        adminNotesLabel: 'Admin notes',
        ariaLabel: 'Image alt text',
        link: 'Spotlight link',
        datePrefix: 'Run between',
        dateDivider: ' and ',
        publicationStatus: 'Published',
        help: {
            title: 'View history help',
            text: (
                <Fragment>
                    <p>
                        The View history page enables you to see the usage of a spotlight image and its related details.
                    </p>
                    <p>
                        Cloning (reusing) an existing spotlight will add to its history. We recommend using the Clone
                        tool rather than uploading additional copies of the same image. Uploading a new image creates a
                        separate history and uses additional storage space.
                    </p>

                    <h3>Spotlight history listing</h3>
                    <ul>
                        <li>Spotlights are listed by Date unpublished (newest to oldest).</li>
                        <li>
                            Where there are multiple uses of a spotlight, the spotlight you selected will be highlighted
                            in grey.
                        </li>
                    </ul>

                    <h3>Spotlight actions</h3>
                    <ul>
                        <li>
                            <strong>Clone (copy):</strong> clone this spotlight. The Clone spotlight form will appear
                        </li>
                        <li>
                            <strong>Edit (current/future spotlights):</strong> edit this spotlight. The edit spotlight
                            form will appear
                        </li>
                        <li>
                            <strong>View (past spotlights only):</strong> view this past spotlight. The View spotlight
                            form will appear
                        </li>
                    </ul>
                </Fragment>
            ),
        },
    },
    viewByImage: {
        title: 'View by image',
        help: {
            title: 'View by image help',
            text: (
                <Fragment>
                    <p>
                        Use the View by image screen to browse spotlights by their image. The screen displays all
                        spotlights by Date unpublished (newest to oldest).
                    </p>
                    <p>Mouse over a spotlight tile to see its title, date published and date unpublished.</p>

                    <h3>Spotlight actions</h3>
                    <p>
                        Click a spotlight tile for more information and actions. The All uses of this image box will
                        appear. You can:
                    </p>

                    <ul>
                        <li>View when this spotlight image has been used and its related details</li>
                        <li>
                            <strong>Clone</strong>, <strong>Edit</strong> (current and scheduled spotlights) or{' '}
                            <strong>View</strong> (past spotlights)
                        </li>
                        <li>
                            Or click <strong>Close</strong> to return to the View by image screen.
                        </li>
                    </ul>

                    <p>See the View history help section for more information.</p>

                    <h3>Search spotlights</h3>

                    <p>
                        Enter keywords into the Quick search text field to filter spotlights based on the Link title,
                        Image alt text and Admin notes fields.
                    </p>
                </Fragment>
            ),
        },
    },
};

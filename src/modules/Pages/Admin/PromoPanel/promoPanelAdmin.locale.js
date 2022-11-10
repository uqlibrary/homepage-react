/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable no-trailing-spaces */
import React, { Fragment } from 'react';


const moment = require('moment');

export default {
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
            defaultPanelCheckbox: 'Default panel for selected groups',
            nameField: 'Name of the Panel (not displayed)',
            adminNotesField: 'Admin notes - anything non-public the admin needs to record about this promo panel',
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
        upload: {
            // the square bracket strings are swapped out for actual values - don't remove them!!
            currentDimensionsNotification: 'Dimensions: [WIDTH]px by [HEIGHT]px (aspect ratio: [RATIO]).',
            recommendedDimensionsNotification:
                'Max image size: [MAXFILESIZE] KB. Recommended dimensions: [WIDTH]px by [HEIGHT]px (aspect ratio: [RATIO]).',
            ideal: {
                width: 813,
                height: 300,
                ratio: 2.71,
            },
            minRatio: 2.55,
            maxRatio: 2.8,
            heightWidthFlex: 50, // can go plus or minus this figure without it warning
            dimensionsWarning: 'Larger images will affect page load time and smaller ones may be pixelated',
            maxSize: 400000, // 400 x 1000 bytes = 400kb
            uploadError: {
                confirmationTitle:
                    'Your image could not be uploaded. Please check or recreate the image and try again.',
                confirmButtonLabel: 'OK',
            },
            fileTooLarge: {
                confirmationTitle:
                    'The file is too large. Please reduce the spotlight file size to [MAXFILESIZE] KB or less and try again.',
                confirmButtonLabel: 'OK',
            },
        },
        reorderThumbs: {
            header: 'Set display order',
            usesPlaceholder: 'Drag and drop the placeholder to set the display order for this spotlight.',
            usesCurrentImage: 'Drag and drop the highlighted image to set the display order for this spotlight.',
            unavailable: 'Reordering only available for current spotlights.',
        },
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
            text: (
                <div>
                    <p>
                        If a spotlight image already exists, we recommend that you clone that spotlight and reuse the
                        image file rather than upload another copy. To do this, use the Quick search box to search past
                        spotlights, then use the <strong>Clone</strong> button.
                    </p>
                    <p>
                        This will also enable you to see how many times a spotlight has been run using the View history
                        feature.
                    </p>

                    <h3 id="adding-spotlight">Add a spotlight</h3>
                    <ol>
                        <li>
                            Create a spotlight file using the recommended dimensions 813px x 300px (max image size of
                            400 KB).
                        </li>
                        <li>
                            Complete the form fields as per the field descriptions (below, on this page) and upload your
                            spotlight file.
                        </li>
                        <li>
                            Click the <strong>Create</strong> button to finish.
                        </li>
                    </ol>
                    <p>
                        The spotlight will be live on the website within 2 minutes of its Date published date/time. Hard
                        refresh your browser to the see the spotlight.
                    </p>

                    <h4>Fields</h4>
                    <dl>
                        <dt>Admin notes</dt>
                        <dd className="description">
                            <p>Notes field for Spotlight admin to put useful/specific notes about the spotlight.</p>
                            <p>
                                Admin notes appear on the listing screen following a * (star) character. These notes are
                                not visible to clients.
                            </p>
                            <p>Optional field.</p>
                        </dd>
                        <dt>Link title</dt>
                        <dd className="description">
                            <p>
                                Spotlight link title (ARIA label for accessibility). Enter destination webpage title.{' '}
                            </p>
                            <p>Required field. Maximum length of 100 characters.</p>
                        </dd>
                        <dt>Image alt text</dt>
                        <dd className="description">
                            <p>Spotlight alternative text for accessbility. Enter all text in spotlight.</p>
                            <p>Required field. Max length of 255 characters.</p>
                        </dd>
                        <dt>Spotlight link</dt>
                        <dd className="description">
                            <p>Spotlight hyperlink address.</p>
                            <p>Required field. Accepts a full URL only.</p>
                        </dd>

                        <dt>Date published (start)</dt>
                        <dd className="description">
                            <p>
                                Date and time when the spotlight should run on the homepage. Requires the Published?
                                field to be checked for the spotlight to be visible to clients.
                            </p>
                            <p>
                                Defaults to 12.01am next Monday. Cannot be in the past. Must be before Date unpublished
                                (end).
                            </p>
                            <ul>
                                <li>
                                    Use the <strong>Now</strong> button to create a current alert
                                </li>
                                <li>Set into the future to schedule an alert</li>
                            </ul>
                            <p>Required field. Format: day/month/year HH:MM - 24hs.</p>
                        </dd>

                        <dt>Date unpublished (end)</dt>
                        <dd className="description">
                            <p>Date and time when spotlight should be removed from the homepage.</p>
                            <p>Defaults to 11.59pm the Sunday after creation. Must be after Date published (start).</p>
                            <p>Required field. Format: day/month/year HH:MM - 24hs.</p>
                        </dd>

                        <dt>File upload</dt>
                        <dd className="description">
                            <p>Drag and drop into or click the box to upload a spotlight image.</p>
                            <p>Max image size: 400 KB. Larger files will be rejected.</p>
                            <p>Recommended dimensions: 813px by 300px (aspect ratio: 2.71).</p>
                            <p>
                                Required field. Replace uploaded image using the <strong>Remove image</strong> button.
                            </p>
                        </dd>
                        <dt>Set display order</dt>
                        <dd className="description">
                            <p>Drag and drop tile to adjust spotlight display order.</p>
                            <p>New spotlights are positioned last by default.</p>
                            <p>
                                Optional and conditional field that is{' '}
                                <strong>only visible for current spotlights</strong>.
                            </p>
                            <p>
                                Reordering on the Form is only reliable when <em>7 or less spotlights are current</em>.
                                Where we have more, use the List page for reordering.
                            </p>
                        </dd>
                        <dt>Published?</dt>
                        <dd className="description">
                            <p>Enables/disables content on the homepage between Date published and Date unpublished.</p>
                            <p>Check to publish, uncheck to unpublish. Can also be set from the listing screen.</p>
                        </dd>
                    </dl>
                    <h3>Edit a spotlight</h3>
                    <ol>
                        <li>Update any of the fields, dates or spotlight image</li>
                        <li>
                            Press <strong>Save</strong> to finish. You will be prompted to return to the listing screen.
                        </li>
                    </ol>
                    <p>
                        The changes will be live on the website within 2 minutes of its Date published date/time. Hard
                        refresh your browser to the see the spotlight.
                    </p>

                    <p>Please see the Fields section for information on updating the form fields.</p>

                    <h3>Clone (copy) a spotlight</h3>
                    <p>Review all form fields:</p>
                    <ul>
                        <li>Update Date published/Date unpublished</li>
                        <li>
                            Use the <strong>Remove image</strong> button to replace any spotlight image with old
                            branding, overly large dimensions beyond those recommended or the wrong aspect ratio
                        </li>
                        <li>
                            Ensure the <strong>Published?</strong> button is checked as needed.
                        </li>
                    </ul>
                    <p>
                        Press <strong>Save</strong> to finish. You can then clone another spotlight or return to the
                        listing screen. The spotlight will be live on the website within 2 minutes of its Date published
                        date/time. Hard refresh your browser to the see the spotlight.
                    </p>
                </div>
            ),
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
            confirmationTitle: 'Unschedule [N] panels?',
            confirmationMessage: (
                <Fragment>
                    Are you sure you want to unschedule the selected panels for this group?
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

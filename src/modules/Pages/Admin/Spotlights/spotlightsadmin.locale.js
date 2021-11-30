/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable no-trailing-spaces */
import React, { Fragment } from 'react';

export default {
    form: {
        labels: {
            adminNotesField: 'Admin notes - anything non-public the admin needs to record about this spotlight',
            linkDescAriaField: 'Link title *',
            imgAltField: 'Image alt text *',
            linkField: 'Spotlight link *',
            publishDate: 'Date published', // also on List page
            unpublishDate: 'Date unpublished', // also on List page
            publishedCheckbox: 'Published?', // also on List page
            dragareaInstructions: [
                'Drag and drop a spotlight image, or click to select an image. *',
                'Max image size: [MAXFILESIZE] KB. Recommended dimensions: [WIDTH]px by [HEIGHT]px (aspect ratio: [RATIO]).',
                'Click the Help button for image requirements.',
            ],
            datePopupNowButton: 'Now',
        },
        tooltips: {
            adminNotesField: 'Anything non-public the admin needs to record about this spotlight',
            linkDescAriaField: 'Link aria label - describe title and destination',
            imgAltField: 'Image alt text - include all text in image',
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
                confirmationTitle: 'An error occurred while uploading the file',
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
                <div data-testid="admin-spotlights-help-example">
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
            },
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
            confirmationTitle: 'Some records did not delete successfully',
            confirmationMessage: (
                <Fragment>Refresh the page to see current status and try deletion again later</Fragment>
            ),
            confirmButtonLabel: 'OK',
        },
        saveError: {
            confirmationTitle: 'We are unable to save this change right now',
            confirmationMessage: <Fragment>Please try again later</Fragment>,
            confirmButtonLabel: 'OK',
        },
        help: {
            title: 'Spotlights',
            text: (
                <div data-testid="admin-spotlights-help-example">
                    <p>
                        UQ Library's Spotlight Management application provides authorised users with an interface to
                        add, update and remove spotlights (promotional images in the carousel). These spotlights are
                        displayed for clients on the UQ Library homepage.
                    </p>

                    <h3>Listing screen</h3>
                    <p>
                        Spotlights are listed in three tables, Current spotlights, Scheduled spotlights and Past
                        spotlights based on their Date published (start) and Date unpublished (end) date and time. Check
                        full date information by mousing over the short date display.
                    </p>

                    <ul>
                        <li>
                            <strong>Current spotlights:</strong> lists spotlights published on the website now based on
                            the Date published, Date unpublished and Published? fields. By default, the list is ordered
                            by Display order (the order in which clients will see the spotlights after loading the
                            homepage). The table displays all current spotlights.
                        </li>
                        <li>
                            <strong>Scheduled spotlights:</strong> displays future spotlights based on the Date
                            published field. By default, the list is ordered by Date published. The table displays all
                            scheduled spotlights.
                        </li>
                        <li>
                            <strong>Past spotlights:</strong> displays past spotlights. By default, the list is ordered
                            by Date unpublished (newest to oldest). Use pagination to increase the number of past
                            spotlights displayed.
                        </li>
                    </ul>

                    <h4>Sort spotlights by table column heading</h4>
                    <p>
                        In any of the spotlight tables, click one of the column lables to sort spotlights by that label.
                        An up or down arrow will appear beside the label to indicate the current sort.
                    </p>
                    <p>
                        Sortable columns include: Display order (current spotlights only), Date published (start
                        date/time), Date unpublished (end date/time) and Published?.
                    </p>

                    <h4>Spotlight action buttons</h4>
                    <p>
                        Each spotlight has two action buttons. There is a primary action and a More actions button
                        (downward arrow). Use the actions to interact with spotlights:
                    </p>
                    <ul>
                        <li>
                            <strong>Current:</strong> Edit (primary), Clone and Delete
                        </li>
                        <li>
                            <strong>Future:</strong> Edit (primary), Clone and Delete
                        </li>
                        <li>
                            <strong>Past:</strong> View (primary), Clone and Delete.
                        </li>
                    </ul>

                    <h3>Add a spotlight</h3>
                    <p>
                        If a spotlight image already exists, we recommend that you <strong>clone</strong> that spotlight
                        and reuse the image file rather than upload another copy. To do this, use the Quick search box
                        to search past spotlights, then use the <strong>Clone</strong> button.
                    </p>
                    <p>
                        This will also enable you to see how many times a spotlight has been run using the View history
                        feature.
                    </p>

                    <ol>
                        <li>
                            Press the <strong>Add spotlight</strong> button on the listing screen. The Create a new
                            spotlight form will appear.
                        </li>
                        <li>
                            Saved spotlights will appear on the website within two minutes of their start time. Hard
                            refresh your browser to view the spotlight.
                        </li>
                    </ol>

                    <h3>Edit a spotlight</h3>
                    <p>
                        Press <strong>Edit</strong> beside a spotlight on the listing screen. The Edit spotlight form
                        will appear with the fields prefilled.
                    </p>
                    <ul>
                        <li>
                            Press <strong>Cancel</strong> or your browser’s Back button to exit
                        </li>
                        <li>
                            Press <strong>Save</strong> to update the spotlight
                        </li>
                    </ul>
                    <p>
                        Updated spotlights will change on the website within two minutes. Hard refresh your browser to
                        view the spotlight.
                    </p>

                    <h3>Clone (copy) a spotlight</h3>
                    <p>
                        Press the <strong>More actions</strong> button beside a spotlight, then press{' '}
                        <strong>Clone</strong>. The Clone spotlight form will appear with the fields prefilled and the
                        dates automatically updated to be:
                    </p>
                    <ul>
                        <li>Date published: 12.01am next Monday</li>
                        <li>Date unpublished: 11.59pm the following Sunday.</li>
                    </ul>
                    <p>
                        A cloned spotlight will appear on the website within two minutes of its start time. Hard refresh
                        your browser to view the spotlight.
                    </p>

                    <h3>View a past spotlight</h3>
                    <p>
                        Press <strong>View</strong> beside a past spotlight. The View spotlight form will appear in read
                        only mode to ensure past spotlights are retained as a record of past messages to clients.
                    </p>
                    <ul>
                        <li>
                            Press <strong>Clone</strong> to create a copy of this spotlight. The Clone spotlight form
                            will appear with alert information prefilled and the dates automatically updated.
                        </li>
                        <li>
                            Press <strong>Cancel</strong> to return to the listing screen.
                        </li>
                    </ul>

                    <h3>Reorder current spotlights</h3>
                    <p>
                        Current spotlights can be reordered when the Current spotlights table is ordered in the default
                        Display order (ascending) only.
                    </p>
                    <ol>
                        <li>Drag and drop current spotlights to adjust their order</li>
                        <li>
                            The display order will update. The reordered row will be highlighted in blue for a short
                            time.
                        </li>
                    </ol>

                    <h3>Publish/unpublish current spotlights</h3>
                    <ul>
                        <li>
                            <strong>Unpublish:</strong> click on the checked <strong>Published?</strong> checkbox for
                            that spotlight
                        </li>
                        <li>
                            <strong>Publish:</strong> click on the unchecked <strong>Published?</strong> checkbox for
                            that spotlight
                        </li>
                    </ul>
                    <p>
                        The checkbox will change and you will see a coloured ripple indicate that the checkbox state has
                        changed.
                    </p>
                    <p>
                        The adjusted spotlight will change on the website within 2 minutes. Hard refresh your browser to
                        see the change.
                    </p>

                    <h3>Search past spotlights</h3>
                    <p>
                        Enter keywords into the Quick search text field above the Past spotlights table to search based
                        on the Link title and Image alt text fields.
                    </p>
                    <p>Past spotlights will be filtered based on your keywords.</p>
                    <p>Search results will be retained for one hour and then cleared.</p>

                    <h3>Remove alerts</h3>
                    <p>Deleted spotlights cannot be restored. In general, limit deletions to:</p>
                    <ul>
                        <li>
                            recently created spotlights with errors and spotlights which have not yet been published and
                            are no longer required
                        </li>
                        <li>very old past spotlights as part of an clean up.</li>
                    </ul>
                    <p>
                        <strong>To unpublish a current spotlight:</strong> see publish/unpublish current spotlights
                        (above, on this page).
                    </p>
                    <p>To delete spotlights:</p>
                    <ul>
                        <li>
                            <strong>One only:</strong> press the <strong>More actions</strong> button beside a
                            spotlight, then press <strong>Delete</strong>
                        </li>
                        <li>
                            <strong>Multiple:</strong> use the Delete checkboxes to select multiple spotlights within
                            one table. Your selection will appear in the table’s title row with a Delete button (bin)
                            and a Deselect button (cross). Press <strong>Delete</strong> to proceed.
                        </li>
                    </ul>
                    <p>
                        In both cases, you will be asked to confirm you wish to proceed. The system will confirm the
                        spotlights are permanently deleted.
                    </p>

                    <h3>User permissions</h3>
                    <p>Contact the Manager, Engagement and Communication to request access to this system.</p>
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
        title: 'Previous uses of this image',
        linkTitle: 'Link title',
        ariaLabel: 'Image alt text',
        link: 'Spotlight link',
        datePrefix: 'Run between',
        // startDate: 'Date published',
        // endDate: 'Date unpublished',
        dateDivider: ' and ',
        publicationStatus: 'Published',
        help: {
            title: 'View by history help',
            text: (
                <Fragment>
                    <p data-testid="admin-spotlights-view-by-history-help-example">
                        This will be the help for the View by history lightbox.
                    </p>
                </Fragment>
            ),
        },
    },
    viewByImage: {
        title: 'View by Image',
    },
};

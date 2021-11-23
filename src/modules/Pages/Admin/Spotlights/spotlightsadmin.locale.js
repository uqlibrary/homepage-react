/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable no-trailing-spaces */
import React, { Fragment } from 'react';

export default {
    form: {
        labels: {
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
                    <p>Note: this help is out of date and will be updated as part of the development process</p>
                    <h2 id="adding-spotlight">Adding an spotlight</h2>
                    <p>
                        Adding spotlights is done via the <b>+ADD NEW</b> button located at the top right hand corner of
                        the main spotlight list view. A spotlight consists of the following fields:
                    </p>
                    <dl>
                        <dt>Title</dt>
                        <dd className="description">(required)</dd>
                        <dt>Start date/time</dt>
                        <dd className="description">
                            format: day/month/year - 24hs(required. date/time has to be before End Date)
                        </dd>

                        <dt>End date/time</dt>
                        <dd className="description">
                            format: day/month/year - 24hs(required. date/time has to be after Start Date)
                        </dd>

                        <dt>Link</dt>
                        <dd className="description">(required. Target link when spotlight is clicked)</dd>
                        <dt>Image Title</dt>
                        <dd className="description">(required)</dd>
                        <dt>Image URL</dt>
                        <dd className="description">(read only field - displays the image url)</dd>
                        <dt>File Upload</dt>
                        <dd className="description">upload an image to be used in the spotlight</dd>
                        <dt>Published</dt>
                        <dd className="description">Enable / Disable the spotlight</dd>
                    </dl>
                    <h2>Editing an spotlight</h2>
                    <p>
                        Editing an existing spotlight is done by pressing the mode_edit button on the specific spotlight
                        row in the main spotlight grid view. This will take the user to the "Edit Spotlight" view, which
                        is functionally identical to the "Add Spotlight" view. Please see the "Adding a spotlight"
                        section for more details.
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
        confirmPublish: {
            confirmationTitle: 'Confirm publish',
            confirmationMessage: 'Are you sure you wish to publish this spotlight?',
            cancelButtonLabel: 'OK',
            confirmButtonLabel: 'Cancel',
        },
        confirmUnpublish: {
            confirmationTitle: 'Confirm unpublish',
            confirmationMessage: 'Are you sure you wish to unpublish this spotlight?',
            cancelButtonLabel: 'OK',
            confirmButtonLabel: 'Cancel',
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

                    <h2>Listing screen</h2>
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
                            homepage).
                        </li>
                        <li>
                            <strong>Scheduled spotlights:</strong> displays future spotlights based on the Date
                            published field. By default, the list is ordered by Date published.
                        </li>
                        <li>
                            <strong>Past spotlights:</strong> displays past spotlights. By default, the list is ordered
                            by Date unpublished (newest to oldest).
                        </li>
                    </ul>

                    <h3>Spotlight action buttons</h3>
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

                    <h2>Add a spotlight</h2>
                    <p>
                        Press the <strong>Add spotlight</strong> button on the listing screen. The Create a new
                        spotlight form will appear.
                    </p>
                    <p>
                        Saved spotlights will appear on the website within two minutes of their start time. Hard refresh
                        your browser to view the spotlight.
                    </p>

                    <h2>Edit a spotlight</h2>
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

                    <h2>Clone (copy) a spotlight</h2>
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

                    <h2>View a past spotlight</h2>
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

                    <h2>Reorder current spotlights</h2>
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

                    <h2>Publish/unpublish current spotlights</h2>
                    <p>To quickly unpublish a current spotlight from the listing screen:</p>
                    <ol>
                        <li>
                            Click on the checked <strong>Published?</strong> checkbox for that spotlight
                        </li>
                        <li>Confirm you wish to unpublish the spotlight.</li>
                    </ol>
                    <p>
                        Unpublished spotlights will be removed from the homepage within two minutes. Hard refresh your
                        browser to view the spotlight.
                    </p>
                    <p>
                        Similarly, current spotlights that are not published can be published by clicking the{' '}
                        <strong>Published?</strong> checkbox and confirming the change.
                    </p>

                    <h2>Search past spotlights</h2>
                    <p>
                        Enter keywords into the Quick search text field above the Past spotlights table to search based
                        on the Link title and Image alt text fields.
                    </p>
                    <p>Past spotlights will be filtered based on your keywords.</p>
                    <p>Search results will be retained for one hour and then cleared.</p>

                    <h2>Remove alerts</h2>
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

                    <h2>User permissions</h2>
                    <p>Contact the Manager, Engagement and Communication about access to this system.</p>
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
                        The View Spotlights page is read only as past spotlights cannot be edited. This is so they are
                        preserved as a record of past notices to clients.
                    </p>
                    <h3>Copy and reuse (clone) a past spotlight</h3>
                    <p>This will be available soon</p>
                    <p>
                        Press <b>Clone</b> to create a copy of the spotlight. The Clone spotlight form will appear and
                        be prefilled with the same spotlight information, with updated dates.
                    </p>
                    <ul>
                        <li>CHECK: The start date will be the current date and time now.</li>
                        <li>CHECK: The end date will be set to tonight at 11.59pm.</li>
                    </ul>
                    <h3>Return to spotlights list</h3>
                    <p>
                        Press <b>Cancel</b> to return to the Spotlights listing page.
                    </p>
                </Fragment>
            ),
        },
    },
    lightbox: {
        title: 'Previous entries for this image',
        linkTitle: 'Link title',
        ariaLabel: 'Image alt text',
        link: 'Spotlight link',
        startDate: 'Date published',
        endDate: 'Date unpublished',
        dateDivider: ' | ',
        publicationStatus: 'Published?',
    },
};

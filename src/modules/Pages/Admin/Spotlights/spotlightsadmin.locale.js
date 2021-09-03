/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable no-trailing-spaces */
import React, { Fragment } from 'react';

export default {
    form: {
        labels: {
            titleField: 'Title - visible to assistive technology (appears on link) *',
            ariaField: 'Tooltip text - visible when user mouses over spotlight (appears on image)',
            linkField: 'Spotlight link *',
            publishDate: 'Date published', // also on List page
            unpublishDate: 'Date unpublished', // also on List page
            publishedCheckbox: 'Published?', // also on List page
            dragareaInstructions: (
                <Fragment>
                    <p>Drag and drop a spotlight image, or click to select an image. *</p>
                    <p>Click the Help button for image requirements.</p>
                </Fragment>
            ),
            datePopupNowButton: 'Now',
        },
        tooltips: {
            titleField: 'Help TBA',
            ariaField: 'Tooltip TBA. Optional - if blank, Title will duplicate as tooltip',
            linkField: 'Please enter a valid URL',
            publishDate: 'Select publish date-time',
            unpublishDate: 'Select unpublish date-time',
            publishedCheckbox: 'Check to add button to alert linking to more information. Displays extra form fields.',
            deleteIcon: 'Remove image',
        },
        image: {
            maxWidth: 813,
            maxHeight: 300,
            dimensionsNotification: 'Recommended dimensions',
            dimensionsWarning: 'Larger images will affect user experience',
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
        upload: {
            uploadError: {
                confirmationTitle: 'An error occurred while uploading the file',
                confirmButtonLabel: 'OK',
            },
            fileTooLarge: {
                confirmationTitle: 'This file is too large - please try again',
                confirmButtonLabel: 'OK',
            },
            maxSize: 400000,
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
        saveError: {
            confirmationTitle: 'We are unable to save this change right now',
            confirmationMessage: <Fragment>Please try again later</Fragment>,
            confirmButtonLabel: 'OK',
        },
        help: {
            title: 'Spotlights listing',
            text: (
                <div data-testid="admin-spotlights-help-example">
                    <p>Note: this help is out of date and will be updated as part of the development process</p>
                    <h2>About</h2>
                    <p>
                        UQ Library's Spotlight Management application provides authorised users with an interface to
                        add, update and remove spotlights. These spotlights are displayed on the UQ Library homepage.
                    </p>
                    <h2>Spotlight listing</h2>
                    <p>
                        All spotlights are listed on the main page in grid view where users can easily filter content
                        using the buttons located in the header.
                    </p>
                    <ul>
                        <li>
                            <b>Quick search</b> offers a text input to filter the grid view via spotlight title
                        </li>
                        <li>
                            <b>Show Current Spotlights</b> will only display published spotlights within a valid and
                            current date range
                        </li>
                        <li>
                            The <b>Reorder</b> button will allow users to re-index the spotlight display order on the
                            library's homepage
                        </li>
                        <li>
                            <b>Add New</b> allows users to insert a new spotlight
                        </li>
                        <li>
                            <b>Help/Info</b> displays this guide
                        </li>
                    </ul>
                    <h2>Removing spotlights</h2>
                    <p>
                        The removal of spotlights is carried out in the main spotlight grid view. Simply click on the
                        respective spotlight mode_edit button to delete an individual spotlight or use the first column
                        check boxes to remove multiple spotlights at once. A confirmation screen will be displayed
                        requesting the user to confirm this action.
                    </p>
                    <p>
                        <strong>Warning! Removed spotlights cannot be restored.</strong>
                    </p>
                </div>
            ),
        },
        tooltips: {
            deleteSelectedSpotlightsButton: 'Delete spotlight(s)',
            clearSelectedSpotlightsButton: 'Deselect all',
        },
    },
};

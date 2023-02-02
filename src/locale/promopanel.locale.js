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
                    <p>
                        UQ Library's Promo panel management application provides authorised users with an interface to
                        add, update, remove and schedule promo panels (shown on the homepage), for either a logged out user, or a specified logged in user group.
                    </p>
                </div>
            ),
        },
    },
    addPage: {
        help: {
            title: 'Promo Panels Add Page',
            text: (
                <div>
                    <p>
                        UQ Library's Promo panel management add application provides authorised users with an interface to
                        add, update, remove and schedule promo panels (shown on the homepage), for either a logged out user, or a specified logged in user group.
                    </p>
                </div>
            ),
        },
    },
    clonePage: {
        help: {
            title: 'Promo Panels Clone Page',
            text: (
                <div>
                    <p>
                        UQ Library's Promo panel management clone application provides authorised users with an interface to
                        add, update, remove and schedule promo panels (shown on the homepage), for either a logged out user, or a specified logged in user group.
                    </p>
                </div>
            ),
        },
    },
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
        help: {
            title: 'Promo Panels Edit Page',
            text: (
                <div>
                    <p>
                        UQ Library's Promo panel management edit application provides authorised users with an interface to
                        add, update, remove and schedule promo panels (shown on the homepage), for either a logged out user, or a specified logged in user group.
                    </p>
                </div>
            ),
        },
       
    },

};

import React from 'react';
import Typography from '@material-ui/core/Typography';

export default {
    config: {
        dateFormat: 'YYYY-MM-DD HH:mm',
        dateFormatNoTime: 'YYYY-MM-DD',
        dateFormatDisplay: 'Do MMMM, YYYY',
        currentLabel: 'CURRENT',
        passLabel: 'PASS',
        failedLabel: 'FAIL',
        repairLabel: 'REPAIR',
        discardedLabel: 'DISCARD',
        noneLabel: 'NONE',
    },
    form: {
        loading: 'Loading...',
        pageTitle: 'UQ Asset Test and Tag',
        pageSubtitle: dept => `Managing Assets for ${dept}`,
        requiredText: 'All fields are required unless otherwise indicated.',
        event: {
            title: 'Event',
            aria: {
                collapseButtonLabel: 'Show more',
            },
            date: {
                label: 'Event date',
            },
            location: {
                title: 'Location',
                siteLabel: 'Site',
                building: {
                    label: 'Building',
                },
                floor: {
                    label: 'Floor',
                },
                room: { label: 'Room' },
            },
        },
        asset: {
            title: 'Asset',
            addText: 'ADD NEW ASSET',
            assetId: {
                label: 'Asset ID',
                helperText: 'Enter a new ID to add',
                placeholder: 'Enter at least 7 characters',
            },
            assetType: {
                label: 'Asset type',
            },
            ownerLabel: 'Asset owner',
        },
        lastInspectionPanel: {
            title: suffix => `Previous Inspection ${suffix}`,
            aria: {
                collapseButtonLabel: 'Show more',
            },
            statusLabel: 'Status: ',
            statusUnavailableLabel: 'Unavailable',
            statusUnknownLabel: 'UNKNOWN',
            testDateLabel: 'Inspection Date: ',
            siteLabel: 'Site: ',
            buildingLabel: 'Building: ',
            floorLabel: 'Floor: ',
            roomLabel: 'Room: ',
            alertLocationMismatch: 'Locations do not match',
            failReasonLabel: 'Fail Reason: ',
            testNotesLabel: 'Inspection Notes: ',
            nextTestDateLabel: 'Next Inspection Date: ',
            noneLabel: 'None',
        },
        inspection: {
            title: 'Inspection',
            deviceLabel: 'Testing device',
            testResultLabel: 'Inspection Result',
            nextTestDateLabel: 'Next inspection due',
            nextTestDateFormatted: dateStr => `Next inspection due ${dateStr}`,
            failReason: {
                label: 'Fail Reason',
            },
            inspectionNotes: {
                label: 'Inspection Notes',
            },
        },
        action: {
            title: 'Action',
            tabs: [
                {
                    label: 'Repair',
                    value: 1,
                },
                {
                    label: 'Discard',
                    value: 2,
                },
            ],
            repair: {
                label: 'Send for Repair?',
                options: [
                    { label: 'NO', value: 1 },
                    { label: 'YES', value: 2 },
                ],
                repairerDetails: {
                    label: 'Repairer Details',
                },
            },
            discard: {
                alertMessage: 'IMPORTANT: Only complete this section if you are actually discarding the asset.',
                label: 'Discard this Asset?',
                options: [
                    { label: 'NO', value: 1 },
                    { label: 'YES', value: 2 },
                ],
                discardReason: {
                    label: 'Discarding Reason',
                },
            },
        },
        buttons: {
            cancel: 'CANCEL',
            reset: 'RESET FORM',
            save: 'SAVE',
        },
        defaultSaveSuccessTitle: (
            <Typography align="center" component="div" variant="h6">
                Asset saved
            </Typography>
        ),
        defaultSaveSuccessMessage: '',
        saveSuccessConfirmation: (title, message = '') => ({
            confirmationTitle: title,
            confirmationMessage: message,
            confirmButtonLabel: 'Ok',
        }),
        saveError: {
            confirmationTitle: saveInspectionError =>
                !!saveInspectionError
                    ? `An error occurred: ${JSON.stringify(saveInspectionError)}`
                    : 'An unknown error occurred',
            confirmButtonLabel: 'OK',
        },
        networkError: {
            confirmationTitle:
                'A network error occurred while loading the requested data. Please try again or contact support if the issue persists.',
            confirmButtonLabel: 'OK',
        },
    },
};

/* istanbul ignore file */
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { pathConfig } from 'config/routes';

import InspectionIcon from '@material-ui/icons/Search';
import UsersIcon from '@material-ui/icons/People';
import AssetTypeIcon from '@material-ui/icons/DevicesOther';
import LocationIcon from '@material-ui/icons/MyLocation';
import InspectionDeviceIcon from '@material-ui/icons/Build';
import BulkUpdateIcon from '@material-ui/icons/DynamicFeed';
import OutForRepairIcon from '@material-ui/icons/ExitToApp';
import AssetsInspectedByDateIcon from '@material-ui/icons/EventNote';
import InspectionByUserIcon from '@material-ui/icons/PermContactCalendar';
import { pathConfig } from 'config/routes';

import { PERMISSIONS } from './config/auth';

export default {
    pages: {
        general: {
            loading: 'Loading...',
            pageTitle: 'UQ Asset Test and Tag',
            checkingAuth: 'Retrieving user details...',
            pageUnavailable: 'Page unavailable',
        },
        dashboard: {
            config: {},
            header: {
                pageSubtitle: dept => `Dashboard for ${dept}`,
            },
            panel: {
                inspections: {
                    title: 'INSPECTIONS',
                    link: 'Begin test and tagging of assets',
                },
                assets: {
                    title: 'ASSETS',
                    subtext: duration => <>needing a retest in the next {duration}.</>,
                },
                inspectionDevices: {
                    title: 'INSPECTION DEVICES',
                    subtext: duration => <>needing a recalibration in the next {duration}.</>,
                },
                management: {
                    title: 'MANAGEMENT',
                    links: [
                        {
                            title: 'USERS',
                            icon: <UsersIcon />,
                            permissions: [PERMISSIONS.can_admin],
                            path: '#',
                        },
                        {
                            title: 'ASSET TYPES',
                            icon: <AssetTypeIcon />,
                            path: `${pathConfig.admin.testntagmanageassettypes}?user=uqtesttag`,
                        },
                        {
                            title: 'LOCATIONS',
                            icon: <LocationIcon />,
                            permissions: [PERMISSIONS.can_admin],
                            path: `${pathConfig.admin.testntagmanagelocations}?user=uqtesttag`,
                        },
                        {
                            title: 'INSPECTION DEVICES',
                            icon: <InspectionDeviceIcon />,
                            path: '#',
                        },
                        {
                            title: 'BULK ASSET UPDATE',
                            icon: <BulkUpdateIcon />,
                            path: '#',
                        },
                        {
                            title: 'INSPECTIONS',
                            icon: <InspectionIcon />,
                            path: '#',
                        },
                    ],
                },
                reporting: {
                    title: 'REPORTING',
                    links: [
                        {
                            title: 'INSPECTION DEVICES DUE RECALIBRATION',
                            icon: <InspectionDeviceIcon />,
                            path: '#',
                        },
                        {
                            title: 'ASSETS DUE NEXT INSPECTION',
                            icon: <InspectionIcon />,
                            path: '#',
                        },
                        {
                            title: 'ASSETS OUT FOR REPAIR',
                            icon: <OutForRepairIcon />,
                            path: '#',
                        },
                        {
                            title: 'ASSETS INSPECTED BY BUILDING AND DATE RANGE',
                            icon: <AssetsInspectedByDateIcon />,
                            path: '#',
                        },
                        {
                            title: 'INSPECTIONS BY LICENSED USER',
                            icon: <InspectionByUserIcon />,
                            path: '#',
                            permissions: [PERMISSIONS.can_admin],
                        },
                    ],
                },
            },
        },
        inspect: {
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

            breadcrumbs: [
                {
                    title: 'Inspection',
                    icon: <InspectionIcon fontSize={'small'} />,
                },
            ],
            header: {
                pageSubtitle: dept => `Managing Assets for ${dept}`,
                requiredText: 'All fields are required unless otherwise indicated.',
            },
            form: {
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
                    repairDetailsLabel: 'Repair Details: ',
                    discardReasonLabel: 'Discard Reason: ',
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
                dialogLabels: {
                    testedBy: 'Tested By:',
                    testedDate: 'Date Tested:',
                    dateNextDue: 'Date Due:',
                    notApplicable: 'N/A',
                    outOfService: 'OUT OF SERVICE',
                    tagPlacedBy: 'TAG PLACED BY:',
                },
            },
        },
        assetTypeManagement: {
            breadcrumbs: [
                {
                    title: 'Asset Type Management',
                    icon: <AssetTypeIcon fontSize={'small'} />,
                },
            ],
            header: {
                pageSubtitle: dept => `Managing Asset Types for ${dept}`,
                requiredText: 'All fields are required unless otherwise indicated.',
        manage: {
            locations: {
                breadcrumbs: [
                    {
                        title: 'Manage Locations',
                        icon: <LocationIcon fontSize={'small'} />,
                    },
                ],
                header: {
                    pageSubtitle: dept => `Managing Locations for ${dept}`,
                },
                form: {
                    locationTypeTitle: 'Location type',
                },
            },
        },
    },
    locationPicker: {
        siteLabel: 'Site',
        building: {
            label: 'Building',
        },
        floor: {
            label: 'Floor',
        },
        room: { label: 'Room' },
    },
};

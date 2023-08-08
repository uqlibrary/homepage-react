/* istanbul ignore file */
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { pathConfig } from '../../../../config/pathConfig';

import InspectionIcon from '@material-ui/icons/Search';
import UsersIcon from '@material-ui/icons/People';
import AssetTypeIcon from '@material-ui/icons/DevicesOther';
import LocationIcon from '@material-ui/icons/LocationCity';
import InspectionDeviceIcon from '@material-ui/icons/Build';
import BulkUpdateIcon from '@material-ui/icons/DynamicFeed';
import AssetsInspectedByDateIcon from '@material-ui/icons/EventNote';
import InspectionByUserIcon from '@material-ui/icons/VerifiedUser';
import AssetIcon from '@material-ui/icons/Power';

import { PERMISSIONS } from './config/auth';

export default {
    config: {
        format: {
            dateFormat: 'YYYY-MM-DD HH:mm',
            dateFormatNoTime: 'YYYY-MM-DD',
            dateFormatDisplay: 'Do MMMM, YYYY',
        },
        monthsOptions: [
            { value: '3', label: '3 months' },
            { value: '6', label: '6 months' },
            { value: '12', label: '1 year' },
            { value: '60', label: '5 years' },
        ],
        assetStatus: {
            current: 'CURRENT',
            failed: 'FAILED',
            outforrepair: 'OUTFORREPAIR',
            discarded: 'DISCARDED',
        },
        inspectStatus: {
            passed: 'PASSED',
            failed: 'FAILED',
        },
        assetStatusOptions: [
            { value: 'CURRENT', label: 'Current' },
            { value: 'REMOVED', label: 'Removed' },
            { value: 'DISCARDED', label: 'Discarded' },
            { value: 'FAILED', label: 'Failed' },
            { value: 'OUTFORREPAIR', label: 'Out for Repair' },
        ],
        alerts: {
            timeout: 6000,
            success: () => 'Request successfully completed',
            error: err => `Encountered an error: ${err}`,
            failed: err => `Operation failed: ${err}`,
        },
    },
    pages: {
        general: {
            loading: 'Loading...',
            pageTitle: 'UQ Asset Test and Tag',
            checkingAuth: 'Retrieving user details...',
            pageUnavailable: 'Page unavailable',
            locationPicker: {
                allLabel: 'All',
                site: {
                    label: 'Site',
                    labelAll: 'All sites',
                },
                building: {
                    label: 'Building',
                    labelAll: 'All buildings',
                },
                floor: {
                    label: 'Floor',
                    labelAll: 'All floors',
                },
                room: { label: 'Room', labelAll: 'All rooms' },
            },
            helperText: {
                maxChars: count => `Max ${count} characters`,
                minChars: count => `Min ${count} characters`,
            },
        },
        dashboard: {
            config: {
                pluraliser: (text, count) => (
                    <>
                        {text}
                        {count > 1 ? 's' : ''}
                    </>
                ),
            },
            header: {
                pageSubtitle: dept => `Dashboard for ${dept}`,
            },
            panel: {
                inspections: {
                    id: 'new-inspection',
                    title: 'Test',
                    link: 'Begin test and tagging of assets',
                },
                assets: {
                    id: 'assets-due-inspection',
                    title: 'Assets',
                    subtext: duration => <>* due in the next {duration}.</>,
                    subtextLinkStart: 'View asset tests due',
                    subtextLink: (link, duration) => (
                        <>
                            {link} in the next {duration}.
                        </>
                    ),
                    upcomingText: 'upcoming *',
                    overdueText: 'overdue',
                },
                inspectionDevices: {
                    id: 'devices-due-recalibration',
                    title: 'Testing devices',
                    subtext: duration => <>* due in the next {duration}.</>,
                    subtextLinkStart: 'View testing device calibrations due',
                    subtextLink: (link, duration) => (
                        <>
                            {link} in the next {duration}.
                        </>
                    ),
                    upcomingText: 'upcoming *',
                    overdueText: 'overdue',
                },
                management: {
                    id: 'management',
                    title: 'Management',
                    links: [
                        {
                            id: 'asset-types',
                            title: 'Asset types',
                            icon: <AssetTypeIcon style={{ color: '#2b2a29' }} />,
                            path: pathConfig.admin.testntagmanageassettypes,
                            permissions: [PERMISSIONS.can_inspect],
                        },
                        {
                            id: 'bulk-asset-update',
                            title: 'Bulk asset update',
                            icon: <BulkUpdateIcon style={{ color: '#2b2a29' }} />,
                            path: pathConfig.admin.testntagmanagebulkassetupdate,
                            permissions: [PERMISSIONS.can_inspect, PERMISSIONS.can_alter],
                        },
                        {
                            id: 'inspections',
                            title: 'Test notes',
                            icon: <InspectionIcon style={{ color: '#2b2a29' }} />,
                            path: pathConfig.admin.testntagmanageinspectiondetails,
                            permissions: [PERMISSIONS.can_inspect],
                        },
                        {
                            id: 'inspection-devices',
                            title: 'Testing devices',
                            icon: <InspectionDeviceIcon style={{ color: '#2b2a29' }} />,
                            path: pathConfig.admin.testntagmanageinspectiondevices,
                            permissions: [PERMISSIONS.can_inspect, PERMISSIONS.can_alter],
                        },
                        {
                            id: 'locations',
                            title: 'Locations',
                            icon: <LocationIcon style={{ color: '#2b2a29' }} />,
                            permissions: [PERMISSIONS.can_admin],
                            path: pathConfig.admin.testntagmanagelocations,
                        },
                        {
                            id: 'users',
                            title: 'Users',
                            icon: <UsersIcon style={{ color: '#2b2a29' }} />,
                            permissions: [PERMISSIONS.can_admin],
                            path: pathConfig.admin.testntagmanageusers,
                        },
                    ],
                },
                reporting: {
                    id: 'reporting',
                    title: 'Reporting',
                    links: [
                        {
                            id: 'assets-due-inspection',
                            title: 'Assets due for testing',
                            icon: <AssetIcon style={{ color: '#2b2a29' }} />,
                            path: pathConfig.admin.testntagreportinspectionsdue,
                        },
                        {
                            id: 'assets-inspected',
                            title: 'Assets tested by building, status, and date range',
                            icon: <AssetsInspectedByDateIcon style={{ color: '#2b2a29' }} />,
                            path: pathConfig.admin.testntagreportassetsbyfilters,
                        },
                        {
                            id: 'inspections-by-user',
                            title: 'Tests by licenced user',
                            icon: <InspectionByUserIcon style={{ color: '#2b2a29' }} />,
                            path: pathConfig.admin.testntagreportinspectionsbylicenceduser,
                        },
                        {
                            id: 'devices-due-recalibration',
                            title: 'Testing devices due for recalibration',
                            icon: <InspectionDeviceIcon style={{ color: '#2b2a29' }} />,
                            path: pathConfig.admin.testntagreportrecalibrationssdue,
                        },
                    ],
                },
            },
        },
        inspect: {
            config: {
                dateFormat: 'YYYY-MM-DD HH:mm',
                dateFormatNoTime: 'YYYY-MM-DD',
                dateFormatDisplay: 'DD MMMM YYYY',
                currentLabel: 'CURRENT',
                passLabel: 'Pass',
                failedLabel: 'Fail',
                repairLabel: 'REPAIR',
                discardedLabel: 'DISCARD',
                noneLabel: 'NONE',
            },

            breadcrumbs: [
                {
                    title: 'Test asset',
                    icon: <InspectionIcon fontSize={'small'} />,
                },
            ],
            header: {
                pageSubtitle: dept => `Testing assets for ${dept}`,
            },
            form: {
                event: {
                    title: 'Event',
                    aria: {
                        collapseButtonLabel: 'Show more',
                    },
                    date: {
                        label: 'Event date',
                        maxDateMessage: 'Date can not be in the future',
                        inputProps: {
                            maxLength: 17,
                        },
                    },

                    location: {
                        title: 'Location',
                    },
                },
                asset: {
                    title: 'Asset',
                    addText: 'ADD NEW ASSET',
                    newAssetText: 'NEW ASSET',
                    assetSelector: {
                        label: 'Asset ID',
                        helperText: 'Scan or enter a barcode',
                        placeholder: 'Enter at least 3 characters',
                    },
                    assetType: {
                        props: {
                            label: 'Asset type',
                        },
                        addNewLabel: 'Add new asset type',
                        addDialog: {
                            confirmButtonLabel: 'Add',
                            cancelButtonLabel: 'Cancel',
                            confirmationTitle: 'Add new asset type',
                        },
                        loadError: 'Unable to load list of asset types',
                        saveError:
                            'Unable to save your new asset type. Please ensure the asset type name you have entered does not already exist in your department',
                    },
                    ownerLabel: 'Asset owner',
                },
                lastInspectionPanel: {
                    title: suffix => `Previous test ${suffix}`,
                    aria: {
                        collapseButtonLabel: 'Show more',
                    },
                    statusLabel: 'Status: ',
                    statusUnavailableLabel: 'unavailable',
                    statusUnknownLabel: 'UNKNOWN',
                    testDateLabel: 'Test date: ',
                    siteLabel: 'Site: ',
                    buildingLabel: 'Building: ',
                    floorLabel: 'Floor: ',
                    roomLabel: 'Room: ',
                    alertLocationMismatch: 'Locations do not match',
                    failReasonLabel: 'Fail reason: ',
                    testNotesLabel: 'Test notes: ',
                    nextTestDateLabel: 'Next test date: ',
                    noneLabel: 'None',
                    repairDetailsLabel: 'Repair details: ',
                    discardReasonLabel: 'Discard reason: ',
                },
                inspection: {
                    title: 'Test details',
                    deviceLabel: 'Testing device',
                    deviceInvalidForPass: device => `${device} can not be used for a PASS test`,
                    testResultLabel: 'Test result',
                    nextTestDateLabel: 'Next test due',
                    nextTestDateFormatted: dateStr => `Next test due ${dateStr}`,
                    failReason: {
                        label: 'Fail reason',
                    },
                    inspectionNotes: {
                        label: 'Test notes',
                    },
                },
                action: {
                    title: 'Action',
                    repair: {
                        label: 'Send for repair?',
                        options: [
                            { label: 'NO', value: 1 },
                            { label: 'YES', value: 2 },
                        ],
                        repairerDetails: {
                            label: 'Repairer details',
                        },
                    },
                    discard: {
                        alertMessage: 'IMPORTANT: Only complete this section if you are actually discarding the asset.',
                        label: 'Discard this asset?',
                        options: [
                            { label: 'NO', value: 1 },
                            { label: 'YES', value: 2 },
                        ],
                        discardReason: {
                            label: 'Discarding reason',
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
                        'A network error occurred while loading the requested data. You may need to log out and back in. Please try again or contact support if the issue persists.',
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
        manage: {
            config: {
                dateFormat: 'YYYY-MM-DD',
            },
            assetTypes: {
                breadcrumbs: [
                    {
                        title: 'Manage - Asset types',
                        icon: <AssetTypeIcon fontSize={'small'} />,
                    },
                ],
                header: {
                    pageSubtitle: dept => `Asset type management for ${dept}`,
                    addButtonLabel: 'Add asset type',
                },
                addAsset: {
                    title: 'Add new asset type',
                    cancelButtonLabel: 'Cancel',
                    confirmButtonLabel: 'Add',
                },
                editAsset: {
                    title: 'Edit asset type',
                    cancelButtonLabel: 'Cancel',
                    confirmButtonLabel: 'Update',
                },
                deleteConfirm: {
                    confirmButtonLabel: 'Proceed',
                    cancelButtonLabel: 'Cancel',
                    confirmationMessage: 'Are you sure you wish to remove this asset type?',
                    confirmationTitle: 'Remove unused asset type',
                },
                snackbars: {
                    loadFailed: 'Unable to load asset types',
                    addSuccess: 'Asset type added',
                    addFailed: 'Unable to add the asset type',
                    updateSuccess: 'Asset type updated',
                    updateFailed: 'Unable to update the asset type',
                    reallocateFailed: 'Unable to reallocate and delete the asset type',
                    deleteSuccess: 'Asset type Deleted',
                    deleteFailed: 'Unable to delete the asset type',
                },
                form: {
                    locationTypeTitle: 'Asset type',
                    actions: 'Actions',
                    addLocationButton: 'Add asset type',
                    actionTooltips: {
                        edit: 'Edit asset type',
                        delete: 'Delete asset type',
                    },
                    columns: {
                        asset_type_id: {
                            label: 'Id',
                        },
                        asset_type_name: {
                            label: 'Asset type name',
                        },
                        asset_type_class: {
                            label: 'Class',
                        },
                        asset_type_power_rating: {
                            label: 'Power rating',
                        },
                        asset_type: {
                            label: 'Type',
                        },
                        asset_type_notes: {
                            label: 'Notes',
                        },
                        asset_count: {
                            label: 'No. tests',
                        },
                    },
                },
                dialogAdd: {
                    confirmButtonLabel: 'Add',
                    cancelButtonLabel: 'Cancel',
                    confirmationTitle: type => `Add new ${type}`,
                },
                dialogEdit: {
                    confirmButtonLabel: 'Update',
                    cancelButtonLabel: 'Cancel',
                    confirmationTitle: type => `Edit ${type}`,
                },
                actionDialogue: {
                    confirmationTitle: 'Delete and reassign',
                    deleteReassignTargetPrompt: target => `Delete ${target ?? 'NONE'} and reassign all assets to:`,
                    newAssetTypePrompt: 'New asset type',
                    deleteReassignWarningPrompt: count => `This will affect ${count ?? 0} assets`,
                    cancelButtonLabel: 'Cancel',
                    confirmButtonLabel: 'Proceed',
                },
            },
            locations: {
                breadcrumbs: [
                    {
                        title: 'Manage - Locations',
                        icon: <LocationIcon fontSize={'small'} />,
                    },
                ],
                header: {
                    pageSubtitle: dept => `Locations management for ${dept}`,
                },
                form: {
                    title: 'Filter',
                    actions: 'Actions',
                    addLocationButton: location => `Add ${location}`,
                    columns: {
                        site: {
                            site_id: {
                                label: 'Site ID',
                            },
                            site_name: {
                                label: 'Site name',
                            },
                            site_id_displayed: {
                                label: 'Site ID',
                            },
                            asset_count: {
                                label: 'No. tests',
                            },
                        },
                        building: {
                            building_id: {
                                label: 'Building ID',
                            },
                            building_location: {
                                label: 'Location',
                            },
                            building_name: {
                                label: 'Building name',
                            },
                            building_id_displayed: {
                                label: 'Building ID',
                            },
                            asset_count: {
                                label: 'No. tests',
                            },
                        },
                        floor: {
                            floor_id: {
                                label: 'Floor ID',
                            },
                            floor_location: {
                                label: 'Floor name',
                            },
                            floor_id_displayed: {
                                label: 'Floor ID',
                            },
                            asset_count: {
                                label: 'No. tests',
                            },
                        },
                        room: {
                            room_id: {
                                label: 'Room ID',
                            },
                            room_location: {
                                label: 'Location',
                            },
                            room_description: {
                                label: 'Room name',
                            },
                            room_id_displayed: {
                                label: 'Room ID',
                            },
                            asset_count: {
                                label: 'No. tests',
                            },
                        },
                    },

                    actionTooltips: {
                        edit: 'Edit this location',
                        delete: 'Delete this location',
                    },
                },
                dialogAdd: {
                    confirmButtonLabel: 'Add',
                    cancelButtonLabel: 'Cancel',
                    confirmationTitle: type => `Add new ${type}`,
                },
                dialogEdit: {
                    confirmButtonLabel: 'Update',
                    cancelButtonLabel: 'Cancel',
                    confirmationTitle: type => `Edit ${type}`,
                },
                dialogDeleteConfirm: {
                    confirmButtonLabel: 'Proceed',
                    cancelButtonLabel: 'Cancel',
                    confirmationMessage: 'Are you sure you wish to delete this location?',
                    confirmationTitle: 'Delete unused location',
                },
                snackbar: {
                    addSuccess: 'Added the location successfully',
                    addFail: 'Unable to save the location',
                    updateSuccess: 'updated successfully',
                    updateFail: 'Unable to update the location',
                    deleteSuccess: 'deleted successfully',
                    deleteFail: 'Unable to delete the location',
                },
            },
            inspectiondevices: {
                breadcrumbs: [
                    {
                        title: 'Manage - Testing devices',
                        icon: <InspectionDeviceIcon fontSize={'small'} />,
                    },
                ],
                header: {
                    pageSubtitle: dept => `Testing device management for ${dept}`,
                },
                form: {
                    actions: 'Actions',
                    addDeviceButton: 'Add new device',
                    columns: {
                        device_id: {
                            label: 'Device ID',
                        },
                        device_model_name: {
                            label: 'Model name',
                        },
                        device_serial_number: {
                            label: 'Serial',
                        },
                        device_department: {
                            label: 'Department',
                        },
                        device_calibrated_date_last: {
                            label: 'Last calibrated',
                        },
                        device_calibrated_by_last: {
                            label: 'Last calibrated by',
                        },
                        device_calibration_due_date: {
                            label: 'Next calibration',
                        },
                    },

                    actionTooltips: {
                        edit: 'Edit this device',
                        delete: 'Delete this device',
                    },
                },
                dialogAdd: {
                    confirmButtonLabel: 'Add',
                    cancelButtonLabel: 'Cancel',
                    confirmationTitle: 'Add new device',
                },
                dialogEdit: {
                    confirmButtonLabel: 'Update',
                    cancelButtonLabel: 'Cancel',
                    confirmationTitle: 'Edit Device',
                },
                dialogDeleteConfirm: {
                    confirmButtonLabel: 'Proceed',
                    cancelButtonLabel: 'Cancel',
                    confirmationMessage: 'Are you sure you wish to delete this Device?',
                    confirmationTitle: 'Delete Device',
                },
                snackbar: {
                    addSuccess: 'Testing device added successfully',
                    addFail: 'Unable to add the testing device',
                    updateSuccess: 'Testing device updated successfully',
                    updateFail: 'Unable to update the testing device',
                    deleteSuccess: 'Testing device deleted successfully',
                    deleteFail: 'Unable to delete the testing device',
                },
            },
            inspectiondetails: {
                breadcrumbs: [
                    {
                        title: 'Manage - Test notes',
                        icon: <InspectionIcon fontSize={'small'} />,
                    },
                ],
                header: {
                    pageSubtitle: dept => `Test note management for ${dept}`,
                },
                form: {
                    actions: 'Actions',
                    columns: {
                        asset_id: {
                            label: 'ID',
                        },
                        asset_id_displayed: {
                            label: 'Asset ID',
                        },
                        asset_type: {
                            label: 'Type',
                        },
                        asset_status: {
                            label: 'Status',
                        },
                        user_name: {
                            label: 'Last tested by',
                        },
                        inspect_date: {
                            label: 'Last test date',
                        },
                        inspect_notes: {
                            label: 'Test notes',
                        },
                        inspect_fail_reason: {
                            label: 'Fail reason',
                        },
                        discard_reason: {
                            label: 'Discard reason',
                        },
                        repairer_name: {
                            label: 'Repair notes',
                        },
                    },
                    assetSelector: {
                        label: 'Asset ID',
                        helperText: 'Scan or enter a new ID to search',
                        placeholder: 'Enter at least 3 characters',
                    },

                    actionTooltips: {
                        edit: 'Edit test notes',
                    },
                },
                dialogEdit: {
                    confirmButtonLabel: 'Update',
                    cancelButtonLabel: 'Cancel',
                    confirmationTitle: 'Edit test notes',
                },
                snackbar: {
                    updateSuccess: 'Test notes updated successfully',
                    updateFail: 'Unable to update the test notes',
                },
            },
            bulkassetupdate: {
                config: {},
                breadcrumbs: [
                    {
                        title: 'Manage - Bulk asset update',
                        icon: <BulkUpdateIcon fontSize={'small'} />,
                    },
                ],
                header: {
                    pageSubtitle: dept => `Bulk asset management for ${dept}`,
                },
                form: {
                    columns: {
                        asset_id_displayed: { label: 'Asset ID' },
                        asset_type_name: { label: 'Type' },
                        asset_location: { label: 'Location' },
                        asset_status: { label: 'Status' },
                    },

                    assetType: {
                        props: {
                            label: 'Asset type',
                        },
                    },

                    assetStatus: {
                        label: 'Asset status',
                    },

                    filterDialog: {
                        title: 'Select assets by feature',
                        button: {
                            cancel: 'Cancel',
                            submit: 'Add selected',
                        },
                        form: {
                            columns: {
                                asset_barcode: { label: 'Barcode' },
                                asset_type_name: { label: 'Type' },
                                inspect_comment: { label: 'Last test notes' },
                                asset_location: { label: 'Location' },
                                asset_status: { label: 'Status' },
                            },
                            locationTitle: 'Location',
                            assetType: {
                                props: {
                                    label: 'Asset type',
                                },
                                title: 'Asset Type',
                                labelAll: 'All Asset Types',
                            },
                            ariaClearNotes: 'Clear test notes search',
                            testNoteSearch: {
                                label: 'Search test notes',
                                helperText: 'Max 50 characters, search will match entered phrase',
                            },
                        },
                    },
                    step: {
                        one: {
                            title: 'Step 1: Choose assets to update in bulk',
                            addText: 'ADD NEW ASSET',
                            newAssetText: 'NEW ASSET',
                            assetSelector: {
                                label: 'Asset ID',
                                helperText: 'Scan or enter barcode to search non-discarded assets',
                                placeholder: 'Enter at least 3 characters',
                            },
                            button: {
                                clear: 'Clear',
                                next: 'Next',
                                findAndAdd: 'Find and add by feature',
                            },
                            actionTooltips: {
                                delete: 'Remove from list',
                            },
                            tableSizeChanged: size => `${size} total assets chosen`,
                        },
                        two: {
                            title: 'Step 2: Choose bulk update actions',
                            subtext: count => <>You have selected {count} assets to bulk update.</>,
                            button: {
                                previous: 'Back',
                                submit: 'Bulk Update',
                            },
                            checkbox: {
                                location: 'Update Location',
                                status: 'Discard Asset',
                                assetType: 'Update Asset Type',
                                notes: 'Clear test notes',
                            },
                            discardReason: {
                                label: 'Discarding Reason',
                            },
                            dialogBulkUpdateConfirm: {
                                confirmButtonLabel: 'Proceed',
                                cancelButtonLabel: 'Cancel',
                                confirmationMessage:
                                    'Are you sure you wish to proceed with this bulk update of selected assets?',
                                confirmationTitle: 'Bulk Update Selected Assets',
                            },
                            snackbars: {
                                success: 'Bulk Asset update successful',
                                failed: 'Unable to bulk update Assets',
                            },
                        },
                    },
                },
            },
            users: {
                breadcrumbs: [
                    {
                        title: 'Manage - Users',
                        icon: <UsersIcon fontSize={'small'} />,
                    },
                ],
                header: {
                    pageSubtitle: dept => `User management for ${dept}`,
                },
                form: {
                    actions: 'Actions',
                    addButtonLabel: 'Add User',
                    columns: {
                        user_id: {
                            label: 'ID',
                        },
                        user_uid: {
                            label: 'User ID',
                        },
                        user_name: {
                            label: 'Name',
                        },
                        user_licence_number: {
                            label: 'Lic #',
                        },
                        can_admin: {
                            label: 'Admin',
                        },
                        can_admin_cb: {
                            label: 'Admin',
                        },
                        can_inspect: {
                            label: 'Inspect',
                        },
                        can_inspect_cb: {
                            label: 'Admin',
                        },
                        can_alter: {
                            label: 'Alter',
                        },
                        can_alter_cb: {
                            label: 'Admin',
                        },
                        can_see_reports: {
                            label: 'Report',
                        },
                        can_see_reports_cb: {
                            label: 'Admin',
                        },
                        user_current_flag: {
                            label: 'Current',
                        },
                        user_current_flag_cb: {
                            label: 'Current',
                        },
                        actions_count: {
                            label: 'No. Tests',
                        },
                    },
                    actionTooltips: {
                        edit: 'Edit this user',
                        delete: 'Delete this user',
                    },
                },
                dialogAdd: {
                    confirmButtonLabel: 'Add',
                    cancelButtonLabel: 'Cancel',
                    confirmationTitle: 'Add new user',
                },
                dialogEdit: {
                    confirmButtonLabel: 'Update',
                    cancelButtonLabel: 'Cancel',
                    confirmationTitle: 'Edit User',
                },
                snackbar: {
                    addSuccess: 'User added successfully',
                    addFail: 'Unable to add the User',
                    updateSuccess: 'User updated successfully',
                    updateFail: 'Unable to update the User',
                    deleteSuccess: 'User deleted successfully',
                    deleteFail: 'Unable to delete the User',
                },
                dialogDeleteConfirm: {
                    confirmButtonLabel: 'Proceed',
                    cancelButtonLabel: 'Cancel',
                    confirmationMessage: 'Are you sure you wish to delete this User?',
                    confirmationTitle: 'Delete User',
                },
                helperText: {
                    user_uid: 'A user ID must contain only lower case letters and numbers',
                    user_licence_number: 'A licence number is required for inspect privilege',
                    user_name: 'A user name is required',
                },
            },
        },
        report: {
            config: {
                dateFormat: 'YYYY-MM-DD HH:mm',
                dateFormatNoTime: 'YYYY-MM-DD',
                dateFormatDisplay: 'DD MMMM YYYY',
            },
            recalibrationsDue: {
                breadcrumbs: [
                    {
                        title: 'Report - Testing devices due recalibration',
                        icon: <InspectionDeviceIcon fontSize={'small'} />,
                    },
                ],
                header: {
                    pageSubtitle: dept => `Testing devices due recalibration report for ${dept}`,
                },
                form: {
                    columns: {
                        device_id: {
                            label: 'Device ID',
                        },
                        device_model_name: {
                            label: 'Model name',
                        },
                        device_serial_number: {
                            label: 'Serial',
                        },
                        device_calibration_due_date: {
                            label: 'Next calibration',
                        },
                        device_department: {
                            label: 'Department',
                        },
                        device_calibrated_date_last: {
                            label: 'Last calibrated',
                        },
                        device_calibrated_by_last: {
                            label: 'Last calibrated by',
                        },
                    },
                },
            },
            inspectionsDue: {
                breadcrumbs: [
                    {
                        title: 'Report - Asset tests due',
                        icon: <AssetIcon fontSize={'small'} />,
                    },
                ],
                header: {
                    pageSubtitle: dept => `Asset tests due report for ${dept}`,
                },
                form: {
                    title: 'Filter',
                    columns: {
                        asset_barcode: {
                            label: 'Barcode',
                        },
                        asset_type_name: {
                            label: 'Asset type',
                        },
                        asset_test_date: {
                            label: 'Last test',
                        },
                        asset_next_test_due_date: {
                            label: 'Test due',
                        },
                        asset_location: {
                            label: 'Location',
                        },
                    },
                    filterToDateLabel: 'Within date range',
                    filterToDateFormatted: value => `Including assets up to ${value}`,
                },
                tooltips: {
                    overdue: 'Overdue',
                },
            },
            inspectionsByLicencedUser: {
                breadcrumbs: [
                    {
                        title: 'Report - Tests by licenced users',
                        icon: <InspectionByUserIcon fontSize={'small'} />,
                    },
                ],
                header: {
                    pageSubtitle: dept => `Tests by licenced users report for ${dept}`,
                },
                form: {
                    title: 'Filter',
                    columns: {
                        user_id: {
                            label: 'User ID',
                        },
                        user_uid: {
                            label: 'User ID',
                        },
                        user_name: {
                            label: 'Name',
                        },
                        user_licence_number: {
                            label: 'Licence #',
                        },
                        start_date: {
                            label: 'First tag',
                            type: 'dateTime',
                        },
                        end_date: {
                            label: 'Last tag',
                            type: 'dateTime',
                        },
                        total_for_user: {
                            label: 'Total Inspections',
                        },
                    },
                    filterToDateLabel: 'Within date range',
                    filterToDateFormatted: value => `Including assets up to ${value}`,
                    errors: {
                        startDateBeforeEnd: 'Start date must be before end date',
                        endDateAfterStart: 'End date must be after start date',
                        startDateRequired: 'A start date is required to search by date',
                        endDateRequired: 'An end date is required to search by date',
                    },
                    selectedAndMore: count => ` (and ${count} more)`,
                    keyboardDatePicker: {
                        startDateLabel: 'Period start date',
                        startDateAriaLabel: 'change start date',
                        endDateLabel: 'Period end date',
                        endDateAriaLabel: 'change end date',
                    },
                    totalInspections: count => `Total tests: ${count}`,
                },
            },
            assetReportByFilters: {
                breadcrumbs: [
                    {
                        title: 'Report - Asset tests',
                        icon: <AssetsInspectedByDateIcon fontSize={'small'} />,
                    },
                ],
                header: {
                    pageSubtitle: dept => `Asset tests report for ${dept}`,
                },
                form: {
                    title: 'Filters',
                    columns: {
                        asset_barcode: {
                            label: 'Barcode',
                        },
                        building_name: {
                            label: 'Building name',
                        },
                        asset_type_name: {
                            label: 'Asset type',
                        },
                        asset_test_date: {
                            label: 'Last test',
                        },
                        asset_next_test_due_date: {
                            label: 'Test due',
                        },
                        asset_status: {
                            label: 'Status',
                        },
                    },
                    filterStatusLabel: 'With status',
                    filterBuildingLabel: 'Tagged building',
                    filterToDateLabel: 'Within date range',
                    filterToDateFormatted: value => `Including assets up to ${value}`,
                    statusTypes: [
                        {
                            id: 0,
                            label: 'All',
                            value: null,
                        },
                        {
                            id: 1,
                            label: 'Out for repair',
                            value: 'OUTFORREPAIR',
                        },
                    ],
                    keyboardDatePicker: {
                        startDateLabel: 'Tagged date from',
                        startDateAriaLabel: 'change start date',
                        endDateLabel: 'Tagged date to',
                        endDateAriaLabel: 'change end date',
                    },
                },
                errors: {
                    startDate: 'Start date must be before End Date',
                    endDate: 'End date must be after Start Date',
                },
            },
        },
    },
};

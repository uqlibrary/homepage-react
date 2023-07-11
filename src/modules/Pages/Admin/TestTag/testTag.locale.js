/* istanbul ignore file */
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { pathConfig } from '../../../../config/pathConfig';

import InspectionIcon from '@material-ui/icons/Search';
import UsersIcon from '@material-ui/icons/People';
import AssetTypeIcon from '@material-ui/icons/DevicesOther';
import LocationIcon from '@material-ui/icons/MyLocation';
import InspectionDeviceIcon from '@material-ui/icons/Build';
import BulkUpdateIcon from '@material-ui/icons/DynamicFeed';
import AssetsInspectedByDateIcon from '@material-ui/icons/EventNote';
import InspectionByUserIcon from '@material-ui/icons/PermContactCalendar';

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
                        {count > 1 ? 'S' : ''}
                    </>
                ),
            },
            header: {
                pageSubtitle: dept => `Dashboard for ${dept}`,
            },
            panel: {
                inspections: {
                    id: 'new-inspection',
                    title: 'INSPECTIONS',
                    link: 'Begin test and tagging of assets',
                },
                assets: {
                    id: 'assets-due-inspection',
                    title: 'ASSET INSPECTIONS',
                    subtext: duration => <>* due in the next {duration}.</>,
                    upcomingText: 'upcoming *',
                    overdueText: 'overdue',
                },
                inspectionDevices: {
                    id: 'devices-due-recalibration',
                    title: 'INSPECTION DEVICE RECALIBRATIONS',
                    subtext: duration => <>* due in the next {duration}.</>,
                    upcomingText: 'upcoming *',
                    overdueText: 'overdue',
                },
                management: {
                    id: 'management',
                    title: 'MANAGEMENT',
                    links: [
                        {
                            id: 'users',
                            title: 'USERS',
                            icon: <UsersIcon />,
                            permissions: [PERMISSIONS.can_admin],
                            path: '#',
                        },
                        {
                            id: 'asset-types',
                            title: 'ASSET TYPES',
                            icon: <AssetTypeIcon />,
                            path: pathConfig.admin.testntagmanageassettypes,
                        },
                        {
                            id: 'locations',
                            title: 'LOCATIONS',
                            icon: <LocationIcon />,
                            permissions: [PERMISSIONS.can_admin],
                            path: pathConfig.admin.testntagmanagelocations,
                        },
                        {
                            id: 'inspection-devices',
                            title: 'INSPECTION DEVICES',
                            icon: <InspectionDeviceIcon />,
                            path: pathConfig.admin.testntagmanageinspectiondevices,
                        },
                        {
                            id: 'bulk-asset-update',
                            title: 'BULK ASSET UPDATE',
                            icon: <BulkUpdateIcon />,
                            path: pathConfig.admin.testntagmanagebulkassetupdate,
                        },
                        {
                            id: 'inspections',
                            title: 'INSPECTIONS',
                            icon: <InspectionIcon />,
                            path: pathConfig.admin.testntagmanageinspectiondetails,
                        },
                    ],
                },
                reporting: {
                    id: 'reporting',
                    title: 'REPORTING',
                    links: [
                        {
                            id: 'devices-due-recalibration',
                            title: 'INSPECTION DEVICES DUE RECALIBRATION',
                            icon: <InspectionDeviceIcon />,
                            permissions: [PERMISSIONS.can_see_reports],
                            path: pathConfig.admin.testntagreportrecalibrationssdue,
                        },
                        {
                            id: 'assets-due-inspection',
                            title: 'ASSETS DUE NEXT INSPECTION',
                            icon: <InspectionIcon />,
                            permissions: [PERMISSIONS.can_see_reports],
                            path: pathConfig.admin.testntagreportinspectionsdue,
                        },
                        {
                            id: 'assets-inspected',
                            title: 'ASSETS INSPECTED BY BUILDING, STATUS, AND DATE RANGE',
                            icon: <AssetsInspectedByDateIcon />,
                            path: pathConfig.admin.testntagreportassetsbyfilters,
                        },
                        {
                            id: 'inspections-by-user',
                            title: 'INSPECTIONS BY LICENSED USER',
                            icon: <InspectionByUserIcon />,
                            path: pathConfig.admin.testntagreportinspectionsbylicenceduser,
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
                    },
                },
                asset: {
                    title: 'Asset',
                    addText: 'ADD NEW ASSET',
                    newAssetText: 'NEW ASSET',
                    assetSelector: {
                        label: 'Asset ID',
                        helperText: 'Enter a new ID to add',
                        placeholder: 'Enter at least 5 characters',
                    },
                    assetType: {
                        props: {
                            label: 'Asset type',
                        },
                        addNewLabel: 'Add new asset type',
                        saveSuccess: {
                            confirmationTitle: 'The asset type has been added',
                            confirmationMessage: '',
                            confirmButtonLabel: 'Close',
                        },
                        saveFailure: {
                            confirmationTitle: (
                                <span>
                                    There was a problem saving the Asset type.
                                    <br />
                                    Please try again later.
                                </span>
                            ),
                            confirmationMessage: '',
                            confirmButtonLabel: 'Close',
                        },
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
                        title: 'Asset Type Management',
                        icon: <AssetTypeIcon fontSize={'small'} />,
                    },
                ],
                header: {
                    pageSubtitle: dept => `Managing Asset Types for ${dept}`,
                    requiredText: 'All fields are required unless otherwise indicated.',
                    addButtonLabel: 'Add Asset Type',
                },
                addAsset: {
                    title: 'Add New Asset Type',
                    cancelButtonLabel: 'Cancel',
                    confirmButtonLabel: 'Add',
                },
                editAsset: {
                    title: 'Edit Asset Type',
                    cancelButtonLabel: 'Cancel',
                    confirmButtonLabel: 'Update',
                },
                deleteConfirm: {
                    confirmButtonLabel: 'Proceed',
                    cancelButtonLabel: 'Cancel',
                    confirmationMessage: 'Are you sure you wish to remove this Asset Type?',
                    confirmationTitle: 'Remove Unused Asset Type',
                },
                snackbars: {
                    loadFailed: error => `Error loading Asset Types. ${error}`,
                    addSuccess: 'Asset type added',
                    addFailed: error => `Error adding Asset Type. ${error}`,
                    updateSuccess: 'Asset type updated',
                    updateFail: error => `Error updating Asset Type. ${error}`,
                    reallocateSuccess: response =>
                        `Asset Type Deleted and reallocated. ${response.effected_assets} asset reallocated, and ${response.effected_asset_types} asset type(s) removed`,
                    reallocateFail: error => `Error Reallocating Asset Type. ${error}`,
                    deleteSuccess: 'Asset Type Deleted',
                    deleteFail: error => `Error deleting asset types. ${error}`,
                },
                form: {
                    locationTypeTitle: 'Asset type',
                    actions: 'Actions',
                    addLocationButton: 'Add asset type',
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
                            label: 'Usage',
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
                    confirmationTitle: 'Delete and Reassign',
                    deleteReassignTargetPrompt: target => `Delete ${target ?? 'NONE'} and reassign all assets to:`,
                    newAssetTypePrompt: 'New Asset Type',
                    deleteReassignWarningPrompt: count => `This will effect ${count ?? 0} assets`,
                    cancelButtonLabel: 'Cancel',
                    confirmButtonLabel: 'Proceed',
                },
            },
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
                    title: 'Filter',
                    actions: 'Actions',
                    addLocationButton: location => `Add ${location}`,
                    columns: {
                        site: {
                            site_id: {
                                label: 'Site ID',
                            },
                            site_name: {
                                label: 'Description',
                            },
                            site_id_displayed: {
                                label: 'Display name',
                            },
                            asset_count: {
                                label: 'Usage',
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
                                label: 'Description',
                            },
                            building_id_displayed: {
                                label: 'Display name',
                            },
                            asset_count: {
                                label: 'Usage',
                            },
                        },
                        floor: {
                            floor_id: {
                                label: 'Floor ID',
                            },
                            floor_location: {
                                label: 'Location',
                            },
                            floor_id_displayed: {
                                label: 'Display name',
                            },
                            asset_count: {
                                label: 'Usage',
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
                                label: 'Description',
                            },
                            room_id_displayed: {
                                label: 'Display name',
                            },
                            asset_count: {
                                label: 'Usage',
                            },
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
                dialogDeleteConfirm: {
                    confirmButtonLabel: 'Proceed',
                    cancelButtonLabel: 'Cancel',
                    confirmationMessage: 'Are you sure you wish to delete this Location?',
                    confirmationTitle: 'Delete unused Location',
                },
                alerts: {
                    addSuccess: location => `${location} added successfully`,
                    addFail: location => `${location} could not be saved`,
                    updateSuccess: location => `${location} updated successfully`,
                    updateFail: location => `${location} could not be updated`,
                    deleteSuccess: location => `${location} deleted successfully`,
                    deleteFail: location => `${location} could not be deleted`,
                },
            },
            inspectiondevices: {
                breadcrumbs: [
                    {
                        title: 'Manage Inspection Devices',
                        icon: <InspectionDeviceIcon fontSize={'small'} />,
                    },
                ],
                header: {
                    pageSubtitle: dept => `Managing Inspection Devices for ${dept}`,
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
                },
                dialogAdd: {
                    confirmButtonLabel: 'Add',
                    cancelButtonLabel: 'Cancel',
                    confirmationTitle: 'Add new device',
                },
                dialogEdit: {
                    confirmButtonLabel: 'Update',
                    cancelButtonLabel: 'Cancel',
                    confirmationTitle: 'Edit device',
                },
                dialogDeleteConfirm: {
                    confirmButtonLabel: 'Proceed',
                    cancelButtonLabel: 'Cancel',
                    confirmationMessage: 'Are you sure you wish to delete this device?',
                    confirmationTitle: 'Delete device',
                },
                alerts: {
                    addSuccess: 'Device added successfully',
                    addFail: 'Device could not be saved',
                    updateSuccess: 'Device updated successfully',
                    updateFail: 'Device could not be updated',
                    deleteSuccess: 'Device deleted successfully',
                    deleteFail: 'Device could not be deleted',
                },
            },
            inspectiondetails: {
                breadcrumbs: [
                    {
                        title: 'Manage Inspection Details',
                        icon: <InspectionIcon fontSize={'small'} />,
                    },
                ],
                header: {
                    pageSubtitle: dept => `Managing Inspection Details for ${dept}`,
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
                            label: 'Last Inspected by',
                        },
                        inspect_date: {
                            label: 'Last inspection date',
                        },
                        inspect_notes: {
                            label: 'Inspection notes',
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
                },
                dialogEdit: {
                    confirmButtonLabel: 'Update',
                    cancelButtonLabel: 'Cancel',
                    confirmationTitle: 'Edit asset details',
                },
                alerts: {
                    updateSuccess: 'Asset updated successfully',
                    updateFail: 'Asset could not be updated',
                },
            },
            bulkassetupdate: {
                config: {},
                breadcrumbs: [
                    {
                        title: 'Managing Bulk Asset Update',
                        icon: <BulkUpdateIcon fontSize={'small'} />,
                    },
                ],
                header: {
                    pageSubtitle: dept => `Managing Assets in bulk for ${dept}`,
                },
                form: {
                    columns: {
                        asset_id_displayed: { label: 'Asset ID' },
                        asset_type_name: { label: 'Type' },
                        asset_location: { label: 'Location' },
                        asset_status: { label: 'Status' },
                    },

                    assetType: {
                        label: 'Asset type',
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
                                asset_location: { label: 'Last Room ID' },
                                asset_status: { label: 'Status' },
                            },
                            locationTitle: 'Location',
                            assetTypeTitle: 'Asset Type',
                        },
                    },
                    step: {
                        one: {
                            title: 'Step 1: Choose assets to update in bulk',
                            addText: 'ADD NEW ASSET',
                            newAssetText: 'NEW ASSET',
                            assetSelector: {
                                label: 'Asset ID',
                                helperText: 'Scan or enter a new ID to add',
                                placeholder: 'Enter at least 3 characters',
                            },
                            button: {
                                clear: 'Clear',
                                next: 'Next',
                                findAndAdd: 'Find and add by feature',
                            },
                        },
                        two: {
                            title: 'Step 2: Choose bulk update action',
                            subtext: count => `You have selected ${count} assets to bulk update.`,
                            button: {
                                previous: 'Back',
                                submit: 'Bulk Update',
                            },
                            checkbox: {
                                location: 'Update Location',
                                status: 'Update Status',
                                assetType: 'Update Asset Type',
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
                                failed: error => `Error attempting to bulk update assets. ${error}`,
                            },
                        },
                    },
                },
            },
            users: {
                header: {
                    pageSubtitle: dept => `Managing users for ${dept}`,
                },
                breadcrumbs: [
                    {
                        title: 'Manage Users',
                        icon: <UsersIcon fontSize={'small'} />,
                    },
                ],
                form: {
                    actions: 'Actions',
                    addButtonLabel: 'Add User',
                    columns: {
                        user_id: {
                            label: 'ID',
                        },
                        user_uid: {
                            label: 'UUID',
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
                            label: 'Is Current',
                        },
                        user_current_flag_cb: {
                            label: 'Is Current',
                        },
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
                    confirmationTitle: 'Edit user',
                },
            },
        },
        report: {
            config: {
                dateFormat: 'YYYY-MM-DD HH:mm',
                dateFormatNoTime: 'YYYY-MM-DD',
                dateFormatDisplay: 'Do MMMM, YYYY',
            },
            recalibrationsDue: {
                breadcrumbs: [
                    {
                        title: 'Reports - Inspection Devices due recalibration',
                        icon: <InspectionDeviceIcon fontSize={'small'} />,
                    },
                ],
                header: {
                    pageSubtitle: dept => `Inspection device recalibration report for ${dept}`,
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
                },
            },
            inspectionsDue: {
                breadcrumbs: [
                    {
                        title: 'Reports - Asset Inspections Due',
                        icon: <InspectionIcon fontSize={'small'} />,
                    },
                ],
                header: {
                    pageSubtitle: dept => `Asset Inspections Due report for ${dept}`,
                },
                form: {
                    title: 'Filter',
                    columns: {
                        asset_barcode: {
                            label: 'Barcode',
                        },
                        asset_type_name: {
                            label: 'Asset Type',
                        },
                        asset_test_date: {
                            label: 'Last test',
                        },
                        asset_next_test_due_date: {
                            label: 'Next test',
                        },
                        asset_location: {
                            label: 'Location',
                        },
                    },
                    filterToDateLabel: 'Within date range',
                    filterToDateFormatted: value => `Including assets up to ${value}`,
                },
            },
            inspectionsByLicencedUser: {
                breadcrumbs: [
                    {
                        title: 'Reports - Inspections by Licenced Users',
                        icon: <InspectionByUserIcon fontSize={'small'} />,
                    },
                ],
                header: {
                    pageSubtitle: dept => `Inspections by Licenced Users for ${dept}`,
                },
                form: {
                    title: 'Filter',
                    columns: {
                        user_id: {
                            label: 'UserID',
                        },
                        user_uid: {
                            label: 'UUID',
                        },
                        user_name: {
                            label: 'Name',
                        },
                        user_licence_number: {
                            label: 'Licence #',
                        },
                        user_department: {
                            label: 'Dept.',
                        },
                        start_date: {
                            label: 'Start Date',
                            type: 'dateTime',
                        },
                        end_date: {
                            label: 'End Date',
                            type: 'dateTime',
                        },
                        total_for_user: {
                            label: 'Total',
                        },
                    },
                    filterToDateLabel: 'Within date range',
                    filterToDateFormatted: value => `Including assets up to ${value}`,
                },
            },
            assetReportByFilters: {
                breadcrumbs: [
                    {
                        title: 'Asset Report',
                        icon: <AssetsInspectedByDateIcon fontSize={'small'} />,
                    },
                ],
                header: {
                    pageSubtitle: dept => `Asset report for ${dept}`,
                },
                form: {
                    title: 'Filters',
                    columns: {
                        asset_barcode: {
                            label: 'Barcode',
                        },
                        building_name: {
                            label: 'Building Name',
                        },
                        asset_type_name: {
                            label: 'Asset Type',
                        },
                        asset_test_date: {
                            label: 'Last Inspection',
                        },
                        asset_next_test_due_date: {
                            label: 'Next Inspection',
                        },
                        asset_status: {
                            label: 'Status',
                        },
                    },
                    filterStatusLabel: 'With Status',
                    filterBuildingLabel: 'Tagged Building',
                    filterToDateLabel: 'Within date range',
                    filterTaggedDateFrom: 'Tagged Date From',
                    filterTaggedDateTo: 'Tagged Date To',
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
                },
                errors: {
                    startDate: 'Start date must be before End Date',
                    endDate: 'End date must be after Start Date',
                },
            },
        },
    },
};

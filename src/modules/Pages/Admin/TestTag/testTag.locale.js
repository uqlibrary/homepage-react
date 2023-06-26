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
        monthsOptions: [
            { value: '3', label: '3 months' },
            { value: '6', label: '6 months' },
            { value: '12', label: '1 year' },
            { value: '60', label: '5 years' },
        ],
        assetStatusOptions: [
            { value: 'CURRENT', label: 'Current' },
            { value: 'REMOVED', label: 'Removed' },
            { value: 'DISCARDED', label: 'Discarded' },
            { value: 'FAILED', label: 'Failed' },
            { value: 'OUTFORREPAIR', label: 'Out for Repair' },
        ],
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
                            path: `${pathConfig.admin.testntagmanageinspectiondevices}?user=uqtesttag`,
                        },
                        {
                            title: 'BULK ASSET UPDATE',
                            icon: <BulkUpdateIcon />,
                            path: `${pathConfig.admin.testntagmanagebulkassetupdate}?user=uqtesttag`,
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
                            permissions: [PERMISSIONS.can_see_reports],
                            path: `${pathConfig.admin.testntagreportinspectionsdue}?user=uqtesttag`,
                        },
                        {
                            title: 'ASSETS INSPECTED BY BUILDING, STATUS, AND DATE RANGE',
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
                    addLocationButton: 'Add Asset type',
                    columns: {
                        assettype: {
                            asset_type_id: {
                                label: 'Id',
                            },
                            asset_type_name: {
                                label: 'Asset Type Name',
                            },
                            asset_type_class: {
                                label: 'Class',
                            },
                            asset_type_power_rating: {
                                label: 'Power Rating',
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
                                placeholder: 'Enter at least 5 characters',
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
        },
        report: {
            config: {
                dateFormat: 'YYYY-MM-DD HH:mm',
                dateFormatNoTime: 'YYYY-MM-DD',
                dateFormatDisplay: 'Do MMMM, YYYY',
            },
            inspectionsDue: {
                breadcrumbs: [
                    {
                        title: 'Asset Inspections Due',
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
        },
    },
};

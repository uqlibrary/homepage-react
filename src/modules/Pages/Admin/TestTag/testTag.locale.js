import { /* mutateKey,*/ mutateObject, mutateClearObject } from './utils/transformers';

export default {
    config: {
        dateFormat: 'YYYY-MM-DD HH:MM',
        dateFormatNoTime: 'YYYY-MM-DD',
        dateFormatDisplay: 'Do MMMM, YYYY',
        currentLabel: 'CURRENT',
        passLabel: 'PASS',
        failedLabel: 'FAIL',
        repairLabel: 'REPAIR',
        discardedLabel: 'DISCARD',
        noneLabel: 'NONE',
        transformerRules: (passValue, failValue) => ({
            // asset_id_displayed: (_, data) => mutateKey(data, 'asset_id_displayed', 'asset_id_displayed'),
            inspection_status: (state, data) => ({
                with_inspection: {
                    ...state.with_inspection,
                    inspection_status:
                        data.room_id === -1
                            ? mutateClearObject(data, 'inspection_status')
                            : mutateObject(data, 'inspection_status'),
                },
            }),
            inspection_device_id: (state, data) => ({
                with_inspection: {
                    ...state.with_inspection,
                    inspection_device_id:
                        data.room_id === -1
                            ? mutateClearObject(data, 'inspection_device_id')
                            : mutateObject(data, 'inspection_device_id'),
                },
            }),
            inspection_fail_reason: (state, data) => ({
                with_inspection: {
                    ...state.with_inspection,
                    inspection_fail_reason:
                        data.room_id === -1
                            ? mutateClearObject(data, 'inspection_fail_reason')
                            : mutateObject(data, 'inspection_fail_reason'),
                },
            }),
            inspection_notes: (state, data) => ({
                with_inspection: {
                    ...state.with_inspection,
                    inspection_notes:
                        data.room_id === -1
                            ? mutateClearObject(data, 'inspection_notes')
                            : mutateObject(data, 'inspection_notes'),
                },
            }),
            inspection_date_next: (state, data) => ({
                with_inspection: {
                    ...state.with_inspection,
                    inspection_date_next:
                        data.room_id === -1
                            ? mutateClearObject(data, 'inspection_date_next')
                            : mutateObject(data, 'inspection_date_next'),
                },
            }),
            isRepair: (state, data) => ({
                with_repair: { ...state.with_repair, isRepair: mutateObject(data, 'isRepair') },
            }),
            // repairer_name: (state, data) => ({
            //     with_repair: { ...state.with_repair, repairer_name: mutateObject(data, 'repairer_name') },
            // }),
            repairer_contact_details: (state, data) => ({
                with_repair: {
                    ...state.with_repair,
                    repairer_contact_details: mutateObject(data, 'repairer_contact_details'),
                },
            }),
            isDiscarded: (state, data) => ({
                with_discarded: { ...state.with_discarded, isDiscarded: mutateObject(data, 'isDiscarded') },
            }),
            discard_reason: (state, data) => ({
                with_discarded: { ...state.with_discarded, discard_reason: mutateObject(data, 'discard_reason') },
            }),
            room_id: (_, data) => {
                if (data.room_id === -1) return { room_id: undefined };
                else return {};
            },
            with_inspection: state => {
                if (state.with_inspection.inspection_status === undefined) {
                    return { with_inspection: undefined };
                } else {
                    if (state.with_inspection.inspection_status === passValue) {
                        state.with_inspection.inspection_fail_reason = undefined;
                    }

                    if (state.with_inspection.inspection_status === failValue) {
                        state.with_inspection.inspection_date_next = undefined;
                    }

                    return { with_inspection: state.with_inspection };
                }
            },
            with_repair: state => {
                if (state.with_repair.isRepair) {
                    if (!!state.with_discarded) state.with_discarded.discard_reason = undefined;
                    delete state.with_repair.isRepair;
                    return { with_repair: state.with_repair, with_discarded: state.with_discarded };
                } else {
                    return { with_repair: undefined, with_discarded: state.with_discarded };
                }
            },
            with_discarded: state => {
                if (state.with_discarded.isDiscarded) {
                    if (!!state.with_repair) state.with_repair.repairer_contact_details = undefined;
                    delete state.with_discarded.isDiscarded;
                    return { with_repair: state.with_repair, with_discarded: state.with_discarded };
                } else {
                    return { with_discarded: undefined, with_repair: state.with_repair };
                }
            },
        }),
    },
    form: {
        loading: 'Loading...',
        pageTitle: 'UQ Asset Test and Tag',
        pageSubtitle: dept => `Managing Assets for ${dept}`,
        requiredText: 'All fields are required unless otherwise stated.',
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
            addText: pid => `Add ${pid}`,
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
        lastTestPanel: {
            title: suffix => `Previous Test ${suffix}`,
            aria: {
                collapseButtonLabel: 'Show more',
            },
            statusLabel: 'Status: ',
            statusUnavailableLabel: 'Unavailable',
            statusUnknownLabel: 'UNKNOWN',
            testDateLabel: 'Test Date: ',
            siteLabel: 'Site: ',
            buildingLabel: 'Building: ',
            floorLabel: 'Floor: ',
            roomLabel: 'Room: ',
            alertLocationMismatch: 'Locations do not match',
            failReasonLabel: 'Fail Reason: ',
            testNotesLabel: 'Test Notes: ',
            nextTestDateLabel: 'Next Test Date: ',
            noneLabel: 'None',
        },
        inspection: {
            title: 'Inspection',
            deviceLabel: 'Testing device',
            testResultLabel: 'Test Result',
            nextTestDateLabel: 'Next test due',
            nextTestDateFormatted: dateStr => `Next test due ${dateStr}`,
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
        saveSuccessConfirmation: {
            confirmationTitle: 'Inspection and/or action successfully saved.',
            confirmationMessage: '',
            confirmButtonLabel: 'Ok',
        },
        saveError: {
            confirmationTitle:
                'Your inspection could not be saved. Please try again or contact support if the issue persists.',
            confirmButtonLabel: 'OK',
        },
        networkError: {
            confirmationTitle:
                'A network error occurred while loading the requested data. Please try again or contact support if the issue persists.',
            confirmButtonLabel: 'OK',
        },
    },
};

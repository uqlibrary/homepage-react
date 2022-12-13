import { mutateObject, mutateClearObject } from '../utils/transformers';

export const saveInspectionTransformer = (passValue, failValue) => ({
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
    repairer_contact_details: (state, data) => ({
        with_repair: {
            ...state.with_repair,
            repairer_contact_details: mutateObject(data, 'repairer_contact_details'),
        },
    }),
    isDiscarded: (state, data) => ({
        with_discard: { ...state.with_discard, isDiscarded: mutateObject(data, 'isDiscarded') },
    }),
    discard_reason: (state, data) => ({
        with_discard: { ...state.with_discard, discard_reason: mutateObject(data, 'discard_reason') },
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
        // repair option only for FAILED inspections
        if (state.with_inspection?.inspection_status !== passValue && state.with_repair.isRepair) {
            /* istanbul ignore else */ if (!!state.with_discard) state.with_discard.discard_reason = undefined;
            delete state.with_repair.isRepair;
            return { with_repair: state.with_repair, with_discard: state.with_discard };
        } else {
            return { with_repair: undefined, with_discard: state.with_discard };
        }
    },
    with_discard: state => {
        if (state.with_discard.isDiscarded) {
            /* istanbul ignore else */ if (!!state.with_repair) state.with_repair.repairer_contact_details = undefined;
            delete state.with_discard.isDiscarded;
            return { with_repair: state.with_repair, with_discard: state.with_discard };
        } else {
            return { with_discard: undefined, with_repair: state.with_repair };
        }
    },
});

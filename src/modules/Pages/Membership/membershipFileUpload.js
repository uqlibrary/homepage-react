import { MAX_ATTACHMENTS } from 'data/actions/membershipActions';
import locale from './membership.locale';

const { upload } = locale;

/**
 * What may be attached to an application, and what a selected file is doing right now.
 */

// Matches the API's own limit - see the api's file config. A file over this is rejected there too, so checking
// here only saves the applicant the round trip.
export const MAX_FILE_SIZE_BYTES = 3145728;
export const MAX_FILE_SIZE_MB = MAX_FILE_SIZE_BYTES / 1024 / 1024;

// Checked against the browser's reported MIME type, not the file's name.
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

export const UPLOAD_STATUS = {
    READY: 'ready',
    UPLOADING: 'uploading',
    UPLOADED: 'uploaded',
    FAILED: 'failed',
};

export const isAllowedType = file => ALLOWED_FILE_TYPES.includes(file?.type);

export const isWithinSizeLimit = file => (file?.size ?? 0) <= MAX_FILE_SIZE_BYTES;

/**
 * Why a file cannot be attached, or undefined if it can.
 */
export const getFileRejection = file => {
    if (!isWithinSizeLimit(file)) {
        return upload.tooLarge(file.name, MAX_FILE_SIZE_MB);
    }
    if (!isAllowedType(file)) {
        return upload.wrongType(file.name);
    }
    return undefined;
};

export const toMegabytes = bytes => ((bytes ?? 0) / 1024 / 1024).toFixed(2);

/**
 * Sort newly chosen files into the ones that can be attached and the reasons the rest cannot.
 *
 * `alreadyHeld` is how many the application is already carrying, so the cap is applied across the whole set
 * rather than per selection. The API only reads back MAX_ATTACHMENTS, so a file beyond that would be stored
 * and silently lost - it is refused up front instead.
 */
export const partitionFiles = (files = [], alreadyHeld = 0) => {
    const accepted = [];
    const rejections = [];

    Array.from(files).forEach(file => {
        const rejection = getFileRejection(file);
        if (rejection) {
            rejections.push(rejection);
            return;
        }
        if (alreadyHeld + accepted.length >= MAX_ATTACHMENTS) {
            rejections.push(upload.tooMany(file.name, MAX_ATTACHMENTS));
            return;
        }
        accepted.push(file);
    });

    return { accepted, rejections };
};

/**
 * Whether anything the applicant chose is still waiting to go to the API.
 *
 * A file that failed counts as waiting: it is still on screen with a reason, and applying now would leave it
 * behind without the applicant realising.
 */
export const hasPendingUploads = (selected = []) => selected.some(item => item.status !== UPLOAD_STATUS.UPLOADED);

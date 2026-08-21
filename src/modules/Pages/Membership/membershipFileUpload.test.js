import { MAX_ATTACHMENTS } from 'data/actions/membershipActions';
import locale from './membership.locale';
import {
    ALLOWED_FILE_TYPES,
    MAX_FILE_SIZE_BYTES,
    MAX_FILE_SIZE_MB,
    UPLOAD_STATUS,
    getFileRejection,
    hasPendingUploads,
    isAllowedType,
    isWithinSizeLimit,
    partitionFiles,
    toMegabytes,
} from './membershipFileUpload';

const { upload } = locale;

const aFile = (name, type, size) => ({ name, type, size });
const aValidFile = name => aFile(name, 'application/pdf', 1024);

describe('membershipFileUpload', () => {
    describe('the limits', () => {
        // Must match the API's own file config; a mismatch means the applicant is told one thing and the API
        // enforces another.
        it('is 3MB', () => {
            expect(MAX_FILE_SIZE_BYTES).toBe(3145728);
            expect(MAX_FILE_SIZE_MB).toBe(3);
        });

        it('allows the three types the Library accepts', () => {
            expect(ALLOWED_FILE_TYPES).toEqual(['image/jpeg', 'image/png', 'application/pdf']);
        });
    });

    describe('isAllowedType', () => {
        it('accepts a jpeg, a png and a pdf', () => {
            expect(isAllowedType(aFile('a.jpg', 'image/jpeg', 1))).toBe(true);
            expect(isAllowedType(aFile('a.png', 'image/png', 1))).toBe(true);
            expect(isAllowedType(aFile('a.pdf', 'application/pdf', 1))).toBe(true);
        });

        // Checked on what the file is, not what it is called.
        it('refuses anything else, whatever it is named', () => {
            expect(isAllowedType(aFile('sneaky.pdf', 'application/x-msdownload', 1))).toBe(false);
            expect(isAllowedType(aFile('a.gif', 'image/gif', 1))).toBe(false);
            expect(isAllowedType(aFile('a.txt', '', 1))).toBe(false);
            expect(isAllowedType(undefined)).toBe(false);
        });
    });

    describe('isWithinSizeLimit', () => {
        it('accepts a file at or under the limit', () => {
            expect(isWithinSizeLimit(aFile('a.pdf', 'application/pdf', MAX_FILE_SIZE_BYTES))).toBe(true);
            expect(isWithinSizeLimit(aFile('a.pdf', 'application/pdf', 1))).toBe(true);
        });

        it('refuses a file over it', () => {
            expect(isWithinSizeLimit(aFile('a.pdf', 'application/pdf', MAX_FILE_SIZE_BYTES + 1))).toBe(false);
        });

        it('treats a file with no size as empty rather than breaking', () => {
            expect(isWithinSizeLimit(undefined)).toBe(true);
        });
    });

    describe('getFileRejection', () => {
        it('says nothing about a file that can be attached', () => {
            expect(getFileRejection(aValidFile('card.pdf'))).toBeUndefined();
        });

        it('names the file and the limit when it is too big, with the unit', () => {
            expect(getFileRejection(aFile('big.pdf', 'application/pdf', MAX_FILE_SIZE_BYTES + 1))).toBe(
                'big.pdf is greater than 3MB in size.',
            );
        });

        it('names the file when it is the wrong sort', () => {
            expect(getFileRejection(aFile('notes.docx', 'application/msword', 1024))).toBe(
                'notes.docx does not end in .png, .jpeg or .pdf.',
            );
        });

        it('reports the size first when a file is both too big and the wrong sort', () => {
            expect(getFileRejection(aFile('huge.gif', 'image/gif', MAX_FILE_SIZE_BYTES + 1))).toBe(
                upload.tooLarge('huge.gif', MAX_FILE_SIZE_MB),
            );
        });
    });

    describe('toMegabytes', () => {
        it('reports a size the way a person reads one', () => {
            expect(toMegabytes(1572864)).toBe('1.50');
            expect(toMegabytes(3145728)).toBe('3.00');
            expect(toMegabytes(1024)).toBe('0.00');
            expect(toMegabytes(undefined)).toBe('0.00');
        });
    });

    describe('partitionFiles', () => {
        it('accepts the files that can be attached', () => {
            const { accepted, rejections } = partitionFiles([aValidFile('a.pdf'), aValidFile('b.pdf')]);

            expect(accepted).toHaveLength(2);
            expect(rejections).toEqual([]);
        });

        it('keeps the good ones and reports the rest, rather than refusing the lot', () => {
            const { accepted, rejections } = partitionFiles([
                aValidFile('good.pdf'),
                aFile('bad.gif', 'image/gif', 1024),
            ]);

            expect(accepted.map(file => file.name)).toEqual(['good.pdf']);
            expect(rejections).toEqual(['bad.gif does not end in .png, .jpeg or .pdf.']);
        });

        // The API only ever reads back MAX_ATTACHMENTS, so one beyond that would be stored and silently lost.
        it('refuses more than the API will read back', () => {
            const files = Array.from({ length: MAX_ATTACHMENTS + 1 }, (_unused, i) => aValidFile(`file-${i}.pdf`));
            const { accepted, rejections } = partitionFiles(files);

            expect(accepted).toHaveLength(MAX_ATTACHMENTS);
            expect(rejections).toEqual([upload.tooMany(`file-${MAX_ATTACHMENTS}.pdf`, MAX_ATTACHMENTS)]);
        });

        it('counts what the application already carries towards the cap', () => {
            const { accepted, rejections } = partitionFiles([aValidFile('a.pdf'), aValidFile('b.pdf')], 3);

            expect(accepted.map(file => file.name)).toEqual(['a.pdf']);
            expect(rejections).toHaveLength(1);
        });

        it('accepts nothing when the application is already full', () => {
            const { accepted, rejections } = partitionFiles([aValidFile('a.pdf')], MAX_ATTACHMENTS);

            expect(accepted).toEqual([]);
            expect(rejections).toHaveLength(1);
        });

        it('copes with nothing being chosen', () => {
            expect(partitionFiles()).toEqual({ accepted: [], rejections: [] });
            expect(partitionFiles([])).toEqual({ accepted: [], rejections: [] });
        });

        // A FileList is not an array.
        it('copes with a FileList rather than an array', () => {
            const fileList = { 0: aValidFile('a.pdf'), length: 1 };

            expect(partitionFiles(fileList).accepted).toHaveLength(1);
        });
    });

    describe('hasPendingUploads', () => {
        it('is nothing pending when everything is uploaded', () => {
            expect(hasPendingUploads([{ status: UPLOAD_STATUS.UPLOADED }])).toBe(false);
            expect(hasPendingUploads([])).toBe(false);
            expect(hasPendingUploads()).toBe(false);
        });

        it('is pending while a file is waiting or on its way', () => {
            expect(hasPendingUploads([{ status: UPLOAD_STATUS.READY }])).toBe(true);
            expect(hasPendingUploads([{ status: UPLOAD_STATUS.UPLOADING }])).toBe(true);
        });

        // A failed file is still on screen; applying now would leave it behind unnoticed.
        it('counts a failed upload as still pending', () => {
            expect(hasPendingUploads([{ status: UPLOAD_STATUS.UPLOADED }, { status: UPLOAD_STATUS.FAILED }])).toBe(
                true,
            );
        });
    });
});

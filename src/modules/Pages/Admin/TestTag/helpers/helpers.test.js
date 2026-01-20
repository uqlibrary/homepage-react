import {
    capitaliseLeadingChar,
    isEmptyStr,
    isEmptyObject,
    createLocationString,
    isInvalidUUID,
    buildCSVString,
    downloadCSVFile,
} from './helpers';
import FileSaver from 'file-saver';

jest.mock('file-saver', () => ({
    saveAs: jest.fn(),
}));
describe('helpers', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('capitaliseLeadingChar operates correctly', () => {
        expect(capitaliseLeadingChar('test')).toEqual('Test');
        expect(capitaliseLeadingChar('Test')).toEqual('Test');
        expect(capitaliseLeadingChar('TesT')).toEqual('Test');
        expect(capitaliseLeadingChar('TEST')).toEqual('Test');
    });

    it('isEmptyStr operates correctly', () => {
        expect(isEmptyStr('test')).toEqual(false);
        expect(isEmptyStr('')).toEqual(true);
        expect(isEmptyStr(null)).toEqual(true);
        expect(isEmptyStr(undefined)).toEqual(true);
        expect(isEmptyStr([])).toEqual(true);
        expect(isEmptyStr({})).toEqual(true);
        expect(isEmptyStr(['a'])).toEqual(true);
        expect(isEmptyStr({ a: 'a' })).toEqual(true);
    });

    it('isEmptyObject operates correctly', () => {
        expect(isEmptyObject('test')).toEqual(true);
        expect(isEmptyObject('')).toEqual(true);
        expect(isEmptyObject(null)).toEqual(true);
        expect(isEmptyObject(undefined)).toEqual(true);
        expect(isEmptyObject([])).toEqual(true);
        expect(isEmptyObject({})).toEqual(true);
        expect(isEmptyObject(['a'])).toEqual(true);
        expect(isEmptyObject({ a: 'a' })).toEqual(false);
    });

    it('createLocationString operates correctly', () => {
        expect(createLocationString({ site: 'test1', building: 'test2', floor: 'test3', room: 'test4' })).toEqual(
            'test3-test4 test2, test1',
        );
    });

    it('isInvalidUUID operates correctly', () => {
        expect(isInvalidUUID('A')).toEqual(true);
        expect(isInvalidUUID('a')).toEqual(false);
        expect(isInvalidUUID('123456789012345678901')).toEqual(true);
    });

    describe('buildCSVString', () => {
        it('should return headers + rows joined by commas and newlines', () => {
            const headers = ['id', 'name'];
            const data = [
                ['1', 'Alice'],
                ['2', 'Bob'],
            ];

            expect(buildCSVString(headers, data)).toBe('id,name\n1,Alice\n2,Bob');
        });

        it('should handle empty data (returns only headers row)', () => {
            const headers = ['a', 'b'];
            const data = [];

            expect(buildCSVString(headers, data)).toBe('a,b');
        });
    });

    describe('downloadCSVFile', () => {
        it('should call FileSaver.saveAs with a csv Blob and ensures a .csv extension', () => {
            const csv = 'a,b\n1,2';
            downloadCSVFile(csv, 'report');

            expect(FileSaver.saveAs).toHaveBeenCalledTimes(1);
            const [blobArg, filenameArg] = FileSaver.saveAs.mock.calls[0];
            expect(blobArg).toBeInstanceOf(Blob);
            expect(blobArg.type).toBe('text/csv');
            expect(filenameArg).toBe('report.csv');
        });

        it('should strip an existing trailing .csv before re-appending .csv', () => {
            const csv = 'a,b\n1,2';
            downloadCSVFile(csv, 'my.csv.backup.csv');

            const [, filenameArg] = FileSaver.saveAs.mock.calls[0];
            expect(filenameArg).toBe('my.csv.backup.csv');
        });

        it('should passe the csv content into the Blob', done => {
            const csv = 'col\nvalue';
            downloadCSVFile(csv, 'data');

            const [blobArg] = FileSaver.saveAs.mock.calls[0];
            const reader = new FileReader();
            reader.onload = () => {
                expect(reader.result).toBe(csv);
                done();
            };
            reader.readAsText(blobArg);
        });
    });
});

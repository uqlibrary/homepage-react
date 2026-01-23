import FileSaver from 'file-saver';
import { dataTableDataToRows, downloadCSVFile, rowsToCSVString, sanitizeValue, locationTransformer } from './csv';

jest.mock('file-saver', () => ({
    saveAs: jest.fn(),
}));

describe('csv', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('sanitizeValue', () => {
        it('should return empty string for null or undefined', () => {
            expect(sanitizeValue(null)).toBe('');
            expect(sanitizeValue(undefined)).toBe('');
        });

        it('should return non-string values as-is', () => {
            expect(sanitizeValue(0)).toBe(0);
            expect(sanitizeValue(false)).toBe(false);
        });

        it('should strip non-printable characters', () => {
            expect(sanitizeValue('a\u0000b')).toBe('ab');
        });

        it('should normalize line endings', () => {
            expect(sanitizeValue('a\r\nb\rc')).toBe('"a\nb\nc"');
        });

        it('should quote and escape values when needed', () => {
            expect(sanitizeValue('a"b')).toBe('"a""b"');
            expect(sanitizeValue('a,b')).toBe('"a,b"');
            expect(sanitizeValue('a\nb')).toBe('"a\nb"');
        });

        it('should guard against csv injection', () => {
            expect(sanitizeValue('=sum(1,2)')).toBe('"\'=sum(1,2)"');
            expect(sanitizeValue('+1')).toBe("'+1");
            expect(sanitizeValue('-1')).toBe("'-1");
            expect(sanitizeValue('@cmd')).toBe("'@cmd");
        });
    });

    describe('dataTableDataToRows', () => {
        it('should build headers from column headerName values', () => {
            const columns = [
                { headerName: 'Name', field: 'name' },
                { headerName: 'Age', field: 'age' },
            ];

            const result = dataTableDataToRows(columns, []);

            expect(result.headers).toEqual(['Name', 'Age']);
        });

        it('should map data rows according to column field order', () => {
            const columns = [
                { headerName: 'Name', field: 'name' },
                { headerName: 'Age', field: 'age' },
            ];
            const data = [
                { name: 'Alice', age: 30 },
                { name: 'Bob', age: 25 },
            ];

            const result = dataTableDataToRows(columns, data);

            expect(result.data).toEqual([
                ['Alice', 30],
                ['Bob', 25],
            ]);
        });

        it('should use locationTransformer for location field', () => {
            const columns = [{ headerName: 'Location', field: 'location' }];
            const renderLocation = jest.fn().mockReturnValue('Rendered Location');
            const row = { location: 'raw-location' };

            const result = dataTableDataToRows(columns, [row], locationTransformer('location', renderLocation));

            expect(renderLocation).toHaveBeenCalledTimes(1);
            expect(renderLocation).toHaveBeenCalledWith(row);
            expect(result.data).toEqual([['Rendered Location']]);
        });

        it('should work when location is among other fields and preserve ordering', () => {
            const columns = [
                { headerName: 'Name', field: 'name' },
                { headerName: 'Location', field: 'location' },
                { headerName: 'Status', field: 'status' },
            ];
            const renderLocation = jest.fn(r => `LOC:${r.location}`);
            const data = [{ name: 'Alice', location: 'A1', status: 'Open' }];

            const result = dataTableDataToRows(columns, data, locationTransformer('location', renderLocation));

            expect(renderLocation).toHaveBeenCalledTimes(1);
            expect(result.data).toEqual([['Alice', 'LOC:A1', 'Open']]);
        });

        it('should fall back to raw location when locationTransformer returns a falsy value', () => {
            const columns = [{ headerName: 'Location', field: 'location' }];
            const renderLocation = jest.fn().mockReturnValue('');
            const row = { location: 'raw-location' };

            const result = dataTableDataToRows(columns, [row], locationTransformer('location', renderLocation));

            expect(renderLocation).toHaveBeenCalledTimes(1);
            expect(result.data).toEqual([['raw-location']]);
        });

        it('should handle empty data array', () => {
            const columns = [{ headerName: 'Col', field: 'col' }];
            const renderLocation = jest.fn();

            const result = dataTableDataToRows(columns, [], locationTransformer('location', renderLocation));

            expect(result.data).toEqual([]);
            expect(renderLocation).not.toHaveBeenCalled();
        });
    });

    describe('rowsToCSVString', () => {
        it('should join rows by commas and newlines', () => {
            const rows = [
                ['id', 'name'],
                ['1', 'Alice'],
                ['2', 'Bob'],
            ];

            expect(rowsToCSVString(rows)).toBe('id,name\n1,Alice\n2,Bob');
        });

        it('should handle empty rows', () => {
            expect(rowsToCSVString([])).toBe('');
        });

        it('should sanitize values via sanitizeValue', () => {
            const rows = [['=1+1', 'a"b', 'x\ry', 'a,b']];
            expect(rowsToCSVString(rows)).toBe('\'=1+1,"a""b","x\ny","a,b"');
        });
    });

    describe('downloadCSVFile', () => {
        it('should call FileSaver.saveAs with a csv Blob and ensure a .csv extension', () => {
            const csv = 'a,b\n1,2';
            downloadCSVFile(csv, 'report');

            expect(FileSaver.saveAs).toHaveBeenCalledTimes(1);
            const [blobArg, filenameArg] = FileSaver.saveAs.mock.calls[0];
            expect(blobArg).toBeInstanceOf(Blob);
            expect(blobArg.type).toBe('text/csv');
            expect(filenameArg).toBe('report.csv');
        });

        it('should keep filename stable when it already ends with .csv', () => {
            const csv = 'a,b\n1,2';
            downloadCSVFile(csv, 'my.csv.backup.csv');

            const [, filenameArg] = FileSaver.saveAs.mock.calls[0];
            expect(filenameArg).toBe('my.csv.backup.csv');
        });

        it('should pass the csv content into the Blob', done => {
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

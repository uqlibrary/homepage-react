import { buildCsv, CSV_HEADERS, downloadCsv, escapeCsvValue, fullName, membershipToCsvRow } from './membershipCsv';

describe('membershipCsv', () => {
    describe('fullName', () => {
        it('joins the parts of a name', () => {
            expect(fullName({ title: 'Mr', first_name: 'Jane', sn: 'Smith' })).toBe('Mr Jane Smith');
        });

        it('leaves no gap where a part is missing', () => {
            expect(fullName({ first_name: 'Jane', sn: 'Smith' })).toBe('Jane Smith');
            expect(fullName(undefined)).toBe('');
        });
    });

    describe('escapeCsvValue', () => {
        it('quotes every value, so a comma in a name does not split a column', () => {
            expect(escapeCsvValue('Smith, Jane')).toBe('"Smith, Jane"');
        });

        it('doubles a quote inside a value', () => {
            expect(escapeCsvValue('Jane "JJ" Smith')).toBe('"Jane ""JJ"" Smith"');
        });

        it('writes an empty string for a value that is not there', () => {
            expect(escapeCsvValue(null)).toBe('""');
            expect(escapeCsvValue(undefined)).toBe('""');
        });

        // Everything in this export was typed in by a member of the public, and it is opened in Excel.
        it.each(["=cmd|'/c calc'!A1", '+1+1', '-1+1', '@SUM(1:1)'])('defuses %s as a formula', value => {
            expect(escapeCsvValue(value)).toBe(`"'${value}"`);
        });

        it('leaves an ordinary value alone', () => {
            expect(escapeCsvValue('24067123456789')).toBe('"24067123456789"');
        });
    });

    describe('membershipToCsvRow', () => {
        it('reports the type by its title rather than its code', () => {
            const row = membershipToCsvRow({ type: 'community' }, { community: 'Community member' });

            expect(row[2]).toBe('Community member');
        });

        it('falls back to the code for a type the form data does not name', () => {
            expect(membershipToCsvRow({ type: 'community' }, {})[2]).toBe('community');
        });

        it('writes an empty row rather than throwing on a record that is not there', () => {
            expect(membershipToCsvRow(undefined)).toEqual(['', undefined, undefined, undefined, undefined]);
        });
    });

    describe('buildCsv', () => {
        it('leads with the headers the Library expects', () => {
            expect(buildCsv([]).split('\r\n')[0]).toBe(CSV_HEADERS.map(header => `"${header}"`).join(','));
        });

        it('is the headers alone when there is nothing to export', () => {
            expect(buildCsv().split('\r\n')).toHaveLength(1);
        });

        it('writes a row per application, in the column order of the headers', () => {
            const csv = buildCsv(
                [
                    {
                        title: 'Mr',
                        first_name: 'Jane',
                        sn: 'Smith',
                        mail: 'jane@example.com',
                        type: 'community',
                        expires_on: '01-01-2027',
                        barcode: '24067123456789',
                    },
                ],
                { community: 'Community member' },
            );

            expect(csv.split('\r\n')[1]).toBe(
                '"Mr Jane Smith","jane@example.com","Community member","01-01-2027","24067123456789"',
            );
        });
    });

    describe('downloadCsv', () => {
        it('hands the browser a named csv file and lets go of the url', () => {
            const click = jest.fn();
            const link = { click, href: '', download: '' };
            jest.spyOn(document, 'createElement').mockReturnValue(link);
            URL.createObjectURL = jest.fn().mockReturnValue('blob:membership');
            URL.revokeObjectURL = jest.fn();

            downloadCsv('memberships.csv', 'a,b');

            expect(link.download).toBe('memberships.csv');
            expect(link.href).toBe('blob:membership');
            expect(click).toHaveBeenCalled();
            expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:membership');

            document.createElement.mockRestore();
        });
    });
});

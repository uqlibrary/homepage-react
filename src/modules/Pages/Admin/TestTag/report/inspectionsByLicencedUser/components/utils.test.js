import { transformRow } from './utils';

describe('utils', () => {
    describe('transformRow', () => {
        it('returns expected results', () => {
            const actual = [{ id: 1, start_date: '01/01/2020', end_date: '12/12/2020' }];
            const expected = [{ id: 1, start_date: '2020-01-01', end_date: '2020-12-12', processed: true }];
            expect(transformRow(actual)).toEqual(expected);
        });
        it('returns expected result when row has been processed already', () => {
            const expected = [{ id: 1, start_date: '2020-01-01', end_date: '2020-12-12', processed: true }];
            expect(transformRow(expected)).toEqual(expected);
        });
        it('returns expected result if no start_date present', () => {
            const actual = [{ id: 1, end_date: '12/12/2020' }];
            const expected = [{ id: 1, start_date: '--', end_date: '--', processed: true }];
            expect(transformRow(actual)).toEqual(expected);
        });
        it('returns expected result if no end_date present', () => {
            const actual = [{ id: 1, start_date: '01/01/2020' }];
            const expected = [{ id: 1, start_date: '2020-01-01', end_date: '--', processed: true }];
            expect(transformRow(actual)).toEqual(expected);
        });
        it('returns expected result if no start or end_date present', () => {
            const actual = [{ id: 1 }];
            const expected = [{ id: 1, start_date: '--', end_date: '--', processed: true }];
            expect(transformRow(actual)).toEqual(expected);
        });
    });
});

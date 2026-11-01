import { pageRange, pluralApplications } from './membershipAdmin';

describe('membershipAdmin helpers', () => {
    describe('pluralApplications', () => {
        it('is singular for one and plural otherwise', () => {
            expect(pluralApplications(1)).toBe('application');
            expect(pluralApplications(0)).toBe('applications');
            expect(pluralApplications(5)).toBe('applications');
        });
    });

    describe('pageRange', () => {
        it('describes the first page', () => {
            expect(pageRange({ total: 42, page: 1, per_page: 20, pages: 3 })).toEqual({ start: 1, end: 20, total: 42 });
        });

        it('describes a middle page, and clamps the last one to the total', () => {
            expect(pageRange({ total: 42, page: 2, per_page: 20, pages: 3 })).toEqual({
                start: 21,
                end: 40,
                total: 42,
            });
            expect(pageRange({ total: 42, page: 3, per_page: 20, pages: 3 })).toEqual({
                start: 41,
                end: 42,
                total: 42,
            });
        });

        it('is null when there is nothing to describe', () => {
            expect(pageRange(null)).toBeNull();
            expect(pageRange({ total: 0, page: 1, per_page: 20, pages: 0 })).toBeNull();
        });
    });
});

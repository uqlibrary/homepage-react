import * as routes from './routes';

describe('Backend routes method', () => {
    it('should get zer-padded year', () => {
        expect(routes.zeroPaddedYear(null)).toBe('*');
        expect(routes.zeroPaddedYear(83)).toBe('0083');
    });

    // it('should construct url for POSSIBLE_RECORDS_API', () => {
    //     const testCases = [
    //         {
    //             values: { facets: {} },
    //             expected: {
    //                 apiUrl: 'records/search',
    //                 options: {
    //                     params: {
    //                         export_to: '',
    //                         order_by: 'desc',
    //                         page: 1,
    //                         per_page: 20,
    //                         rule: 'possible',
    //                         sort: 'score',
    //                     },
    //                 },
    //             },
    //         },
    //         {
    //             values: { facets: { filters: { one: 'one facet', two: 'two facets' } } },
    //             expected: {
    //                 apiUrl: 'records/search',
    //                 options: {
    //                     params: {
    //                         export_to: '',
    //                         order_by: 'desc',
    //                         page: 1,
    //                         per_page: 20,
    //                         rule: 'possible',
    //                         sort: 'score',
    //                         ['filters[facets][one]']: 'one facet',
    //                         ['filters[facets][two]']: 'two facets',
    //                     },
    //                 },
    //             },
    //         },
    //     ];
    //
    //     testCases.map(item => {
    //         expect(routes.POSSIBLE_RECORDS_API({ ...item.values })).toEqual(item.expected);
    //     });
    // });

    it('should construct url for FILE_UPLOAD_API', () => {
        expect(routes.FILE_UPLOAD_API()).toEqual({
            apiUrl: 'file/upload/presigned',
        });
    });

    it('should construct url for AUTHOR_API', () => {
        expect(routes.AUTHOR_API({ authorId: '12345' })).toEqual({ apiUrl: 'fez-authors/12345' });
    });

    it('should construct url for CURRENT_AUTHOR_API', () => {
        expect(routes.CURRENT_AUTHOR_API()).toEqual({ apiUrl: 'fez-authors' });
    });

    it('should construct url for CURRENT_ACCOUNT_API', () => {
        const MockDate = require('mockdate');
        MockDate.set('2020-01-01T00:00:00.000Z', 10);
        expect(routes.CURRENT_ACCOUNT_API()).toEqual({
            apiUrl: 'account',
            options: { params: { ts: '1577836800000' } },
        });
        MockDate.reset();
    });
});

import * as routes from './routes';
import { IN_CREATION, IN_DRAFT, IN_REVIEW, UNPUBLISHED, RETRACTED, SUBMITTED_FOR_APPROVAL } from 'config/general';

describe('Backend routes method', () => {
    it('should get zer-padded year', () => {
        expect(routes.zeroPaddedYear(null)).toBe('*');
        expect(routes.zeroPaddedYear(83)).toBe('0083');
    });

    it('should construct url for CURRENT_USER_RECORDS_API', () => {
        const testCases = [
            {
                values: '',
                expected: {
                    apiUrl: 'records/search',
                    options: {
                        params: {
                            export_to: '',
                            order_by: 'desc',
                            page: 1,
                            per_page: 20,
                            rule: 'mine',
                            sort: 'score',
                        },
                    },
                },
            },
            {
                values: {
                    page: 2,
                    pageSize: 30,
                    sortBy: 'score',
                    sortDirection: 'asc',
                    facets: { filters: { one: 'one facet' } },
                },
                expected: {
                    apiUrl: 'records/search',
                    options: {
                        params: {
                            export_to: '',
                            order_by: 'asc',
                            page: 2,
                            per_page: 30,
                            rule: 'mine',
                            sort: 'score',
                            ['filters[facets][one]']: 'one facet',
                        },
                    },
                },
            },
        ];

        testCases.map(item => {
            expect(routes.CURRENT_USER_RECORDS_API({ ...item.values })).toEqual(item.expected);
        });
    });

    it('should construct url for SEARCH_INTERNAL_RECORDS_API', () => {
        const testCases = [
            {
                values: { searchQuery: 'title search' },
                expected: {
                    apiUrl: 'records/search',
                    options: {
                        params: {
                            export_to: '',
                            order_by: 'desc',
                            page: 1,
                            per_page: 20,
                            sort: 'score',
                            title: 'title search',
                        },
                    },
                },
            },
            {
                values: {
                    searchQuery: 'title search',
                    page: 2,
                    pageSize: 30,
                    sortBy: 'score',
                    sortDirection: 'asc',
                    facets: { filters: { one: 'one facet' } },
                },
                expected: {
                    apiUrl: 'records/search',
                    options: {
                        params: {
                            export_to: '',
                            order_by: 'asc',
                            page: 2,
                            per_page: 30,
                            sort: 'score',
                            title: 'title search',
                            ['filters[facets][one]']: 'one facet',
                        },
                    },
                },
            },
        ];

        testCases.map(item => {
            expect(routes.SEARCH_INTERNAL_RECORDS_API({ ...item.values })).toEqual(item.expected);
        });
    });

    it('should return parameters for search query string from getStandardSearchParameters method', () => {
        const testCases = [
            {
                values: {},
                expected: {
                    export_to: '',
                    order_by: 'desc',
                    page: 1,
                    per_page: 20,
                    sort: 'score',
                },
            },
            {
                values: {
                    page: 2,
                    pageSize: 30,
                    sortBy: 'score',
                    sortDirection: 'asc',
                    facets: {
                        filters: {
                            one: 'one facet',
                        },
                    },
                },
                expected: {
                    export_to: '',
                    order_by: 'asc',
                    page: 2,
                    per_page: 30,
                    sort: 'score',
                    ['filters[facets][one]']: 'one facet',
                },
            },
            {
                values: {
                    page: 2,
                    pageSize: 30,
                    sortBy: 'score',
                    sortDirection: 'asc',
                    facets: {
                        showOpenAccessOnly: true,
                        filters: {
                            one: 'one facet',
                        },
                    },
                },
                expected: {
                    export_to: '',
                    order_by: 'asc',
                    page: 2,
                    per_page: 30,
                    sort: 'score',
                    ['filters[facets][one]']: 'one facet',
                },
            },
            {
                values: {
                    withUnknownAuthors: 1,
                },
                expected: {
                    export_to: '',
                    order_by: 'desc',
                    page: 1,
                    per_page: 20,
                    sort: 'score',
                    with_unknown_authors: 1,
                },
            },
        ];

        testCases.map(item => {
            expect(routes.getStandardSearchParams({ ...item.values })).toEqual(item.expected);
        });
    });

    it('should return parameters for search query string from getOpenAccessSearchParams method', () => {
        const testCases = [
            {
                values: {
                    page: 2,
                    pageSize: 30,
                    sortBy: 'score',
                    sortDirection: 'asc',
                    facets: { filters: { one: 'one facet' } },
                },
                expected: {},
            },
            {
                values: {
                    page: 2,
                    pageSize: 30,
                    sortBy: 'score',
                    sortDirection: 'asc',
                    facets: { showOpenAccessOnly: true, filters: { one: 'one facet' } },
                },
                expected: {
                    rek_oa_status: [453693, 453694, 453695, 453696, 453697, 453954, 454127, 454116],
                },
            },
        ];

        testCases.map(item => {
            expect(routes.getOpenAccessSearchParams({ ...item.values })).toEqual(item.expected);
        });
    });

    it('should construct url for SEARCH_KEY_LOOKUP_API', () => {
        const testCases = [
            {
                values: { searchKey: 'series', searchQuery: 'title search' },
                expected: {
                    apiUrl: 'records/search',
                    options: {
                        params: {
                            lookup_value: 'title search',
                            rule: 'lookup',
                            search_key: 'series',
                        },
                    },
                },
            },
        ];

        testCases.map(item => {
            expect(routes.SEARCH_KEY_LOOKUP_API({ ...item.values })).toEqual(item.expected);
        });
    });

    it('should construct url for POSSIBLE_RECORDS_API', () => {
        const testCases = [
            {
                values: { facets: {} },
                expected: {
                    apiUrl: 'records/search',
                    options: {
                        params: {
                            export_to: '',
                            order_by: 'desc',
                            page: 1,
                            per_page: 20,
                            rule: 'possible',
                            sort: 'score',
                        },
                    },
                },
            },
            {
                values: { facets: { filters: { one: 'one facet', two: 'two facets' } } },
                expected: {
                    apiUrl: 'records/search',
                    options: {
                        params: {
                            export_to: '',
                            order_by: 'desc',
                            page: 1,
                            per_page: 20,
                            rule: 'possible',
                            sort: 'score',
                            ['filters[facets][one]']: 'one facet',
                            ['filters[facets][two]']: 'two facets',
                        },
                    },
                },
            },
        ];

        testCases.map(item => {
            expect(routes.POSSIBLE_RECORDS_API({ ...item.values })).toEqual(item.expected);
        });
    });

    it('should construct url for AUTHORS_SEARCH_API', () => {
        expect(routes.AUTHORS_SEARCH_API({ query: 'jane' })).toEqual({
            apiUrl: 'fez-authors/search',
            options: { params: { query: 'jane', rule: 'lookup' } },
        });
    });

    it('should construct url for TRENDING_PUBLICATIONS_API', () => {
        expect(routes.TRENDING_PUBLICATIONS_API({})).toEqual({ apiUrl: 'records/trending' });
    });

    it('should construct url for FILE_UPLOAD_API', () => {
        expect(routes.FILE_UPLOAD_API()).toEqual({
            apiUrl: 'file/upload/presigned',
        });
    });

    it('should construct url for GET_NEWS_API', () => {
        expect(routes.GET_NEWS_API()).toEqual({ apiUrl: 'fez-news' });
    });

    it('should construct url for GET_ACML_QUICK_TEMPLATES_API', () => {
        expect(routes.GET_ACML_QUICK_TEMPLATES_API()).toEqual({ apiUrl: 'acml/quick-templates' });
    });

    it('should construct url for AUTHOR_TRENDING_PUBLICATIONS_API', () => {
        expect(routes.AUTHOR_TRENDING_PUBLICATIONS_API()).toEqual({ apiUrl: 'records/my-trending' });
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

    it(
        'should correctly construct url for SEARCH_INTERNAL_RECORDS_API ' +
            'when the rek_status key value is less than 0',
        () => {
            const testCases = [
                {
                    values: { searchMode: 'advanced', searchQueryParams: { rek_status: { value: -4 } } },
                    expected: {
                        apiUrl: 'records/search',
                        options: {
                            params: {
                                export_to: '',
                                order_by: 'desc',
                                page: 1,
                                per_page: 20,
                                sort: 'score',
                                mode: 'advanced',
                                key: {
                                    rek_status: [1, 3, 4, 5, 6, 7],
                                },
                            },
                        },
                    },
                },
                {
                    values: { searchMode: 'advanced', searchQueryParams: { rek_status: { value: 4 } } },
                    expected: {
                        apiUrl: 'records/search',
                        options: {
                            params: {
                                export_to: '',
                                order_by: 'desc',
                                page: 1,
                                per_page: 20,
                                sort: 'score',
                                mode: 'advanced',
                                key: {
                                    rek_status: 4,
                                },
                            },
                        },
                    },
                },
            ];

            testCases.map(item => {
                expect(routes.SEARCH_INTERNAL_RECORDS_API({ ...item.values })).toEqual(item.expected);
            });
        },
    );

    it('should construct url for THIRD_PARTY_LOOKUP_API_1FIELD', () => {
        expect(
            routes.THIRD_PARTY_LOOKUP_API_1FIELD({
                type: 'test1',
                field1: 'test2',
            }),
        ).toEqual({
            apiUrl: 'tool/lookup/test1/test2',
        });
    });

    it('should construct url for THIRD_PARTY_LOOKUP_API_2FIELD', () => {
        expect(
            routes.THIRD_PARTY_LOOKUP_API_2FIELD({
                type: 'test1',
                field1: 'test2',
                field2: 'test3',
            }),
        ).toEqual({
            apiUrl: 'tool/lookup/test1/test2/test3',
        });
    });
});

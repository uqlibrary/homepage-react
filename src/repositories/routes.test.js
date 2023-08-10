import * as routes from './routes';

describe('Backend routes method', () => {
    it('should get zero-padded year', () => {
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

    it('should construct url for UPLOAD_PUBLIC_FILES_API', () => {
        expect(routes.UPLOAD_PUBLIC_FILES_API()).toEqual({
            apiUrl: 'file/public',
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

    it('should construct url for TRAINING_API with special number of events', () => {
        const defaultNumberOfEvents = 6;
        const expectedParams = { take: defaultNumberOfEvents, 'filterIds[]': 104, ts: '1609905271491' };

        const get10TrainingEvents = routes.TRAINING_API();

        expect(get10TrainingEvents.apiUrl).toEqual('training_events');
        expect(get10TrainingEvents.options.params.take).toEqual(expectedParams.take);
        expect(get10TrainingEvents.options.params.filterIds).toEqual(expectedParams.filterIds);
    });

    it('Should accept a RequestNonCachedData parameter', () => {
        const AllAPIRequest = routes.ALERTS_ALL_API(false);
        expect(AllAPIRequest.apiUrl).toEqual('/alerts');
    });

    // it('Should return no prefix if not supplied for API Exams', () => {
    //     const AllAPIRequest = routes.SEARCH_SUGGESTIONS_API_EXAMS({ keyword: 'test' });
    //     expect(AllAPIRequest.apiUrl).toEqual(
    //         'https://api.library.uq.edu.au/staging/search_suggestions?type=exam_paper&prefix=test',
    //     );
    // });

    it('Should return valid path for Test Tag Asset Types (mine)', () => {
        const testParams = {
            locationId: 1,
            locationType: 'site',
            assetTypeId: 1,
            textSearch: 'test',
        };
        let AssetsMine = routes.TEST_TAG_ASSETS_MINE_API(testParams);
        expect(AssetsMine.apiUrl).toEqual(
            '/test-and-tag/asset/search/mine?location_id=1&location_type=site&asset_type_id=1&inspect_comment=test',
        );
        delete testParams.textSearch;
        AssetsMine = routes.TEST_TAG_ASSETS_MINE_API(testParams);
        expect(AssetsMine.apiUrl).toEqual(
            '/test-and-tag/asset/search/mine?location_id=1&location_type=site&asset_type_id=1',
        );
        delete testParams.locationType;
        AssetsMine = routes.TEST_TAG_ASSETS_MINE_API(testParams);
        expect(AssetsMine.apiUrl).toEqual('/test-and-tag/asset/search/mine?asset_type_id=1');
    });
    it('Should return valid path for Test Tag Assets Filtered', () => {
        const testFilter = {
            status: { discarded: true },
        };
        let AssetsFiltered = routes.TEST_TAG_ASSETS_FILTERED_API('test');
        expect(AssetsFiltered.apiUrl).toEqual('test-and-tag/asset/search/current/test');
        AssetsFiltered = routes.TEST_TAG_ASSETS_FILTERED_API('test', testFilter);
        expect(AssetsFiltered.apiUrl).toEqual('test-and-tag/asset/search/current/test');
        testFilter.status.discarded = false;
        AssetsFiltered = routes.TEST_TAG_ASSETS_FILTERED_API('test', testFilter);
        expect(AssetsFiltered.apiUrl).toEqual('test-and-tag/asset/search/current/test?without_discards=1');
    });
    it('Should return valid path for TnT Inspections Due', () => {
        const testFilter = {
            locationId: 1,
            locationType: 'site',
            period: 3,
            periodType: 'MONTH',
        };
        let inspectionsDue = routes.TEST_TAG_REPORT_INSPECTIONS_DUE_API(testFilter);
        expect(inspectionsDue.apiUrl).toEqual(
            'test-and-tag/report/pending-inspections?site_id=1&period_length=3&period_type=MONTH',
        );
        delete testFilter.period;
        delete testFilter.periodType;
        inspectionsDue = routes.TEST_TAG_REPORT_INSPECTIONS_DUE_API(testFilter);
        expect(inspectionsDue.apiUrl).toEqual('test-and-tag/report/pending-inspections?site_id=1');
        delete testFilter.locationId;
        inspectionsDue = routes.TEST_TAG_REPORT_INSPECTIONS_DUE_API(testFilter);
        expect(inspectionsDue.apiUrl).toEqual('test-and-tag/report/pending-inspections');
    });
});

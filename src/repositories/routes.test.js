import * as routes from './routes';

describe('Backend routes method', () => {
    it('should get zero-padded year', () => {
        expect(routes.zeroPaddedYear(null)).toBe('*');
        expect(routes.zeroPaddedYear(83)).toBe('0083');
    });

    it('should construct url for POSSIBLE_RECORDS_API', () => {
        const value = { facets: {} };
        const expected = {
            apiUrl: 'records/search',
            options: {
                params: {
                    export_to: '',
                    order_by: 'desc',
                    page: 1,
                    per_page: 20,
                    rule: 'possible',
                    sort: 'score',
                    ['filters[stats_only]']: true,
                },
            },
        };
        expect(routes.POSSIBLE_RECORDS_API({ value1: value })).toEqual(expected);
    });

    it('should construct url for INCOMPLETE_NTRO_RECORDS_API', () => {
        const value = { facets: {} };
        const expected = {
            apiUrl: 'records/search',
            options: {
                params: {
                    export_to: '',
                    order_by: 'desc',
                    page: 1,
                    per_page: 20,
                    rule: 'incomplete',
                    sort: 'score',
                    ['filters[stats_only]']: true,
                },
            },
        };
        expect(routes.INCOMPLETE_NTRO_RECORDS_API({ value1: value })).toEqual(expected);
    });

    it('should construct url for LEARNING_RESOURCES_COURSE_SUGGESTIONS_API', () => {
        const keyword = 'cows';
        expect(routes.LEARNING_RESOURCES_COURSE_SUGGESTIONS_API({ keyword })).toEqual({
            apiUrl: 'https://api.library.uq.edu.au/staging/learning_resources/suggestions?hint=cows',
        });
    });

    it('should construct url for GUIDES_API', () => {
        const keyword = 'FREN';
        expect(routes.GUIDES_API({ keyword })).toEqual({ apiUrl: 'library_guides/FREN' });
    });

    it('should construct url for LEARNING_RESOURCES_EXAMS_API', () => {
        const keyword = 'PHIL';
        expect(routes.LEARNING_RESOURCES_EXAMS_API({ keyword })).toEqual({ apiUrl: 'exams/course/PHIL/summary' });
    });

    it('should construct url for ALERT_BY_ID_API', () => {
        const id = '34tf-dr8s-gers';
        expect(routes.ALERT_BY_ID_API({ id })).toEqual({ apiUrl: 'alert/34tf-dr8s-gers' });
    });

    it('should construct url for ALERTS_CREATE_API', () => {
        expect(routes.ALERTS_CREATE_API()).toEqual({ apiUrl: 'alerts' });
    });

    it('should construct url for ALERT_UPDATE_API', () => {
        const id = '34tf-dr8s-gers';
        expect(routes.ALERT_UPDATE_API({ id })).toEqual({ apiUrl: 'alert/34tf-dr8s-gers' });
    });

    it('should construct url for ALERT_DELETE_API', () => {
        const id = '34tf-dr8s-gers';
        expect(routes.ALERT_DELETE_API({ id })).toEqual({ apiUrl: 'alert/34tf-dr8s-gers' });
    });

    it('should construct url for EXAMS_SEARCH_API', () => {
        const hint = 'PHYS';
        expect(routes.EXAMS_SEARCH_API(hint)).toEqual({ apiUrl: 'exams/search/PHYS' });
    });

    it('should construct url for EXAMS_SUGGESTION_API', () => {
        const hint = 'PHYS';
        expect(routes.EXAMS_SUGGESTION_API(hint)).toEqual({ apiUrl: 'exams/suggestions/PHYS' });
    });

    it('should construct url for READING_LIST_API', () => {
        const hint = { coursecode: 'FREN1010', campus: 'St%20Lucia', semester: '2020 Semester 1' };
        expect(routes.READING_LIST_API(hint)).toEqual({
            apiUrl: 'learning_resources/reading_list/count/FREN1010/St%20Lucia/2020%2520Semester%25201',
        });
    });

    it('should construct url for LIB_HOURS_API', () => {
        const MockDate = require('mockdate');
        MockDate.set('2020-01-01T00:00:00.000Z', 10);
        expect(routes.LIB_HOURS_API()).toEqual({
            apiUrl: 'library_hours/day',
            options: { params: { ts: '1577836800000' } },
        });
        MockDate.reset();
    });

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

    it('should construct url for LOANS_API', () => {
        const MockDate = require('mockdate');
        MockDate.set('2020-01-01T00:00:00.000Z', 10);
        expect(routes.LOANS_API()).toEqual({
            apiUrl: 'account/loans',
            options: { params: { ts: '1577836800000' } },
        });
        MockDate.reset();
    });

    it('should construct url for PRINTING_API', () => {
        const MockDate = require('mockdate');
        MockDate.set('2020-01-01T00:00:00.000Z', 10);
        expect(routes.PRINTING_API()).toEqual({
            apiUrl: 'papercut/balance',
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
        delete testParams.assetTypeId;
        AssetsMine = routes.TEST_TAG_ASSETS_MINE_API(testParams);
        expect(AssetsMine.apiUrl).toEqual('/test-and-tag/asset/search/mine');
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
    it('Should return valid path for TnT Asset report by filters', () => {
        const testFilter = {
            assetStatus: 'discarded',
            locationType: 'site',
            locationId: 1,
            inspectionDateFrom: '1999-01-01',
            inspectionDateTo: '2000-01-01',
        };
        let reportByFilters = routes.TEST_TAG_ASSET_REPORT_BY_FILTERS_LIST(testFilter);
        expect(reportByFilters.apiUrl).toEqual(
            'test-and-tag/asset/search/mine?asset_status=discarded&location_type=site&location_id=1&inspection_date_from=1999-01-01&inspection_date_to=2000-01-01',
        );
        delete testFilter.inspectionDateTo;
        reportByFilters = routes.TEST_TAG_ASSET_REPORT_BY_FILTERS_LIST(testFilter);
        expect(reportByFilters.apiUrl).toEqual(
            'test-and-tag/asset/search/mine?asset_status=discarded&location_type=site&location_id=1&inspection_date_from=1999-01-01',
        );
        delete testFilter.inspectionDateFrom;
        reportByFilters = routes.TEST_TAG_ASSET_REPORT_BY_FILTERS_LIST(testFilter);
        expect(reportByFilters.apiUrl).toEqual(
            'test-and-tag/asset/search/mine?asset_status=discarded&location_type=site&location_id=1',
        );
        delete testFilter.assetStatus;
        reportByFilters = routes.TEST_TAG_ASSET_REPORT_BY_FILTERS_LIST(testFilter);
        expect(reportByFilters.apiUrl).toEqual('test-and-tag/asset/search/mine?location_type=site&location_id=1');
        delete testFilter.locationId;
        reportByFilters = routes.TEST_TAG_ASSET_REPORT_BY_FILTERS_LIST(testFilter);
        expect(reportByFilters.apiUrl).toEqual('test-and-tag/asset/search/mine?location_type=site');
        delete testFilter.locationType;
        reportByFilters = routes.TEST_TAG_ASSET_REPORT_BY_FILTERS_LIST(testFilter);
        expect(reportByFilters.apiUrl).toEqual('test-and-tag/asset/search/mine');
    });
    describe('coverage', () => {
        it('should return valid path for routes', () => {
            expect(routes.TEST_TAG_SAVE_ASSETTYPE_API(100)).toEqual({ apiUrl: 'test-and-tag/asset-type/100' });
            expect(routes.TEST_TAG_FLOOR_API(100)).toEqual({ apiUrl: 'test-and-tag/building/100/current' });
            expect(routes.TEST_TAG_ROOM_API(100)).toEqual({ apiUrl: 'test-and-tag/floor/100/current' });
            expect(routes.TEST_TAG_ASSETS_API('pattern')).toEqual({
                apiUrl: '/test-and-tag/asset/search/current/pattern',
            });
            expect(routes.TEST_TAG_ADD_LOCATION_API('powerboard')).toEqual({ apiUrl: 'test-and-tag/powerboard' });
            expect(routes.TEST_TAG_MODIFY_LOCATION_API({ type: 'powerboard', id: 100 })).toEqual({
                apiUrl: 'test-and-tag/powerboard/100',
            });
            expect(routes.TEST_TAG_DELETE_ASSET_TYPE_API(100)).toEqual({ apiUrl: 'test-and-tag/asset-type/100' });
            expect(routes.TEST_TAG_ASSET_ACTION()).toEqual({ apiUrl: '/test-and-tag/action' });
            expect(routes.TEST_TAG_ASSETTYPE_ADD()).toEqual({ apiUrl: '/test-and-tag/asset-type' });
            expect(routes.TEST_TAG_INSPECTION_DEVICE_API()).toEqual({
                apiUrl: '/test-and-tag/inspection-device/current/mine',
            });
            expect(routes.TEST_TAG_ADD_INSPECTION_DEVICE_API()).toEqual({ apiUrl: '/test-and-tag/inspection-device' });
            expect(routes.TEST_TAG_MODIFY_INSPECTION_DEVICE_API(123)).toEqual({
                apiUrl: '/test-and-tag/inspection-device/123',
            });
            expect(routes.TEST_TAG_ONLOAD_DASHBOARD_API()).toEqual({ apiUrl: 'test-and-tag/onload/dashboard' });
            expect(routes.TEST_TAG_ONLOAD_INSPECT_API()).toEqual({ apiUrl: 'test-and-tag/onload/inspect' });
            expect(routes.TEST_TAG_ASSETTYPE_API()).toEqual({ apiUrl: 'test-and-tag/asset-type/current/mine' });
            expect(routes.TEST_TAG_DELETE_REASSIGN_ASSETTYPE_API()).toEqual({
                apiUrl: 'test-and-tag/asset-type/reassign',
            });
            expect(routes.TEST_TAG_ADD_ASSET_TYPE_API()).toEqual({ apiUrl: 'test-and-tag/asset-type' });
            expect(routes.TEST_TAG_SAVE_ASSETTYPE_API(100)).toEqual({ apiUrl: 'test-and-tag/asset-type/100' });
            expect(routes.TEST_TAG_DELETE_ASSET_TYPE_API(100)).toEqual({ apiUrl: 'test-and-tag/asset-type/100' });
            expect(routes.TEST_TAG_SITE_API()).toEqual({ apiUrl: 'test-and-tag/site/current' });
            expect(routes.TEST_TAG_USER_API()).toEqual({ apiUrl: 'test-and-tag/user' });
            expect(routes.TEST_TAG_ADD_USER_API()).toEqual({ apiUrl: 'test-and-tag/user' });
            expect(routes.TEST_TAG_UPDATE_USER_API(100)).toEqual({ apiUrl: 'test-and-tag/user/100' });
            expect(routes.TEST_TAG_DELETE_USER_API(100)).toEqual({ apiUrl: 'test-and-tag/user/100' });
            expect(routes.TEST_TAG_REPORT_UTILITY_LICENCED_USERS()).toEqual({
                apiUrl: 'test-and-tag/report/licenced-inspectors',
            });
            expect(routes.TEST_TAG_TAGGED_BUILDING_LIST()).toEqual({ apiUrl: 'test-and-tag/building/mine' });
            expect(routes.TEST_TAG_BULK_UPDATE_API()).toEqual({ apiUrl: 'test-and-tag/asset' });
            expect(routes.TEST_TAG_MODIFY_INSPECTION_DETAILS_API(99)).toEqual({
                apiUrl: '/test-and-tag/asset/99/action',
            });
            expect(routes.TEST_TAG_USER_LIST_API()).toEqual({ apiUrl: 'test-and-tag/users/all' });

            expect(routes.DLOR_ALL_API()).toEqual({ apiUrl: 'dlor/public/list/full' }); // is admin in staging
            expect(routes.DLOR_ALL_CURRENT_API()).toEqual({ apiUrl: 'dlor/public/list/current' });
            expect(routes.DLOR_GET_BY_ID_API({ id: 100 })).toEqual({ apiUrl: 'dlor/public/find/100' });
            expect(routes.DLOR_TEAM_LIST_API()).toEqual({ apiUrl: 'dlor/public/teams/list' });
            expect(routes.DLOR_GET_FILTER_LIST()).toEqual({ apiUrl: 'dlor/public/facet/list' });
            expect(routes.DLOR_SERIES_LIST_API()).toEqual({ apiUrl: 'dlor/public/series/list' });
            expect(routes.DLOR_SUBSCRIPTION_CONFIRMATION_API({ id: 100 })).toEqual({
                apiUrl: 'dlor/public/100/confirm/subscribe',
            });
            expect(routes.DLOR_UNSUBSCRIBE_API({ id: 100 })).toEqual({
                apiUrl: 'dlor/public/100/confirm/unsubscribe',
            });
            expect(routes.DLOR_UNSUBSCRIBE_FIND_API({ id: 100 })).toEqual({
                apiUrl: 'dlor/public/100/confirm/find',
            });

            expect(routes.DLOR_DEMOGRAPHICS_SAVE_API()).toEqual({ apiUrl: 'dlor/auth/demographics' });

            expect(routes.DLOR_CREATE_API()).toEqual({ apiUrl: 'dlor/admin/object' });
            expect(routes.DLOR_UPDATE_API(100)).toEqual({ apiUrl: 'dlor/admin/object/100' });
            expect(routes.DLOR_DESTROY_API({ id: 100 })).toEqual({ apiUrl: 'dlor/admin/object/100' });
            expect(routes.DLOR_TEAM_DELETE_API(100)).toEqual({ apiUrl: 'dlor/admin/team/100' });
            expect(routes.DLOR_TEAM_SINGLE_GET_API({ id: 100 })).toEqual({ apiUrl: 'dlor/admin/team/100' });
            expect(routes.DLOR_TEAM_UPDATE_API(100)).toEqual({ apiUrl: 'dlor/admin/team/100' });
            expect(routes.DLOR_TEAM_CREATE_API()).toEqual({ apiUrl: 'dlor/admin/team' });
            expect(routes.DLOR_FILE_TYPE_LIST_API()).toEqual({ apiUrl: 'dlor/admin/file_types/list' });
            expect(routes.DLOR_SERIES_DELETE_API(100)).toEqual({ apiUrl: 'dlor/admin/series/100' });
            expect(routes.DLOR_SERIES_UPDATE_API(100)).toEqual({ apiUrl: 'dlor/admin/series/100' });
            expect(routes.DLOR_SERIES_CREATE_API()).toEqual({ apiUrl: 'dlor/admin/series' });

            expect(routes.DRUPAL_ARTICLE_API()).toEqual({
                apiUrl: 'https://assets.library.uq.edu.au/reusable-webcomponents-staging/api/homepage/articles.json',
            });

            expect(routes.VEMCOUNT_API()).toEqual({
                apiUrl: 'https://assets.library.uq.edu.au/reusable-webcomponents-staging/api/homepage/headcount.json',
            });

            expect(routes.JOURNAL_SEARCH_API()).toEqual({
                apiUrl: 'https://api.library.uq.edu.au/v1/journals/favourites?sort=score',
            });
        });
    });

    describe('AWS production route test', () => {
        const envPlaceholder = process.env.BRANCH;
        beforeEach(() => {
            process.env.BRANCH = 'production';
            jest.resetModules();
        });
        afterEach(() => {
            process.env.BRANCH = envPlaceholder;
        });
        it('should return valid path for aws production route', () => {
            expect(routes.DRUPAL_ARTICLE_API()).toEqual({
                apiUrl: 'https://assets.library.uq.edu.au/reusable-webcomponents/api/homepage/articles.json',
            });
        });
    });
});

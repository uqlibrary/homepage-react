import {
    dlorAdminLink,
    exportDemographicsToCSV,
    exportDLORDataToCSV,
    fetchAndExportFavouritesToCSV,
    getUserPostfix,
    isValidEmail,
    splitStringToArrayOnPipe,
} from './dlorAdminHelpers';
import { DLOR_FAVOURITES_REPORT_API } from 'repositories/routes';
import { get } from 'repositories/generic';

jest.mock('repositories/generic', () => ({
    get: jest.fn(),
}));

describe('helpers', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        document.body.innerHTML = '';
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('splits keywords correctly', () => {
        // These have been rewritten, as they are no longer manually entered - they are selected from a list.
        // This is for backwards compat only
        expect(splitStringToArrayOnPipe('abc|def|hij')).toEqual(['abc', 'def', 'hij']);
        expect(splitStringToArrayOnPipe('"abc, abc"|def|hij')).toEqual(['abc, abc', 'def', 'hij']);
        expect(splitStringToArrayOnPipe('abc')).toEqual(['abc']);
        expect(splitStringToArrayOnPipe('abc|def|hij')).toEqual(['abc', 'def', 'hij']);
        expect(splitStringToArrayOnPipe('')).toEqual('');
    });

    it('generates admin links correctly', () => {
        const account = { id: 'dloradmn', groups: ['lib_dlor_admins'] };
        expect(dlorAdminLink('/add', account)).toEqual('/admin/dlor/add');
        expect(dlorAdminLink(undefined, account)).toEqual('/admin/dlor');
        expect(dlorAdminLink('/edit', { id: 'user', groups: ['other'] })).toEqual('/digital-learning-hub/edit');
    });

    it('validates emails correctly', () => {
        expect(isValidEmail('blah')).toEqual(false); // simple
        expect(isValidEmail('lea@example.com')).toEqual(true); // simple
        expect(isValidEmail('lea+1@example.com')).toEqual(true); // various valid usernames
        expect(isValidEmail('lea.1@example.com')).toEqual(true);
        expect(isValidEmail('lea%1@example.com')).toEqual(true);
        expect(isValidEmail('lea-1@example.com')).toEqual(true);
        expect(isValidEmail('lea@degroot.id.au')).toEqual(true); // cctld
        expect(isValidEmail('lea@example1.com')).toEqual(true); // number in domain
        expect(isValidEmail(null)).toEqual(false);
    });

    it('returns an empty user postfix outside localhost', () => {
        expect(getUserPostfix()).toEqual('');
        expect(getUserPostfix('&')).toEqual('');

        window.location.hash = '#/page?user=carol';
        expect(getUserPostfix()).toEqual('');
    });

    it('exports demographics CSV data correctly', () => {
        const appendChildSpy = jest.spyOn(document.body, 'appendChild');
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        URL.createObjectURL = jest.fn(() => 'blob:demo');
        URL.revokeObjectURL = jest.fn();
        const urlSpy = jest.spyOn(URL, 'createObjectURL');
        const revokeSpy = jest.spyOn(URL, 'revokeObjectURL');
        jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

        exportDemographicsToCSV([], 'demo.csv');
        expect(consoleErrorSpy).toHaveBeenCalledWith('No demographics data to export.');

        const data = [
            {
                object_public_uuid: 'obj-123',
                object_title: 'Title "quoted"',
                object_summary: 'Summary, with comma',
                demographics_event_date: '2024-03-02',
                demographics_subject_code: false,
                demographics_school_name: 0,
                demographics_user_name: 'u1000',
                demographics_comments: 'hello\nworld',
            },
        ];

        exportDemographicsToCSV(data, 'demo.csv');

        expect(urlSpy).toHaveBeenCalledTimes(1);
        expect(revokeSpy).toHaveBeenCalledTimes(1);
        expect(appendChildSpy).toHaveBeenCalledTimes(1);
        const link = appendChildSpy.mock.calls[0][0];
        expect(link.getAttribute('download')).toBe('demo.csv');
        expect(link.getAttribute('data-testid')).toBe('download-demographics-link');
    });

    it('fetches and exports favourite CSV reports and handles errors', async () => {
        const appendChildSpy = jest.spyOn(document.body, 'appendChild');
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        URL.createObjectURL = jest.fn(() => 'blob:favourite');
        URL.revokeObjectURL = jest.fn();
        const urlSpy = jest.spyOn(URL, 'createObjectURL');
        const revokeSpy = jest.spyOn(URL, 'revokeObjectURL');
        jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

        get.mockResolvedValue({
            data: {
                data: [{ public_uuid: 'f-1', username: 'user1', title: 'Favourite', description: 'A "great" record' }],
            },
        });

        await fetchAndExportFavouritesToCSV('favourites.csv');

        expect(get).toHaveBeenCalledWith(DLOR_FAVOURITES_REPORT_API());
        expect(urlSpy).toHaveBeenCalledTimes(1);
        expect(revokeSpy).toHaveBeenCalledTimes(1);
        expect(appendChildSpy.mock.calls[0][0].getAttribute('download')).toBe('favourites.csv');

        get.mockRejectedValue(new Error('download failed'));
        await expect(fetchAndExportFavouritesToCSV('favourites.csv')).rejects.toThrow('download failed');
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error exporting favourites:', expect.any(Error));
    });

    it('exports DLO CSV data and handles empty inputs', () => {
        const appendChildSpy = jest.spyOn(document.body, 'appendChild');
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        URL.createObjectURL = jest.fn(() => 'blob:dlor');
        URL.revokeObjectURL = jest.fn();
        const urlSpy = jest.spyOn(URL, 'createObjectURL');
        const revokeSpy = jest.spyOn(URL, 'revokeObjectURL');
        jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

        exportDLORDataToCSV([], 'dlor.csv');
        expect(consoleErrorSpy).toHaveBeenCalledWith('No data to export.');

        const data = [
            {
                object_id: 'dlor-1',
                object_public_uuid: 'pub-1',
                object_title: 'Example Title',
                object_description: { details: 'nested object' },
                object_summary: { type: 'summary' },
                object_review_date_next: '2024-05-06T00:00:00Z',
                object_status: 'active',
                object_owning_team_id: 'team-9',
                team_name: 'Team Name',
                object_download_instructions: 'Download this file',
                object_keywords: ['Alpha', 'Beta'],
                object_link_interaction_type: { value: 'view' },
                graduate_attributes: 'Critical thinking',
                object_is_featured: 1,
                object_cultural_advice: 0,
                date: '2023-01-15T00:00:00Z',
                created_at: 'invalid-date',
                object_filters: [{ filter_key: 'subject', filter_values: [{ name: 'Math' }, { name: 'Science' }] }],
                owner: { publishing_user_username: 'u123', team_name: 'Team Name' },
            },
            {
                object_id: 'dlor-2',
                object_public_uuid: 'pub-2',
                object_title: 'Second Example',
                object_description: 'desc2',
                object_summary: 'summary2',
                object_review_date_next: '2024-05-07T00:00:00Z',
                object_status: 'draft',
                object_owning_team_id: 'team-10',
                team_name: 'Other Team',
                object_download_instructions: 'Later',
                object_keywords: ['Gamma'],
                object_link_interaction_type: 'download',
                graduate_attributes: 'Innovation',
                object_is_featured: 0,
                object_cultural_advice: 1,
                date: '2024-02-20T00:00:00Z',
                created_at: '2024-03-20T00:00:00Z',
                object_filters: [{ filter_key: 'topic', filter_values: [{ name: 'History' }] }],
                owner: { publishing_user_username: 'u999', team_name: 'Other Team' },
            },
        ];

        exportDLORDataToCSV(data, 'dlor.csv');

        exportDLORDataToCSV(
            [{
                object_id: 'dlor-3',
                object_title: null,
                object_description: undefined,
                object_filters: [{ filter_key: 'topic', filter_values: [{ name: 'History' }] }],
                owner: {},
            }],
            'dlor-null.csv',
        );

        expect(urlSpy).toHaveBeenCalledTimes(2);
        expect(revokeSpy).toHaveBeenCalledTimes(2);
        expect(appendChildSpy).toHaveBeenCalledTimes(2);
        const link = appendChildSpy.mock.calls[0][0];
        expect(link.getAttribute('download')).toBe('dlor.csv');
        expect(link.getAttribute('data-testid')).toBe('download-link');
    });
});

import * as Helpers from './promoPanelHelpers';
import * as MockData from 'data/mock/data/promoPanels';
import { default as locale } from 'modules/Pages/Admin/PromoPanel/promoPanelAdmin.locale';

describe('Filter Panel List', () => {
    const UserGroupPanels = [
        {
            usergroup_group: 'TEST1',
        },
        {
            usergroup_group: 'TEST2',
        },
    ];
    const Panels = [
        {
            panel_title: 'TEST1',
            default_panels_for: [
                {
                    usergroup_group: 'GROUPX',
                },
                {
                    usergroup_group: 'GROUPY',
                },
            ],
        },
        {
            panel_title: 'TEST2',
            default_panels_for: [
                {
                    usergroup_group: 'GROUPA',
                },
                {
                    usergroup_group: 'GROUPB',
                },
            ],
        },
        {
            panel_title: 'TEST3',
            default_panels_for: [],
            panel_schedule: [
                {
                    usergroup_group: 'GROUP1',
                },
                {
                    usergroup_group: 'GROUP2',
                },
                {
                    usergroup_group: 'GROUPA',
                },
            ],
        },
    ];
    test('filters by basic group (Group List)', () => {
        const group = 'TEST2';
        const expected = [{ usergroup_group: 'TEST2' }];
        expect(Helpers.filterPanelList(UserGroupPanels, group, true)).toEqual(expected);
    });
    test('filters by group against panel (Panel List)', () => {
        const expected = [
            {
                panel_title: 'TEST2',
                default_panels_for: [
                    {
                        usergroup_group: 'GROUPA',
                    },
                    {
                        usergroup_group: 'GROUPB',
                    },
                ],
            },
            {
                panel_title: 'TEST3',
                default_panels_for: [],
                panel_schedule: [
                    {
                        usergroup_group: 'GROUP1',
                    },
                    {
                        usergroup_group: 'GROUP2',
                    },
                    {
                        usergroup_group: 'GROUPA',
                    },
                ],
            },
        ];
        expect(Helpers.filterPanelList(Panels, 'GROUPA')).toEqual(expected);
    });
    test('empty filter returns full list', () => {
        expect(Helpers.filterPanelList(Panels, '')).toEqual(Panels);
    });
});

describe('Add Schedule', () => {
    test('Can add a schedule', () => {
        const displayList = [];
        const values = {
            start: '3000-10-10T00:00:00Z',
            end: '3000-10-11T00:00:00Z',
        };
        const setConfirmationMsg = jest.fn();
        const actions = {
            updateScheduleQueuelength: jest.fn(),
        };
        const expected = [
            true,
            [{ endDate: '3000-10-11 10:00:00', groupNames: 'TESTA', startDate: '3000-10-10 10:00:00' }],
        ];
        expect(
            Helpers.addSchedule(
                displayList,
                MockData.userListPanels,
                ['TESTA'],
                values,
                setConfirmationMsg,
                locale,
                'schedule',
                actions,
            ),
        ).toEqual(expected);
    });
});

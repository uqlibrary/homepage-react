import * as Helpers from './promoPanelHelpers';
import * as MockData from 'data/mock/data/promoPanels';
import { default as locale } from 'modules/Pages/Admin/PromoPanel/promoPanelAdmin.locale';

const actions = {
    updateScheduleQueuelength: jest.fn(),
};

describe('Init Lists', () => {
    test('Initialises lists', () => {
        const setValues = jest.fn();
        const setDisplayList = jest.fn();
        const setSelectorGroupNames = jest.fn();

        const scheduledList = ['A', 'B', 'C'];
        const scheduledGroupNames = ['Group1', 'Group2'];

        const values = { Title: 'Value1', Content: 'Value2' };
        // Checking with values IS default panel
        Helpers.initLists(scheduledList, [], values, true, setValues, setDisplayList, setSelectorGroupNames);
        expect(setValues).toBeCalledWith({
            Content: 'Value2',
            Title: 'Value1',
            defaultList: ['A', 'B', 'C'],
            scheduledList: [],
        });
        Helpers.initLists([], scheduledGroupNames, values, true, setValues, setDisplayList, setSelectorGroupNames);
        expect(setValues).toBeCalledWith({
            Content: 'Value2',
            Title: 'Value1',
            defaultList: ['A', 'B', 'C'],
            scheduledList: [],
        });
        // Checking with value NOT default panel
        Helpers.initLists(scheduledList, [], values, false, setValues, setDisplayList, setSelectorGroupNames);
        expect(setValues).toBeCalledWith({
            Content: 'Value2',
            Title: 'Value1',
            defaultList: ['A', 'B', 'C'],
            scheduledList: [],
        });
    });
});
describe('Filter Panel List', () => {
    const UserGroupPanels = [
        {
            usergroup_group: 'GROUPA',
        },
        {
            usergroup_group: 'GROUPB',
        },
    ];
    const Panels = [
        {
            panel_title: 'PANEL1',
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
            panel_title: 'PANEL2',
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
            panel_title: 'PANEL3',
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
        const group = 'GROUPA';
        const expected = [{ usergroup_group: 'GROUPA' }];
        expect(Helpers.filterPanelList(UserGroupPanels, group, true)).toEqual(expected);
    });
    test('filters by group against panel (Panel List)', () => {
        const expected = [
            {
                panel_title: 'PANEL2',
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
                panel_title: 'PANEL3',
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
    test('panel list with no schedule or default return full if no group supplied', () => {
        expect(Helpers.filterPanelList([{ default_panels_for: [], panel_schedule: [] }], undefined)).toEqual([
            { default_panels_for: [], panel_schedule: [] },
        ]);
    });
    test('not found group list returns full panel list', () => {
        expect(Helpers.filterPanelList([{ default_panels_for: [], panel_schedule: [] }], ['NONE'])).toEqual([
            { default_panels_for: [], panel_schedule: [] },
        ]);
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
                { validate: false },
                actions,
            ),
        ).toEqual(expected);
        expect(actions.updateScheduleQueuelength).toBeCalledWith(1);
    });
    test('Can detect a conflict - Before Date.', () => {
        const displayList = [
            {
                groupNames: 'testing',
            },
        ];
        const values = {
            start: '2090-12-15 00:00:00',
            end: '2090-12-16 00:00:00',
        };
        const setConfirmationMsg = jest.fn();
        const actions = {
            updateScheduleQueuelength: jest.fn(),
        };
        const expected = [false, [...displayList]];
        expect(
            Helpers.addSchedule(
                displayList,
                MockData.userListPanels,
                ['student'],
                values,
                setConfirmationMsg,
                locale,
                { validate: true },
                actions,
            ),
        ).toEqual(expected);
        expect(setConfirmationMsg).toBeCalled();
    });
    test('Can detect a conflict - After Date.', () => {
        const displayList = [];
        const values = {
            start: '2090-12-11 00:00:00',
            end: '2090-12-16 00:00:00',
        };
        const setConfirmationMsg = jest.fn();
        const actions = {
            updateScheduleQueuelength: jest.fn(),
        };
        const expected = [false, []];
        expect(
            Helpers.addSchedule(
                displayList,
                MockData.userListPanels,
                ['student'],
                values,
                setConfirmationMsg,
                locale,
                { validate: true },
                actions,
            ),
        ).toEqual(expected);
        expect(setConfirmationMsg).toBeCalled();
    });
    test('Can detect a duplicate - Prior to save values.', () => {
        const displayList = [
            {
                groupNames: 'student',
                startDate: '2010-12-11 00:00:00',
                endDate: '2010-12-16 00:00:00',
            },
        ];
        const values = {
            start: '2010-12-11 00:00:00',
            end: '2010-12-16 00:00:00',
        };
        const setConfirmationMsg = jest.fn();
        const actions = {
            updateScheduleQueuelength: jest.fn(),
        };
        const expected = [true, [...displayList]];
        expect(
            Helpers.addSchedule(
                displayList,
                MockData.userListPanels,
                ['student'],
                values,
                setConfirmationMsg,
                locale,
                { validate: true },
                actions,
            ),
        ).toEqual(expected);
    });

    test('Can add default panel', () => {
        const displayList = [
            {
                endDate: null,
                startDate: null,
                groupNames: 'testing',
            },
        ];
        const values = {
            is_default_panel: true,
        };
        const setConfirmationMsg = jest.fn();
        const actions = {
            updateScheduleQueuelength: jest.fn(),
        };
        const expected = [
            true,
            [
                {
                    endDate: null,
                    groupNames: 'testing',
                    startDate: null,
                },
                {
                    endDate: null,
                    groupNames: 'student',
                    startDate: null,
                },
            ],
        ];
        expect(
            Helpers.addSchedule(
                displayList,
                MockData.userListPanels,
                ['student'],
                values,
                setConfirmationMsg,
                locale,
                { validate: true },
                actions,
            ),
        ).toEqual(expected);
    });
    test('will not add default panel if one exists', () => {
        const displayList = [
            {
                endDate: null,
                startDate: null,
                groupNames: 'student',
                dateChanged: true,
            },
        ];
        const values = {
            is_default_panel: true,
        };
        const setConfirmationMsg = jest.fn();
        const actions = {
            updateScheduleQueuelength: jest.fn(),
        };
        const expected = [
            true,
            [
                {
                    dateChanged: true,
                    endDate: null,
                    groupNames: 'student',
                    startDate: null,
                },
            ],
        ];
        expect(
            Helpers.addSchedule(
                displayList,
                MockData.userListPanels,
                ['student'],
                values,
                setConfirmationMsg,
                locale,
                { validate: true },
                actions,
            ),
        ).toEqual(expected);
    });
});
describe('Save group date', () => {
    test('Can save a group date', () => {
        const setDisplayList = jest.fn();
        const setIsEditingDate = jest.fn();
        const displayList = [{ startDate: '2000-01-01 00:00:00', endDate: '2000-01-01 00:00:00', dateChanged: false }];
        Helpers.saveGroupDate(
            0,
            {
                start: '2090-12-15 00:00:00',
                end: '2090-12-16 00:00:00',
            },
            displayList,
            setDisplayList,
            setIsEditingDate,
            actions,
        );
        const expected = [{ dateChanged: true, endDate: '2090-12-16 00:00:00', startDate: '2090-12-15 00:00:00' }];
        expect(setDisplayList).toBeCalledWith(expected);
        expect(setIsEditingDate).toBeCalledWith(false);
    });
});

describe('Remamp Schedule List', () => {
    test('Will not return anything if not relevant to panel', () => {
        const setIsDefault = jest.fn();
        const scheduleList = [
            {
                panel_id: 10,
            },
        ];

        expect(Helpers.remapScheduleList(scheduleList, 5, setIsDefault)).toEqual([[], []]);
    });
    test('Will return mapped data for panel if group found for panel id (defaults)', () => {
        const setIsDefault = jest.fn();
        const scheduleList = [
            {
                panel_id: 10,
                default_panels_for: [
                    {
                        usergroup_group: 'student',
                    },
                ],
            },
        ];

        expect(Helpers.remapScheduleList(scheduleList, 10, setIsDefault)).toEqual([
            ['student'],
            [
                {
                    dateChanged: false,
                    endDate: null,
                    existing: true,
                    groupNames: 'student',
                    startDate: null,
                },
            ],
        ]);
    });
    test('Will return mapped data for panel if group found for panel id (schedules)', () => {
        const setIsDefault = jest.fn();
        const scheduleList = [
            {
                panel_id: 10,
                default_panels_for: [],
                panel_schedule: [
                    {
                        usergroup_group: 'student',
                        user_group_schedule: [
                            {
                                panel_schedule_id: 1,
                                panel_schedule_start_time: '2090-12-15 00:00:00',
                                panel_schedule_end_time: '2090-12-16 00:00:00',
                            },
                        ],
                    },
                ],
            },
        ];

        expect(Helpers.remapScheduleList(scheduleList, 10, setIsDefault)).toEqual([
            ['student'],
            [
                {
                    id: 1,
                    dateChanged: false,
                    endDate: '2090-12-16 00:00:00',
                    existing: true,
                    groupNames: 'student',
                    startDate: '2090-12-15 00:00:00',
                },
            ],
        ]);
    });
});

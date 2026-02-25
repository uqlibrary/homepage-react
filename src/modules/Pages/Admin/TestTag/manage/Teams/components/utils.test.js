import { transformRow, transformUpdateRequest, transformAddRequest, actionReducer } from './utils';

describe('utils', () => {
    it('transforms rows correctly', () => {
        const inputRow = [
            {
                team_slug: 'team-a',
                team_display_name: 'Team A',
                team_current_flag: 0,
            },
            {
                team_slug: 'team-b',
                team_display_name: 'Team B',
                team_current_flag: 1,
            },
        ];

        const expectedOutput = [
            {
                team_slug: 'team-a',
                team_display_name: 'Team A',
                team_current_flag_cb: false,
                team_current_flag: 'No',
            },
            {
                team_slug: 'team-b',
                team_display_name: 'Team B',
                team_current_flag_cb: true,
                team_current_flag: 'Yes',
            },
        ];

        const transformedRows = transformRow(inputRow);
        expect(transformedRows).toEqual(expectedOutput);
    });

    it('transforms Add request correctly', () => {
        const inputRequest = {
            team_slug: 'team-a',
            team_display_name: 'Team A',
            team_current_flag_cb: true,
        };

        const expectedOutput = {
            team_slug: 'team-a',
            team_display_name: 'Team A',
            team_current_flag: 1,
        };

        const transformedRequest = transformAddRequest(inputRequest);
        expect(transformedRequest).toEqual(expectedOutput);

        // Test with team_current_flag_cb = false
        const inputRequest2 = {
            team_slug: 'team-b',
            team_display_name: 'Team B',
            team_current_flag_cb: false,
        };

        const expectedOutput2 = {
            team_slug: 'team-b',
            team_display_name: 'Team B',
            team_current_flag: 0,
        };

        const transformedRequest2 = transformAddRequest(inputRequest2);
        expect(transformedRequest2).toEqual(expectedOutput2);
    });

    it('transforms update request correctly', () => {
        const inputRequest = {
            users_count: 5,
            team_slug: 'team-a',
            team_display_name: 'Team A',
            team_current_flag_cb: true,
        };

        const expectedOutput = {
            team_display_name: 'Team A',
            team_current_flag: 1,
        };

        const transformedRequest = transformUpdateRequest(inputRequest);
        expect(transformedRequest).toEqual(expectedOutput);

        // Test with team_current_flag_cb = false
        const inputRequest2 = {
            users_count: 3,
            team_slug: 'team-b',
            team_display_name: 'Team B',
            team_current_flag_cb: false,
        };

        const expectedOutput2 = {
            team_display_name: 'Team B',
            team_current_flag: 0,
        };

        const transformedRequest2 = transformUpdateRequest(inputRequest2);
        expect(transformedRequest2).toEqual(expectedOutput2);
    });

    const emptyActionState = {
        isAdd: false,
        isEdit: false,
        isDelete: false,
        title: '',
        row: {},
    };

    it('handles add, edit, delete, clear action correctly', () => {
        // add
        const addAction = {
            type: 'add',
            title: 'Add Team',
        };

        const expectedAddOutput = {
            isAdd: true,
            isEdit: false,
            isDelete: false,
            title: 'Add Team',
            row: {
                team_slug: '',
                team_display_name: '',
                team_current_flag_cb: true,
            },
            props: {},
        };

        const reducedState = actionReducer(emptyActionState, addAction);
        expect(reducedState).toEqual(expectedAddOutput);

        // edit
        const editAction = {
            type: 'edit',
            title: 'Edit Team',
            row: { team_slug: 'team-a', team_display_name: 'Team A' },
        };

        const expectedEditOutput = {
            isAdd: false,
            isEdit: true,
            isDelete: false,
            title: 'Edit Team',
            row: { team_slug: 'team-a', team_display_name: 'Team A', id: 'team-a' },
            props: {},
        };

        const editState = actionReducer(emptyActionState, editAction);
        expect(editState).toEqual(expectedEditOutput);

        // delete
        const deleteAction = {
            type: 'delete',
            title: 'Delete Team',
            row: { team_slug: 'team-a', team_display_name: 'Team A' },
        };

        const expectedDeleteOutput = {
            isAdd: false,
            isEdit: false,
            isDelete: true,
            title: 'Delete Team',
            row: { team_slug: 'team-a', team_display_name: 'Team A' },
            props: {},
        };

        expect(actionReducer(emptyActionState, deleteAction)).toEqual(expectedDeleteOutput);

        // clear
        const clearAction = { type: 'clear' };
        expect(actionReducer(emptyActionState, clearAction)).toEqual(emptyActionState);
    });

    it('handles unknown action correctly', () => {
        const unknownAction = {
            type: 'unknown',
            title: 'Unknown Action',
        };

        expect(() => actionReducer(emptyActionState, unknownAction)).toThrow("Unknown action 'unknown'");
    });
});

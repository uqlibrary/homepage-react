import { transformRow, transformUpdateRequest, transformAddRequest, actionReducer } from './utils';

describe('utils', () => {
    it('transforms rows correctly', () => {
        const inputRow = [
            {
                privileges: {
                    can_admin: 1,
                    can_inspect: 0,
                    can_alter: 1,
                    can_see_reports: 1,
                },
                user_current_flag: 0,
            },
            {
                privileges: {
                    can_admin: 0,
                    can_inspect: 1,
                    can_alter: 0,
                    can_see_reports: 0,
                },
                user_current_flag: 1,
            },
        ];

        const expectedOutput = [
            {
                privileges: {
                    can_admin: 1,
                    can_inspect: 0,
                    can_alter: 1,
                    can_see_reports: 1,
                },
                can_admin_cb: true,
                can_inspect_cb: false,
                can_alter_cb: true,
                can_see_reports_cb: true,
                user_current_flag_cb: false,
                can_admin: 'Yes',
                can_inspect: 'No',
                can_alter: 'Yes',
                can_see_reports: 'Yes',
                user_current_flag: 'No',
            },
            {
                privileges: {
                    can_admin: 0,
                    can_inspect: 1,
                    can_alter: 0,
                    can_see_reports: 0,
                },
                user_current_flag: 'Yes',
                can_admin_cb: false,
                can_inspect_cb: true,
                can_alter_cb: false,
                can_see_reports_cb: false,
                user_current_flag_cb: true,
                can_admin: 'No',
                can_inspect: 'Yes',
                can_alter: 'No',
                can_see_reports: 'No',
            },
        ];

        const transformedRows = transformRow(inputRow);
        expect(transformedRows).toEqual(expectedOutput);
    });
    it('transforms Add request correctly', () => {
        const inputRequest = {
            actions_count: 5,
            id: 123,
            department_display_name: 'Department A',
            privileges: {
                can_admin_cb: true,
                can_inspect_cb: false,
                can_alter_cb: true,
                can_see_reports_cb: false,
            },
            user_current_flag_cb: true,
            can_admin: 'Yes',
            can_inspect: 'No',
            can_alter: 'Yes',
            can_see_reports: 'No',
        };

        const expectedOutput = {
            department_display_name: 'Department A',
            id: 123,
            privileges: {
                can_admin: 0,
                can_inspect: 0,
                can_alter: 0,
                can_see_reports: 0,
            },
            user_current_flag: 1,
            user_department: 'UQL',
            user_licence_number: '',
        };

        const transformedRequest = transformAddRequest(inputRequest, 'UQL');
        expect(transformedRequest).toEqual(expectedOutput);

        inputRequest.can_admin_cb = true;
        inputRequest.can_inspect_cb = true;
        inputRequest.can_alter_cb = true;
        inputRequest.can_see_reports_cb = true;

        expectedOutput.privileges = {
            can_admin: 1,
            can_inspect: 1,
            can_alter: 1,
            can_see_reports: 1,
        };
        expectedOutput.user_current_flag = 0;
        expectedOutput.user_department = 'PF';
        const transformedRequest2 = transformAddRequest(inputRequest, 'PF');
        expect(transformedRequest2).toEqual(expectedOutput);
    });
    it('transforms update request correctly', () => {
        const inputRequest = {
            actions_count: 5,
            id: 123,
            department_display_name: 'Department A',
            privileges: {
                can_admin_cb: true,
                can_inspect_cb: false,
                can_alter_cb: true,
                can_see_reports_cb: false,
            },
            user_current_flag_cb: true,
            can_admin: 'Yes',
            can_inspect: 'No',
            can_alter: 'Yes',
            can_see_reports: 'No',
        };

        const expectedOutput = {
            privileges: {
                can_admin: 0,
                can_inspect: 0,
                can_alter: 0,
                can_see_reports: 0,
                can_admin_cb: true,
                can_alter_cb: true,
                can_inspect_cb: false,
                can_see_reports_cb: false,
            },
            user_current_flag: 1,
        };

        const transformedRequest = transformUpdateRequest(inputRequest);
        expect(transformedRequest).toEqual(expectedOutput);

        inputRequest.can_admin_cb = true;
        inputRequest.can_inspect_cb = true;
        inputRequest.can_alter_cb = true;
        inputRequest.can_see_reports_cb = true;

        expectedOutput.privileges = {
            can_admin: 1,
            can_inspect: 1,
            can_alter: 1,
            can_see_reports: 1,
            can_admin_cb: true,
            can_alter_cb: true,
            can_inspect_cb: false,
            can_see_reports_cb: false,
        };
        expectedOutput.user_current_flag = 0;

        const transformedRequest2 = transformUpdateRequest(inputRequest);
        expect(transformedRequest2).toEqual(expectedOutput);
    });

    const emptyActionState = {
        isAdd: false,
        isEdit: false,
        isDelete: false,
        title: '',
        row: {},
        props: {},
    };

    it('handles add, edit, delete, clear action correctly', () => {
        const addAction = {
            type: 'add',
            user_id: 'Auto',
            user_uid: '',
            user_name: '',
            user_current_flag_cb: true,
            user_licence_number: '',
        };

        const expectedOutput = {
            isAdd: true,
            isEdit: false,
            isDelete: false,
            row: {
                user_id: 'Auto',
                user_uid: '',
                user_name: '',
                user_current_flag_cb: true,
                user_licence_number: '',
            },
            props: {
                user_current_flag_cb: true,
                user_id: 'Auto',
                user_licence_number: '',
                user_name: '',
                user_uid: '',
            },
        };
        // add
        const reducedState = actionReducer(emptyActionState, addAction);
        expect(reducedState).toEqual(expectedOutput);
        // edit
        addAction.type = 'edit';
        addAction.row = { user_id: 1 };
        addAction.title = 'edit test';
        expectedOutput.isAdd = false;
        expectedOutput.isEdit = true;
        expectedOutput.row = { id: 1, user_id: 1 };
        expectedOutput.title = 'edit test';
        const editState = actionReducer(emptyActionState, addAction);
        expect(editState).toEqual(expectedOutput);
        // delete
        addAction.type = 'delete';
        expectedOutput.isDelete = true;
        expectedOutput.isEdit = false;
        expectedOutput.row = { user_id: 1 };
        expect(actionReducer(emptyActionState, addAction)).toEqual(expectedOutput);
        // clear
        addAction.type = 'clear';
        delete emptyActionState.props;
        expect(actionReducer(emptyActionState, addAction)).toEqual(emptyActionState);
    });

    it('handles unknown action correctly', () => {
        const unknownAction = {
            type: 'unknown',
            title: 'Unknown Action',
            additionalProp: 'Additional',
        };

        expect(() => actionReducer(emptyActionState, unknownAction)).toThrow("Unknown action 'unknown'");
    });
});

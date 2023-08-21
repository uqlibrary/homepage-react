import React from 'react';
import Users from './Users';
import { renderWithRouter, act, fireEvent, waitFor, WithReduxStore } from 'test-utils';
import Immutable from 'immutable';

import { getUserPermissions } from '../../../helpers/auth';
import locale from '../../../testTag.locale';

const actions = {
    clearUserListError: jest.fn(),
    loadUserList: jest.fn(() => Promise.resolve()),
    addUser: jest.fn(() => Promise.resolve()),
    updateUser: jest.fn(() => Promise.resolve()),
    deleteUser: jest.fn(() => Promise.resolve()),
};

const userList = [
    {
        department_display_name: 'Library',
        user_current_flag: 1,
        user_department: 'UQL',
        user_id: 1,
        user_licence_number: 'NOT LICENSED',
        user_name: 'WSS Staff who can eg change locations but not inspect',
        user_uid: 'uqjsmit',
        privileges: {
            can_admin: 0,
            can_inspect: 0,
            can_alter: 1,
            can_see_reports: 0,
        },
    },
    {
        department_display_name: 'Library',
        user_current_flag: 1,
        user_department: 'UQL',
        user_id: 2,
        user_licence_number: '234567',
        user_name: 'JTest user',
        user_uid: 'uqtest1',
        privileges: {
            can_admin: 0,
            can_inspect: 1,
            can_alter: 1,
            can_see_reports: 1,
        },
        actions_count: 8,
    },
    {
        department_display_name: 'Library',
        user_current_flag: 1,
        user_department: 'UQL',
        user_id: 4,
        user_licence_number: 'NOT LICENSED',
        user_name: 'Reporting User',
        user_uid: 'uqmanager',
        privileges: {
            can_admin: 0,
            can_inspect: 0,
            can_alter: 0,
            can_see_reports: 1,
        },
        actions_count: 0,
    },
    {
        department_display_name: 'Library',
        user_current_flag: 1,
        user_department: 'UQL',
        user_id: 5,
        user_licence_number: '45678',
        user_name: 'SecondTesting user',
        user_uid: 'uqtest2',
        privileges: {
            can_admin: 1,
            can_inspect: 1,
            can_alter: 1,
            can_see_reports: 1,
        },
        actions_count: 0,
    },
];

const theUser = userList[3];
function setup(testProps = {}, renderer = renderWithRouter) {
    const { state = {}, actions = {}, ...props } = testProps;
    const _state = {
        testTagUserReducer: {
            userLoading: false,
            userLoaded: true,
            userError: false,
            user: theUser,
            privilege: getUserPermissions(theUser.privileges ?? {}),
        },
        ...state,
    };
    return renderer(
        <WithReduxStore initialState={Immutable.Map(_state)}>
            <Users
                id="test"
                actions={actions}
                userListLoading={false}
                userList={userList}
                userListError={null}
                {...props}
            />
        </WithReduxStore>,
    );
}

const selectOptionFromListByIndex = (index, actions) => {
    expect(actions.getByRole('listbox')).not.toEqual(null);
    act(() => {
        const options = actions.getAllByRole('option');

        fireEvent.mouseDown(options[index]);
        options[index].click();
    });
};

describe('Manage Users', () => {
    it('renders component standard', () => {
        const { getByText } = setup({ actions: actions });
        expect(getByText(locale.pages.manage.users.header.pageSubtitle('Library'))).toBeInTheDocument();
        expect(getByText('uqjsmit')).toBeInTheDocument();
    });
    it('catches error on LoadUserList', async () => {
        actions.loadUserList = jest.fn(() => {
            return Promise.reject('Testing Error');
        });

        const { getByText } = setup({ actions: actions });
        await waitFor(() => {
            expect(getByText(locale.pages.manage.users.header.pageSubtitle('Library'))).toBeInTheDocument();
        });
        expect(actions.loadUserList).rejects.toEqual('Testing Error');
    });

    it('Add User functions correctly', async () => {
        actions.loadUserList = jest.fn(() => {
            return Promise.resolve();
        });
        const { getByText, getByTestId } = setup({ actions: actions });

        expect(getByText(locale.pages.manage.users.header.pageSubtitle('Library'))).toBeInTheDocument();
        expect(getByText('uqjsmit')).toBeInTheDocument();
        expect(getByTestId('add_toolbar-user-management-add-button')).toBeInTheDocument();
        await act(async () => {
            await fireEvent.click(getByTestId('add_toolbar-user-management-add-button'));
        });

        await waitFor(() => {
            expect(getByTestId('user_uid-input')).toBeInTheDocument();
        });
        await act(async () => {
            await fireEvent.change(getByTestId('user_uid-input'), { target: { value: 'uqtestuser' } });
            await fireEvent.change(getByTestId('user_name-input'), { target: { value: 'TEST USER' } });
        });
        // Check the disabled fields
        expect(getByTestId('user_licence_number-input')).toHaveAttribute('disabled');
        await act(async () => {
            await fireEvent.click(getByTestId('can_inspect_cb-input'));
            expect(getByTestId('user_licence_number-input')).toHaveAttribute('required');
            await fireEvent.change(getByTestId('user_licence_number-input'), { target: { value: 'TEST LIC' } });
        });
        // commit the change
        const expected = {
            privileges: {
                can_admin: 0,
                can_alter: 0,
                can_inspect: 1,
                can_see_reports: 0,
            },
            user_current_flag: 1,
            user_department: 'UQL',
            user_licence_number: 'TEST LIC',
            user_name: 'TEST USER',
            user_uid: 'uqtestuser',
        };
        await act(async () => {
            await fireEvent.click(getByTestId('update_dialog-action-button'));
            expect(actions.addUser).toHaveBeenCalledWith(expected);
        });

        // Check error condition for add
        actions.addUser = jest.fn(() => Promise.reject('Test Error'));
        await act(async () => {
            await fireEvent.click(getByTestId('add_toolbar-user-management-add-button'));
        });

        await waitFor(() => {
            expect(getByTestId('user_uid-input')).toBeInTheDocument();
        });
        await act(async () => {
            await fireEvent.change(getByTestId('user_uid-input'), { target: { value: 'uqtestuser' } });
            await fireEvent.change(getByTestId('user_name-input'), { target: { value: 'TEST USER' } });
        });

        await act(async () => {
            await fireEvent.click(getByTestId('update_dialog-action-button'));
            expect(actions.addUser).rejects.toEqual('Test Error');
        });
    });
    it('Edit User functions correctly', async () => {
        const { getByText, getByTestId } = setup({ actions: actions });
        expect(getByText(locale.pages.manage.users.header.pageSubtitle('Library'))).toBeInTheDocument();
        expect(getByText('uqjsmit')).toBeInTheDocument();
        await act(async () => {
            await fireEvent.click(getByTestId('action_cell-1-edit-button'));
        });
        await waitFor(() => {
            expect(getByTestId('user_uid-input')).toBeInTheDocument();
        });
        await act(async () => {
            await fireEvent.change(getByTestId('user_uid-input'), { target: { value: 'uqtestuser' } });
            await fireEvent.change(getByTestId('user_name-input'), { target: { value: 'TEST USER' } });
        });
        // // commit the change
        await act(async () => {
            await fireEvent.click(getByTestId('update_dialog-action-button'));
        });
        expect(actions.updateUser).toHaveBeenCalledWith(1, {
            isSelf: false,
            privileges: {
                can_admin: 0,
                can_alter: 1,
                can_inspect: 0,
                can_see_reports: 0,
            },
            user_current_flag: 1,
            user_department: 'UQL',
            user_id: 1,
            user_licence_number: 'NOT LICENSED',
            user_name: 'TEST USER',
            user_uid: 'uqtestuser',
        });
        // Check Save User fail on save.
        actions.updateUser = jest.fn(() => Promise.reject('Test Error'));
        await act(async () => {
            await fireEvent.click(getByTestId('action_cell-1-edit-button'));
        });
        await act(async () => {
            await fireEvent.click(getByTestId('update_dialog-action-button'));
        });
        expect(actions.updateUser).rejects.toEqual('Test Error');
    });

    it('Delete or Reassign Asset Type functions correctly', async () => {
        const { getByText, getByTestId } = setup({ actions: actions });
        expect(getByText(locale.pages.manage.users.header.pageSubtitle('Library'))).toBeInTheDocument();
        expect(getByText('uqjsmit')).toBeInTheDocument();

        await act(async () => {
            await fireEvent.click(getByTestId('action_cell-1-delete-button'));
        });
        await waitFor(() => {
            expect(getByTestId('confirm-user-management')).toBeInTheDocument();
            fireEvent.click(getByTestId('confirm-user-management'));
        });
        expect(actions.deleteUser).toHaveBeenCalledWith(1);
        // Simulate an error
        actions.deleteUser = jest.fn(() => Promise.reject('Test Error'));
        await act(async () => {
            await fireEvent.click(getByTestId('action_cell-1-delete-button'));
        });
        await waitFor(() => {
            expect(getByTestId('confirm-user-management')).toBeInTheDocument();
            fireEvent.click(getByTestId('confirm-user-management'));
        });
        expect(actions.deleteUser).rejects.toEqual('Test Error');
        //     // simulate successful delete, load error.
        //     actions.deleteAssetType = jest.fn(() => Promise.resolve());
        //     actions.loadAssetTypes = jest.fn(() => Promise.reject('ATD ERROR TEST'));
        //     await act(async () => {
        //         await fireEvent.click(getByTestId('action_cell-1-delete-button'));
        //     });
        //     await waitFor(() => {
        //         expect(getByTestId('confirm-asset-types')).toBeInTheDocument();
        //         fireEvent.click(getByTestId('confirm-asset-types'));
        //     });
        //     expect(actions.loadAssetTypes).rejects.toEqual('ATD ERROR TEST');
        //     // Delete and Reassign
        //     actions.loadAssetTypes = jest.fn(() => Promise.resolve());
        //     await act(async () => {
        //         await fireEvent.click(getByTestId('action_cell-2-delete-button'));
        //         act(() => {
        //             fireEvent.mouseDown(getByTestId('action_dialogue-asset-types-reassign-select'));
        //         });
        //     });
        //     selectOptionFromListByIndex(0, { getByRole, getAllByRole });
        //     await act(async () => {
        //         fireEvent.click(getByTestId('action_dialogue-asset-types-action-button'));
        //     });
        //     expect(actions.deleteAndReassignAssetType).toHaveBeenCalledWith({ new_asset_type_id: 1, old_asset_type_id: 2 });
        //     // Simulate a reassign error
        //     actions.deleteAndReassignAssetType = jest.fn(() => Promise.reject('DAR ERROR TEST'));
        //     await act(async () => {
        //         await fireEvent.click(getByTestId('action_cell-2-delete-button'));
        //         act(() => {
        //             fireEvent.mouseDown(getByTestId('action_dialogue-asset-types-reassign-select'));
        //         });
        //     });
        //     selectOptionFromListByIndex(0, { getByRole, getAllByRole });
        //     await act(async () => {
        //         fireEvent.click(getByTestId('action_dialogue-asset-types-action-button'));
        //     });
        //     expect(actions.deleteAndReassignAssetType).rejects.toEqual('DAR ERROR TEST');
        //     // Simulate a reassign success, load error
        //     actions.deleteAndReassignAssetType = jest.fn(() => Promise.resolve());
        //     actions.loadAssetTypes = jest.fn(() => Promise.reject('DAR LOAD ERROR TEST'));
        //     await act(async () => {
        //         await fireEvent.click(getByTestId('action_cell-2-delete-button'));
        //         act(() => {
        //             fireEvent.mouseDown(getByTestId('action_dialogue-asset-types-reassign-select'));
        //         });
        //     });
        //     selectOptionFromListByIndex(0, { getByRole, getAllByRole });
        //     await act(async () => {
        //         fireEvent.click(getByTestId('action_dialogue-asset-types-action-button'));
        //     });
        //     expect(actions.loadAssetTypes).rejects.toEqual('DAR LOAD ERROR TEST');
    });
});

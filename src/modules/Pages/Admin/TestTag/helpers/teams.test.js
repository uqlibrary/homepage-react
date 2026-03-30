import { renderHook, act } from '@testing-library/react';
import { useUserDepartmentTeamList, useCurrentUserDepartmentTeamList, useUserTeams } from './teams';
import * as hooks from './hooks';

jest.mock('./hooks', () => ({
    useAccountUser: jest.fn(),
}));

jest.mock('../SharedComponents/DataTable/Filter/SelectField', () => ({
    createFilter: jest.fn((field, ids) => ({
        columnField: field,
        operatorValue: 'isAnyOf',
        operator: 'isAnyOf',
        value: ids.map(v => String(v)),
    })),
}));

const mockUser = {
    user_team: 'team-alpha',
    department_teams: [
        { id: 1, team_slug: 'team-alpha', team_display_name: 'Team Alpha' },
        { id: 2, team_slug: 'team-beta', team_display_name: 'Team Beta' },
        { id: 3, team_slug: 'team-gamma', team_display_name: 'Team Gamma' },
    ],
};

describe('teams', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('useUserDepartmentTeamList', () => {
        it('should return team list with "All teams" option by default', () => {
            const { result } = renderHook(() => useUserDepartmentTeamList(mockUser));

            expect(result.current).toEqual([
                { id: -1, label: 'All teams' },
                { id: 1, team_slug: 'team-alpha', label: 'Team Alpha' },
                { id: 2, team_slug: 'team-beta', label: 'Team Beta' },
                { id: 3, team_slug: 'team-gamma', label: 'Team Gamma' },
            ]);
        });

        it('should return team list without "All teams" when allOption is false', () => {
            const { result } = renderHook(() => useUserDepartmentTeamList(mockUser, false));

            expect(result.current).toEqual([
                { id: 1, team_slug: 'team-alpha', label: 'Team Alpha' },
                { id: 2, team_slug: 'team-beta', label: 'Team Beta' },
                { id: 3, team_slug: 'team-gamma', label: 'Team Gamma' },
            ]);
        });

        it('should return only "All teams" when user is null', () => {
            const { result } = renderHook(() => useUserDepartmentTeamList(null));

            expect(result.current).toEqual([{ id: -1, label: 'All teams' }]);
        });

        it('should return empty list when user is null and allOption is false', () => {
            const { result } = renderHook(() => useUserDepartmentTeamList(null, false));

            expect(result.current).toEqual([]);
        });

        it('should return only "All teams" when user has no department_teams', () => {
            const { result } = renderHook(() => useUserDepartmentTeamList({}));

            expect(result.current).toEqual([{ id: -1, label: 'All teams' }]);
        });
    });

    describe('useCurrentUserDepartmentTeamList', () => {
        it('should return team list for the current account user', () => {
            hooks.useAccountUser.mockReturnValue({ user: mockUser });

            const { result } = renderHook(() => useCurrentUserDepartmentTeamList());

            expect(result.current).toEqual([
                { id: -1, label: 'All teams' },
                { id: 1, team_slug: 'team-alpha', label: 'Team Alpha' },
                { id: 2, team_slug: 'team-beta', label: 'Team Beta' },
                { id: 3, team_slug: 'team-gamma', label: 'Team Gamma' },
            ]);
        });

        it('should pass allOption false to useUserDepartmentTeamList', () => {
            hooks.useAccountUser.mockReturnValue({ user: mockUser });

            const { result } = renderHook(() => useCurrentUserDepartmentTeamList(false));

            expect(result.current).toEqual([
                { id: 1, team_slug: 'team-alpha', label: 'Team Alpha' },
                { id: 2, team_slug: 'team-beta', label: 'Team Beta' },
                { id: 3, team_slug: 'team-gamma', label: 'Team Gamma' },
            ]);
        });
    });

    describe('useUserTeams', () => {
        it('should return team data with default selected team', () => {
            const { result } = renderHook(() => useUserTeams(mockUser));

            expect(result.current.userTeamList).toEqual([
                { id: -1, label: 'All teams' },
                { id: 1, team_slug: 'team-alpha', label: 'Team Alpha' },
                { id: 2, team_slug: 'team-beta', label: 'Team Beta' },
                { id: 3, team_slug: 'team-gamma', label: 'Team Gamma' },
            ]);
            expect(result.current.defaultTeamId).toBe(1);
            expect(result.current.teamSelectFieldName).toBe('team_display_name');
            expect(result.current.selectedTeam).toEqual({
                items: [
                    {
                        columnField: 'team_display_name',
                        operatorValue: 'isAnyOf',
                        operator: 'isAnyOf',
                        value: ['1'],
                    },
                ],
            });
            expect(result.current.selectedTeamSlug).toBe('team-alpha');
        });

        it('should return empty selection when setDefaultTeam is false', () => {
            const { result } = renderHook(() => useUserTeams(mockUser, 'team_display_name', false));

            expect(result.current.selectedTeam).toEqual({ items: [] });
            expect(result.current.selectedTeamSlug).toBe('');
        });

        it('should use custom teamSelectFieldName', () => {
            const { result } = renderHook(() => useUserTeams(mockUser, 'custom_field'));

            expect(result.current.teamSelectFieldName).toBe('custom_field');
            expect(result.current.selectedTeam.items[0].columnField).toBe('custom_field');
        });

        it('should update selected team via setSelectedTeam', () => {
            const { result } = renderHook(() => useUserTeams(mockUser));

            act(() => {
                result.current.setSelectedTeam({
                    items: [
                        {
                            columnField: 'team_display_name',
                            operatorValue: 'isAnyOf',
                            operator: 'isAnyOf',
                            value: ['2'],
                        },
                    ],
                });
            });

            expect(result.current.selectedTeamSlug).toBe('team-beta');
        });

        it('should return empty slug when selection is cleared', () => {
            const { result } = renderHook(() => useUserTeams(mockUser));

            act(() => {
                result.current.setSelectedTeam({ items: [] });
            });

            expect(result.current.selectedTeamSlug).toBe('');
        });

        it('should provide createDefaultSelectedTeam function', () => {
            const { result } = renderHook(() => useUserTeams(mockUser));

            const creator = result.current.createDefaultSelectedTeam('some_field', 99);
            expect(typeof creator).toBe('function');

            const selected = creator();
            expect(selected).toEqual({
                items: [
                    {
                        columnField: 'some_field',
                        operatorValue: 'isAnyOf',
                        operator: 'isAnyOf',
                        value: ['99'],
                    },
                ],
            });
        });
    });
});

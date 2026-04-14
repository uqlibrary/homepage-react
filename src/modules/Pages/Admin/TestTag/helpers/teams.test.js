import { renderHook, act } from '@testing-library/react';
import { useUserDepartmentTeamList, useCurrentUserDepartmentTeamList, useUserTeams } from './teams';
import * as hooks from './hooks';

jest.mock('./hooks', () => ({
    useAccountUser: jest.fn(),
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
                { value: -1, label: 'All teams' },
                { value: 1, team_slug: 'team-alpha', label: 'Team Alpha' },
                { value: 2, team_slug: 'team-beta', label: 'Team Beta' },
                { value: 3, team_slug: 'team-gamma', label: 'Team Gamma' },
            ]);
        });

        it('should return team list without "All teams" when allOption is false', () => {
            const { result } = renderHook(() => useUserDepartmentTeamList(mockUser, false));

            expect(result.current).toEqual([
                { value: 1, team_slug: 'team-alpha', label: 'Team Alpha' },
                { value: 2, team_slug: 'team-beta', label: 'Team Beta' },
                { value: 3, team_slug: 'team-gamma', label: 'Team Gamma' },
            ]);
        });

        it('should return only "All teams" when user is null', () => {
            const { result } = renderHook(() => useUserDepartmentTeamList(null));

            expect(result.current).toEqual([{ value: -1, label: 'All teams' }]);
        });

        it('should return empty list when user is null and allOption is false', () => {
            const { result } = renderHook(() => useUserDepartmentTeamList(null, false));

            expect(result.current).toEqual([]);
        });

        it('should return only "All teams" when user has no department_teams', () => {
            const { result } = renderHook(() => useUserDepartmentTeamList({}));

            expect(result.current).toEqual([{ value: -1, label: 'All teams' }]);
        });
    });

    describe('useCurrentUserDepartmentTeamList', () => {
        it('should return team list for the current account user', () => {
            hooks.useAccountUser.mockReturnValue({ user: mockUser });

            const { result } = renderHook(() => useCurrentUserDepartmentTeamList());

            expect(result.current).toEqual([
                { value: -1, label: 'All teams' },
                { value: 1, team_slug: 'team-alpha', label: 'Team Alpha' },
                { value: 2, team_slug: 'team-beta', label: 'Team Beta' },
                { value: 3, team_slug: 'team-gamma', label: 'Team Gamma' },
            ]);
        });

        it('should pass allOption false to useUserDepartmentTeamList', () => {
            hooks.useAccountUser.mockReturnValue({ user: mockUser });

            const { result } = renderHook(() => useCurrentUserDepartmentTeamList(false));

            expect(result.current).toEqual([
                { value: 1, team_slug: 'team-alpha', label: 'Team Alpha' },
                { value: 2, team_slug: 'team-beta', label: 'Team Beta' },
                { value: 3, team_slug: 'team-gamma', label: 'Team Gamma' },
            ]);
        });
    });

    describe('useUserTeams', () => {
        it('should use defaults when called with no arguments', () => {
            const { result } = renderHook(() => useUserTeams());

            expect(result.current.userTeamList).toEqual([{ value: -1, label: 'All teams' }]);
            expect(result.current.selectedTeam).toBe(-1);
            expect(result.current.selectedTeamSlug).toBe('');
        });

        it('should return team data with default selected team', () => {
            const { result } = renderHook(() => useUserTeams({ user: mockUser }));

            expect(result.current.userTeamList).toEqual([
                { value: -1, label: 'All teams' },
                { value: 1, team_slug: 'team-alpha', label: 'Team Alpha' },
                { value: 2, team_slug: 'team-beta', label: 'Team Beta' },
                { value: 3, team_slug: 'team-gamma', label: 'Team Gamma' },
            ]);
            expect(result.current.teamSelectFieldName).toBe('team_display_name');
            expect(result.current.selectedTeam).toBe(1);
            expect(result.current.selectedTeamSlug).toBe('team-alpha');
        });

        it('should return empty selection when setDefaultTeam is false', () => {
            const { result } = renderHook(() => useUserTeams({ user: mockUser, setDefaultTeam: false }));

            expect(result.current.selectedTeam).toBe('');
            expect(result.current.selectedTeamSlug).toBe('');
        });

        it('should use custom teamSelectFieldName', () => {
            const { result } = renderHook(() => useUserTeams({ user: mockUser, teamSelectFieldName: 'custom_field' }));

            expect(result.current.teamSelectFieldName).toBe('custom_field');
        });

        it('should pass allTeamsOption to useUserDepartmentTeamList', () => {
            const { result } = renderHook(() => useUserTeams({ user: mockUser, allTeamsOption: false }));

            expect(result.current.userTeamList).toEqual([
                { value: 1, team_slug: 'team-alpha', label: 'Team Alpha' },
                { value: 2, team_slug: 'team-beta', label: 'Team Beta' },
                { value: 3, team_slug: 'team-gamma', label: 'Team Gamma' },
            ]);
        });

        it('should update selected team via setSelectedTeam', () => {
            const { result } = renderHook(() => useUserTeams({ user: mockUser }));

            act(() => {
                result.current.setSelectedTeam(2);
            });

            expect(result.current.selectedTeam).toBe(2);
            expect(result.current.selectedTeamSlug).toBe('team-beta');
        });

        it('should return empty slug when selection is cleared', () => {
            const { result } = renderHook(() => useUserTeams({ user: mockUser }));

            act(() => {
                result.current.setSelectedTeam('');
            });

            expect(result.current.selectedTeamSlug).toBe('');
        });

        describe('getTeamSlug', () => {
            it('should return the team slug for a valid team id', () => {
                const { result } = renderHook(() => useUserTeams({ user: mockUser }));

                expect(result.current.getTeamSlug(2)).toBe('team-beta');
            });

            it('should return empty string for an invalid team id', () => {
                const { result } = renderHook(() => useUserTeams({ user: mockUser }));

                expect(result.current.getTeamSlug(999)).toBe('');
            });
        });

        describe('getTeamIdBySlug', () => {
            it('should return the team id for a valid slug', () => {
                const { result } = renderHook(() => useUserTeams({ user: mockUser }));

                expect(result.current.getTeamIdBySlug('team-gamma')).toBe(3);
            });

            it('should return empty string for an invalid slug', () => {
                const { result } = renderHook(() => useUserTeams({ user: mockUser }));

                expect(result.current.getTeamIdBySlug('nonexistent')).toBe('');
            });
        });
    });
});

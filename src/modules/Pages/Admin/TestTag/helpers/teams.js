import { useState, useMemo, useCallback } from 'react';

import { useAccountUser } from './hooks';

export const useUserDepartmentTeamList = (user, allOption = true) => {
    const teamList = useMemo(() => {
        const list =
            user?.department_teams?.map(team => ({
                value: team.id,
                team_slug: team.team_slug,
                label: team.team_display_name,
            })) ?? /* istanbul ignore next */ [];
        return allOption ? [{ value: -1, label: 'All teams' }, ...list] : list;
    }, [user, allOption]);
    return teamList;
};

export const useCurrentUserDepartmentTeamList = (allOption = true) => {
    const { user } = useAccountUser();
    return useUserDepartmentTeamList(user, allOption);
};

export const useUserTeams = ({
    user,
    teamSelectFieldName = 'team_display_name',
    setDefaultTeam = true,
    allTeamsOption = true,
} = {}) => {
    const teamList = useUserDepartmentTeamList(user, allTeamsOption);

    const getTeamSlug = useCallback(teamId => teamList?.find?.(t => t.value === teamId)?.team_slug ?? '', [teamList]);
    const getTeamIdBySlug = useCallback(teamSlug => teamList?.find?.(t => t.team_slug === teamSlug)?.value ?? '', [
        teamList,
    ]);
    const getDefaultTeamId = () => (setDefaultTeam ? getTeamIdBySlug(user?.user_team) : '');

    const [selectedTeam, setSelectedTeam] = useState(getDefaultTeamId);

    const selectedTeamSlug = useMemo(() => teamList.find(t => t.value === selectedTeam)?.team_slug ?? '', [
        selectedTeam,
        teamList,
    ]);

    return {
        userTeamList: teamList,
        selectedTeam,
        selectedTeamSlug,
        teamSelectFieldName,
        getTeamSlug,
        getTeamIdBySlug,
        setSelectedTeam,
    };
};

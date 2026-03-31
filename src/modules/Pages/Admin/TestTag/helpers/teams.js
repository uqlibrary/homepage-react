import { useState, useMemo } from 'react';

import { useAccountUser } from './hooks';
import { createFilter } from '../SharedComponents/DataTable/Filter/SelectField';

export const useUserDepartmentTeamList = (user, allOption = true) => {
    const teamList = useMemo(() => {
        const list =
            user?.department_teams?.map(team => ({
                id: team.id,
                team_slug: team.team_slug,
                label: team.team_display_name,
            })) ?? /* istanbul ignore next */ [];
        return allOption ? [{ id: -1, label: 'All teams' }, ...list] : list;
    }, [user, allOption]);
    return teamList;
};

export const useCurrentUserDepartmentTeamList = (allOption = true) => {
    const { user } = useAccountUser();
    return useUserDepartmentTeamList(user, allOption);
};

export const useUserTeams = (user, teamSelectFieldName = 'team_display_name', setDefaultTeam = true) => {
    const teamList = useUserDepartmentTeamList(user);

    const createDefaultSelectedTeam = (fieldName, teamId) => () => {
        const filter = createFilter(fieldName, [teamId]);
        return {
            items: [filter],
        };
    };

    const defaultTeamId = teamList.find(t => t.team_slug === user.user_team).id;
    const getDefaultSelectedTeam = setDefaultTeam
        ? createDefaultSelectedTeam(teamSelectFieldName, defaultTeamId)
        : { items: [] };
    const [selectedTeam, setSelectedTeam] = useState(getDefaultSelectedTeam);

    const selectedTeamSlug = useMemo(() => {
        return selectedTeam.items.length > 0
            ? teamList.find(team => team.id === parseInt(selectedTeam.items[0].value[0], 10))?.team_slug
            : '';
    }, [selectedTeam.items, teamList]);

    return {
        userTeamList: teamList,
        defaultTeamId,
        selectedTeam,
        selectedTeamSlug,
        teamSelectFieldName,
        setSelectedTeam,
        createDefaultSelectedTeam,
    };
};

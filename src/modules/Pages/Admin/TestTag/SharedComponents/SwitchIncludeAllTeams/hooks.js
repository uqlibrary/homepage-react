import { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

import { useAccountUser } from '../../helpers/hooks';

export const createFilter = value => {
    const retval = value ? { all_teams: true } : {};
    return retval;
};

const useTeams = ({ assetTeamSlug, searchTerm, actions }) => {
    const [allTeams, setAllTeams] = useState();

    const {
        user: { user_team: userTeam },
    } = useAccountUser();

    const includeAllTeams = useMemo(() => {
        return createFilter(allTeams);
    }, [allTeams]);

    const onAllTeamsChange = useCallback(
        (value, { additionalFilters = {}, disableAssetClearing = false } = {}) => {
            setAllTeams(value);
            if (!disableAssetClearing && value === false && assetTeamSlug !== userTeam) {
                // only reset the asset list when disabling the 'all' option, and when
                // the user already selected an asset that is outside their team
                actions.clearAssets?.();
            } else if (searchTerm !== undefined) {
                const filters = { ...createFilter(value), ...additionalFilters };
                actions.loadAssets(filters, searchTerm);
            }
        },
        [assetTeamSlug, searchTerm, userTeam, actions],
    );
    return { includeAllTeams, allTeams, setAllTeams, onAllTeamsChange };
};

useTeams.propTypes = {
    assetTeamSlug: PropTypes.string,
    searchTerm: PropTypes.string.isRequired,
    actions: PropTypes.shape({
        clearAssets: PropTypes.func,
        loadAssets: PropTypes.func.isRequired,
    }).isRequired,
};

export default useTeams;

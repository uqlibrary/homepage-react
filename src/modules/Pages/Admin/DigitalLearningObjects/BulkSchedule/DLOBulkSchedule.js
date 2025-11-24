import React from 'react';
import PropTypes from 'prop-types';

export const DLOBulkSchedule = ({
    actions,
    dlorList,
    dlorListLoading,
    dlorListError,
    dlorFilterList,
    dlorFilterListLoading,
    dlorFilterListError,
    account,
    dlorFavouritesList,
    dlorFavouritesLoading,
    dlorFavouritesError,
    dlorTeamList,
    dlorTeamListLoading,
    dlorTeamListError,
    dlorScheduleLoading,
    dlorScheduleError,
    dlorSchedule,
}) => {
    return <p>Bulk Schedule Component</p>;
};

DLOBulkSchedule.propTypes = {
    actions: PropTypes.any,
    dlorList: PropTypes.array,
    dlorListLoading: PropTypes.bool,
    dlorListError: PropTypes.any,
    dlorFilterList: PropTypes.array,
    dlorFilterListLoading: PropTypes.bool,
    dlorFilterListError: PropTypes.any,
    dlorFavouritesList: PropTypes.array,
    dlorFavouritesLoading: PropTypes.bool,
    dlorFavouritesError: PropTypes.any,
    account: PropTypes.object,
    dlorTeamList: PropTypes.array,
    dlorTeamListLoading: PropTypes.bool,
    dlorTeamListError: PropTypes.any,
    dlorScheduleLoading: PropTypes.bool,
    dlorScheduleError: PropTypes.any,
    dlorSchedule: PropTypes.array,
};

export default DLOBulkSchedule;

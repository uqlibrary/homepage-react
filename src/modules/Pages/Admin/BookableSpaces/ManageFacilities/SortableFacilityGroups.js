import React from 'react';
import PropTypes from 'prop-types';

import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';

export const SortableFacilityGroups = ({ facilityTypeGroupList }) => {
    if (!facilityTypeGroupList || facilityTypeGroupList?.length === 0) {
        return null;
    }

    return (
        <>
            <Typography component={'h3'} variant={'h6'}>
                Sort Filter type Groups
            </Typography>
            <Grid container style={{ marginBottom: '1rem' }}>
                {(
                    facilityTypeGroupList?.sort((a, b) =>
                        a.facility_type_group_name.localeCompare(b.facility_type_group_name),
                    ) || []
                )?.map((group, index) => {
                    return (
                        <Grid item xs={12} key={`facility-group-sort-item-${index}`}>
                            {group.facility_type_group_name}
                        </Grid>
                    );
                })}
            </Grid>
        </>
    );
};
SortableFacilityGroups.propTypes = {
    facilityTypeGroupList: PropTypes.array,
};

export default React.memo(SortableFacilityGroups);

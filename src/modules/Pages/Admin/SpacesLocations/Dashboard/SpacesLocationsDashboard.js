import React from 'react';
import PropTypes from 'prop-types';

import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

// https://mui.com/material-ui/material-icons/?query=tick&selected=Done
const tickIcon = altText => (
    <svg title={`${altText}`} focusable="false" aria-hidden="true" viewBox="0 0 24 24" height="24" width="24">
        <path stroke="green" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z">
            <title>{altText}</title>
        </path>
    </svg>
);

const StyledStandardCard = styled(StandardCard)(() => ({
    '& .MuiCardHeader-root': {
        paddingBottom: 0,
    },
    '& .MuiCardContent-root': {
        paddingBlock: 0,
    },
}));
const StyledBookableSpaceGridItem = styled(Grid)(() => ({
    marginTop: '12px',
}));

export const SpacesLocationsDashboard = ({
    actions,
    locationSpaceList,
    locationSpaceListLoading,
    locationSpaceListError,
    weeklyHours,
    weeklyHoursLoading,
    weeklyHoursError,
    facilityTypeList,
    facilityTypeListLoading,
    facilityTypeListError,
}) => {
    React.useEffect(() => {
        if (locationSpaceListError === null && locationSpaceListLoading === null && locationSpaceList === null) {
            actions.loadAllLocationSpaces();
        }
        if (weeklyHoursError === null && weeklyHoursLoading === null && weeklyHours === null) {
            actions.loadWeeklyHours();
        }
        if (facilityTypeListError === null && facilityTypeListLoading === null && facilityTypeList === null) {
            actions.loadAllFacilityTypes();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // function spaceFacilities(bookableSpace) {
    //     return (
    //         <>
    //             {bookableSpace?.facilities?.length > 0 && <h3>Facilities</h3>}
    //             {bookableSpace?.facilities?.length > 0 && (
    //                 <ul>
    //                     {bookableSpace?.facilities?.map(facility => {
    //                         return (
    //                             <li key={`facility-${bookableSpace?.space_id}-${facility.facilityTypeId}`}>
    //                                 {facility.facilityTypeDisplayName}
    //                             </li>
    //                         );
    //                     })}
    //                 </ul>
    //             )}
    //         </>
    //     );
    // }

    function markIfLocationHasFacility(facilityId, bookableSpace) {
        // const hasThisFacility = bookableSpace?.facilities.some(facility => facility.facility_id === facilityId);
        const hasThisFacility = bookableSpace?.facilities.some(facility => facility.facilityTypeId === facilityId);
        return hasThisFacility ? tickIcon('Included') : null;
    }

    return (
        <StandardPage title="Library bookable spaces">
            <section aria-live="assertive">
                <StandardCard standardCardId="location-list-card" noPadding noHeader style={{ border: 'none' }}>
                    <Grid container spacing={3}>
                        {(() => {
                            if (!!locationSpaceListLoading || !!weeklyHoursLoading || !!facilityTypeListLoading) {
                                return (
                                    <StyledBookableSpaceGridItem item xs={12} md={9}>
                                        <StyledStandardCard fullHeight>
                                            <InlineLoader message="Loading" />
                                        </StyledStandardCard>
                                    </StyledBookableSpaceGridItem>
                                );
                            } else if (!!locationSpaceListError || !!facilityTypeListError) {
                                return (
                                    <StyledBookableSpaceGridItem item xs={12} md={9}>
                                        <StyledStandardCard fullHeight>
                                            <p>Something went wrong - please try again later.</p>
                                        </StyledStandardCard>
                                    </StyledBookableSpaceGridItem>
                                );
                            } else if (
                                !locationSpaceList?.data?.locations ||
                                locationSpaceList?.data?.locations.length === 0
                            ) {
                                return (
                                    <StyledBookableSpaceGridItem item xs={12} md={9}>
                                        <StyledStandardCard fullHeight>
                                            <p>No locations found - please try again soon.</p>
                                        </StyledStandardCard>
                                    </StyledBookableSpaceGridItem>
                                );
                            } else {
                                const tableDescription = <>List of locations</>;
                                return (
                                    <>
                                        <Typography component={'h2'} variant={'p'} id="tableDescriptionElement">
                                            {tableDescription}
                                        </Typography>
                                        <TableContainer>
                                            <Table
                                                stickyHeader
                                                aria-label={tableDescription}
                                                aria-describedby="tableDescriptionElement"
                                            >
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell component="th">Name</TableCell>
                                                        <TableCell component="th">Space type</TableCell>
                                                        <TableCell component="th">Space location</TableCell>
                                                        {facilityTypeList?.data?.facilities?.length > 0 && (
                                                            <>
                                                                {facilityTypeList?.data?.facilities?.map(
                                                                    facilityType => {
                                                                        return (
                                                                            <TableCell
                                                                                component="th"
                                                                                key={`facilitytype-${facilityType.facility_id}`}
                                                                            >
                                                                                {facilityType.facility_name}
                                                                            </TableCell>
                                                                        );
                                                                    },
                                                                )}
                                                            </>
                                                        )}
                                                    </TableRow>
                                                </TableHead>
                                                <tbody>
                                                    {locationSpaceList?.data?.locations?.map(bookableSpace => {
                                                        return (
                                                            <TableRow
                                                                key={`space-${bookableSpace?.space_id}`}
                                                                data-testid="exampaper-desktop-originals-table-header"
                                                            >
                                                                <TableCell
                                                                    component="th"
                                                                    scope="col"
                                                                    sx={{ position: 'sticky', left: 0, zIndex: 10 }}
                                                                >
                                                                    {bookableSpace?.space_title}
                                                                </TableCell>
                                                                <TableCell>{bookableSpace?.space_type}</TableCell>
                                                                <TableCell>
                                                                    {bookableSpace?.space_building_name}
                                                                </TableCell>

                                                                {facilityTypeList?.data?.facilities?.length > 0 && (
                                                                    <>
                                                                        {facilityTypeList?.data?.facilities?.map(
                                                                            facilityType => {
                                                                                return (
                                                                                    <TableCell
                                                                                        key={`space-${bookableSpace?.space_id}-facilitytype-${facilityType.facility_name}`}
                                                                                    >
                                                                                        {markIfLocationHasFacility(
                                                                                            facilityType.facility_id,
                                                                                            bookableSpace,
                                                                                        )}
                                                                                    </TableCell>
                                                                                );
                                                                            },
                                                                        )}
                                                                    </>
                                                                )}
                                                            </TableRow>
                                                        );
                                                    })}
                                                </tbody>
                                            </Table>
                                        </TableContainer>
                                    </>
                                );
                            }
                        })()}
                    </Grid>
                </StandardCard>
            </section>
        </StandardPage>
    );
};

SpacesLocationsDashboard.propTypes = {
    actions: PropTypes.any,
    locationSpaceList: PropTypes.any,
    locationSpaceListLoading: PropTypes.bool,
    locationSpaceListError: PropTypes.any,
    weeklyHours: PropTypes.any,
    weeklyHoursLoading: PropTypes.bool,
    weeklyHoursError: PropTypes.any,
    facilityTypeList: PropTypes.any,
    facilityTypeListLoading: PropTypes.any,
    facilityTypeListError: PropTypes.any,
};

export default React.memo(SpacesLocationsDashboard);

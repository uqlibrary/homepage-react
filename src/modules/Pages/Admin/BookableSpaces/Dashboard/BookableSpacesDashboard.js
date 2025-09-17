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
import { getFriendlyLocationDescription } from 'modules/Pages/BookableSpaces/spacesHelpers';
import { breadcrumbs } from 'config/routes';

const tickIcon = altText => (
    // https://mui.com/material-ui/material-icons/?selected=Done
    <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" height="24" width="24">
        <path stroke="green" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
        <title>{altText}</title>
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
const StyledTableRow = styled(TableRow)(() => ({
    '&:hover': {
        backgroundColor: 'rgb(189 186 186)',
        '& td': {
            backgroundColor: 'rgb(189 186 186)',
        },
    },
}));
const TableHeadingTypography = styled(Typography)(({ theme }) => ({
    marginLeft: '1.5rem',
    marginTop: '1rem',
    // width: '90%',
    padding: 0,
    [theme.breakpoints.down('md')]: {
        marginLeft: '1rem',
    },
}));

export const BookableSpacesDashboard = ({
    actions,
    bookableSpacesRoomList,
    bookableSpacesRoomListLoading,
    bookableSpacesRoomListError,
    weeklyHours,
    weeklyHoursLoading,
    weeklyHoursError,
    facilityTypeList,
    facilityTypeListLoading,
    facilityTypeListError,
}) => {
    React.useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.setAttribute('secondleveltitle', breadcrumbs.bookablespacesadmin.title);
        !!siteHeader && siteHeader.setAttribute('secondLevelUrl', breadcrumbs.bookablespacesadmin.pathname);
        if (
            bookableSpacesRoomListError === null &&
            bookableSpacesRoomListLoading === null &&
            bookableSpacesRoomList === null
        ) {
            actions.loadAllBookableSpacesRooms();
        }
        if (weeklyHoursError === null && weeklyHoursLoading === null && weeklyHours === null) {
            actions.loadWeeklyHours();
        }
        if (facilityTypeListError === null && facilityTypeListLoading === null && facilityTypeList === null) {
            actions.loadAllFacilityTypes();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function markIfLocationHasFacility(facilityType, bookableSpace) {
        const hasThisFacility = bookableSpace?.facility_types.some(
            spaceFacility => spaceFacility.facility_type_id === facilityType.facility_type_id,
        );
        return hasThisFacility ? tickIcon(`Space has ${facilityType.facility_type_name}`) : null;
    }

    const getColumnBackgroundColor = ii => (ii % 2 === 0 ? '#f0f0f0' : 'inherit');

    function displayListOfBookableSpaces() {
        const tableDescription = 'Manage Spaces';
        return (
            <>
                <TableHeadingTypography component={'h2'} variant={'p'} id="tableDescriptionElement">
                    {tableDescription}
                </TableHeadingTypography>
                <TableContainer>
                    <Table stickyHeader aria-label={tableDescription} aria-describedby="tableDescriptionElement">
                        <TableHead>
                            {facilityTypeList?.data?.facility_types?.length > 0 && (
                                <TableRow>
                                    {[...Array(2).keys()].map((unused, index) => (
                                        <TableCell
                                            component="th"
                                            sx={{ borderBottomWidth: 0, paddingBlock: 0 }}
                                            key={`header-cell-${index}`}
                                        />
                                    ))}
                                    <TableCell
                                        component="th"
                                        colSpan={facilityTypeList?.data?.facility_types?.length}
                                        sx={{
                                            borderBottomWidth: 0,
                                            borderTop: '1px solid rgba(224, 224, 224, 1)',
                                        }}
                                    >
                                        Facilities
                                    </TableCell>
                                </TableRow>
                            )}
                            <TableRow>
                                <TableCell component="th">Name</TableCell>
                                <TableCell component="th">Space location</TableCell>
                                {facilityTypeList?.data?.facility_types?.length > 0 &&
                                    facilityTypeList?.data?.facility_types?.map((facilityType, ii) => {
                                        return (
                                            <TableCell
                                                component="th"
                                                key={`facilitytype-${facilityType.facility_type_id}`}
                                                sx={{
                                                    backgroundColor: getColumnBackgroundColor(ii),
                                                }}
                                            >
                                                {facilityType.facility_type_name}
                                            </TableCell>
                                        );
                                    })}
                            </TableRow>
                        </TableHead>
                        <tbody>
                            {bookableSpacesRoomList?.data?.locations?.map(bookableSpace => {
                                return (
                                    <StyledTableRow
                                        key={`space-${bookableSpace?.space_id}`}
                                        data-testid="exampaper-desktop-originals-table-header"
                                    >
                                        <TableCell
                                            component="th"
                                            scope="col"
                                            sx={{ position: 'sticky', left: 0, zIndex: 10 }}
                                        >
                                            <div>{bookableSpace?.space_name}</div>
                                            <div>{bookableSpace?.space_type}</div>
                                        </TableCell>

                                        <TableCell>{getFriendlyLocationDescription(bookableSpace)}</TableCell>

                                        {facilityTypeList?.data?.facility_types?.length > 0 && (
                                            <>
                                                {facilityTypeList?.data?.facility_types?.map((facilityType, ii) => {
                                                    return (
                                                        <TableCell
                                                            key={`space-${bookableSpace?.space_id}-facilitytype-${facilityType.facility_type_name}`}
                                                            sx={{
                                                                backgroundColor: getColumnBackgroundColor(ii),
                                                            }}
                                                        >
                                                            {markIfLocationHasFacility(facilityType, bookableSpace)}
                                                        </TableCell>
                                                    );
                                                })}
                                            </>
                                        )}
                                    </StyledTableRow>
                                );
                            })}
                        </tbody>
                    </Table>
                </TableContainer>
            </>
        );
    }

    return (
        <StandardPage title="Library spaces management">
            <section aria-live="assertive">
                <StandardCard standardCardId="location-list-card" noPadding noHeader style={{ border: 'none' }}>
                    <Grid container spacing={3}>
                        {(() => {
                            if (!!bookableSpacesRoomListLoading || !!weeklyHoursLoading || !!facilityTypeListLoading) {
                                return (
                                    <StyledBookableSpaceGridItem item xs={12} md={9}>
                                        <StyledStandardCard fullHeight>
                                            <InlineLoader message="Loading" />
                                        </StyledStandardCard>
                                    </StyledBookableSpaceGridItem>
                                );
                            } else if (!!bookableSpacesRoomListError || !!facilityTypeListError) {
                                return (
                                    <StyledBookableSpaceGridItem item xs={12} md={9}>
                                        <StyledStandardCard fullHeight>
                                            <p>Something went wrong - please try again later.</p>
                                        </StyledStandardCard>
                                    </StyledBookableSpaceGridItem>
                                );
                            } else if (
                                !bookableSpacesRoomList?.data?.locations ||
                                bookableSpacesRoomList?.data?.locations.length === 0
                            ) {
                                return (
                                    <StyledBookableSpaceGridItem item xs={12} md={9}>
                                        <StyledStandardCard fullHeight>
                                            <p>No spaces currently in system - please try again soon.</p>
                                        </StyledStandardCard>
                                    </StyledBookableSpaceGridItem>
                                );
                            } else {
                                return displayListOfBookableSpaces();
                            }
                        })()}
                    </Grid>
                </StandardCard>
            </section>
        </StandardPage>
    );
};

BookableSpacesDashboard.propTypes = {
    actions: PropTypes.any,
    bookableSpacesRoomList: PropTypes.any,
    bookableSpacesRoomListLoading: PropTypes.bool,
    bookableSpacesRoomListError: PropTypes.any,
    weeklyHours: PropTypes.any,
    weeklyHoursLoading: PropTypes.bool,
    weeklyHoursError: PropTypes.any,
    facilityTypeList: PropTypes.any,
    facilityTypeListLoading: PropTypes.any,
    facilityTypeListError: PropTypes.any,
};

export default React.memo(BookableSpacesDashboard);

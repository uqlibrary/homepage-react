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

import { breadcrumbs } from 'config/routes';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

import { getFriendlyLocationDescription } from 'modules/Pages/BookableSpaces/spacesHelpers';
import { HeaderBar } from 'modules/Pages/Admin/BookableSpaces/HeaderBar';

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
const StyledTableContainer = styled(TableContainer)(() => ({
    position: 'relative',
    overflow: 'auto',
    whiteSpace: 'nowrap',
}));
const StyledTableHeadingTypography = styled(Typography)(({ theme }) => ({
    marginLeft: '1.5rem',
    marginTop: '1rem',
    padding: 0,
    [theme.breakpoints.down('md')]: {
        marginLeft: '1rem',
    },
}));
const StyledTableHead = styled(TableHead)(() => ({
    '& tr:first-of-type th': {
        paddingBottom: 0,
    },
    '& th': {
        position: 'sticky',
        // height: '100px',
        top: 0,
    },
}));
const standardText = theme => {
    return {
        color: theme.palette.secondary.main,
        fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: '16px',
        fontWeight: 400,
        letterSpacing: '0.16px',
        lineHeight: '1.6',
    };
};
const StyledHeaderTableRow = styled(TableRow)(({ theme }) => {
    return {
        '& th, & td': standardText(theme),
    };
});

const StyledTableRow = styled(TableRow)(({ theme }) => {
    return {
        '& th, & td': standardText(theme),
        '&:hover': {
            backgroundColor: 'rgb(189 186 186)',
            '& th, & td': {
                backgroundColor: 'rgb(189 186 186)',
            },
        },
    };
});
const StyledStickyTableCell = styled(TableCell)(() => ({
    position: 'sticky',
    backgroundColor: 'white',
    left: 0,
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
                <StyledTableContainer>
                    <Table
                        // stickyHeader
                        aria-label={tableDescription}
                        aria-describedby="tableDescriptionElement"
                    >
                        <StyledTableHead>
                            {facilityTypeList?.data?.facility_types?.length > 0 && (
                                // top row of the two-row table head, to label the facilities block
                                <StyledHeaderTableRow>
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
                                </StyledHeaderTableRow>
                            )}
                            <StyledHeaderTableRow>
                                <StyledStickyTableCell component="th">Name</StyledStickyTableCell>
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
                            </StyledHeaderTableRow>
                        </StyledTableHead>
                        <tbody>
                            {bookableSpacesRoomList?.data?.locations?.map(bookableSpace => {
                                return (
                                    <StyledTableRow
                                        key={`space-${bookableSpace?.space_id}`}
                                        data-testid="exampaper-desktop-originals-table-header"
                                    >
                                        <StyledStickyTableCell component="th" scope="col">
                                            <div>{bookableSpace?.space_name}</div>
                                            <div>{bookableSpace?.space_type}</div>
                                        </StyledStickyTableCell>

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
                </StyledTableContainer>
            </>
        );
    }

    return (
        <StandardPage title="Spaces">
            <HeaderBar pageTitle="Manage Spaces" currentPage="dashboard" />

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

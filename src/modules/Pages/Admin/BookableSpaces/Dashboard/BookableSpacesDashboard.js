import React from 'react';
import PropTypes from 'prop-types';

import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

import { getFriendlyLocationDescription } from 'modules/Pages/BookableSpaces/spacesHelpers';
import { HeaderBar } from 'modules/Pages/Admin/BookableSpaces/HeaderBar';
import { addBreadcrumbsToSiteHeader } from '../helpers';
import { slugifyName, standardText } from 'helpers/general';

const tickIcon = altText => (
    // https://mui.com/material-ui/material-icons/?selected=Done
    <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" height="24" width="24">
        <path stroke="green" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
        <title>{altText}</title>
    </svg>
);

const backgroundColorColumn = '#f0f0f0';

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
const StyledTableHead = styled(TableHead)(() => ({
    '& th:first-of-type': {
        position: 'sticky',
        left: 0,
    },
}));

const StyledHeadingFacilityTableCell = styled(TableCell)(() => ({
    whiteSpace: 'break-spaces',
    textAlign: 'center',
}));

const StyledHeaderTableRow = styled(TableRow)(({ theme }) => {
    return {
        '& th, & td': {
            ...standardText(theme),
        },
    };
});

const StyledTableRow = styled(TableRow)(({ theme }) => {
    return {
        '& th, & td': {
            ...standardText(theme),
        },
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
    backgroundColor: backgroundColorColumn,
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
        addBreadcrumbsToSiteHeader([
            '<li class="uq-breadcrumb__item"><span class="uq-breadcrumb__link">Dashboard</span></li>',
        ]);
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
        const hasThisFacility = bookableSpace?.facility_types.find(
            spaceFacility => spaceFacility.facility_type_id === facilityType.facility_type_id,
        );
        // console.log('hasThisFacility=', hasThisFacility);
        if (!hasThisFacility) {
            return null;
        }
        return tickIcon(`Space has ${facilityType.facility_type_name}`);
    }

    const getColumnBackgroundColor = ii => (ii % 2 === 0 ? backgroundColorColumn : 'inherit');

    function getFacilityHeaderCells() {
        const listHeaderCells = [];
        const seenGroups = new Set();

        const groupCounts = facilityTypeList.data.facility_types.reduce((counts, item) => {
            if (item.facility_type_group_name) {
                counts[item.facility_type_group_name] = (counts[item.facility_type_group_name] || 0) + 1;
            }
            return counts;
        }, {});
        facilityTypeList.data.facility_types.forEach(item => {
            if (item.facility_type_group_name) {
                // If we haven't seen this group yet, add it with its total count
                if (!seenGroups.has(item.facility_type_group_name)) {
                    listHeaderCells.push({
                        facilityTypeGroupName: item.facility_type_group_name,
                        count: groupCounts[item.facility_type_group_name],
                    });
                    seenGroups.add(item.facility_type_group_name);
                }
            } else {
                // Add individual entry for ungrouped items
                listHeaderCells.push({
                    facilityTypeGroupName: '',
                    count: 1,
                });
            }
        });
        return listHeaderCells;
    }

    function displayListOfBookableSpaces() {
        const tableDescription = 'Manage Spaces';

        const listHeaderCells = getFacilityHeaderCells();

        return (
            <>
                <StyledTableContainer>
                    <Table aria-label={tableDescription} aria-describedby="tableDescriptionElement">
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
                                    {!!listHeaderCells &&
                                        listHeaderCells.length > 0 &&
                                        listHeaderCells.map((heading, index) => (
                                            <TableCell
                                                key={`header-cell-${index}`}
                                                component="th"
                                                colSpan={heading.count}
                                                sx={{
                                                    borderBottomWidth: 0,
                                                    borderTop: '1px solid rgba(224, 224, 224, 1)',
                                                    textAlign: 'center',
                                                    backgroundColor: `${index % 2 === 0 ? 'white' : '#f0f0f0'}`,
                                                    borderBottomColor: `${
                                                        index % 2 === 0 ? 'white' : '1px solid rgba(224, 224, 224, 1)'
                                                    }`,
                                                }}
                                            >
                                                {heading.facilityTypeGroupName}
                                            </TableCell>
                                        ))}
                                </StyledHeaderTableRow>
                            )}
                            <StyledHeaderTableRow>
                                <StyledStickyTableCell
                                    component="th"
                                    sx={{ backgroundColor: { backgroundColorColumn } }}
                                >
                                    Name
                                </StyledStickyTableCell>
                                <TableCell component="th">Space location</TableCell>
                                {facilityTypeList?.data?.facility_types?.length > 0 &&
                                    facilityTypeList?.data?.facility_types?.map((facilityType, ii) => {
                                        return (
                                            <StyledHeadingFacilityTableCell
                                                component="th"
                                                key={`facilitytype-${facilityType.facility_type_id}`}
                                                sx={{ backgroundColor: getColumnBackgroundColor(ii) }}
                                            >
                                                {facilityType.facility_type_name}
                                            </StyledHeadingFacilityTableCell>
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
                                                    const faciltySlug = slugifyName(facilityType.facility_type_name);
                                                    return (
                                                        <TableCell
                                                            key={`space-${bookableSpace?.space_id}-facilitytype-${faciltySlug}`}
                                                            data-testid={`space-${bookableSpace?.space_id}-facilitytype-${faciltySlug}`}
                                                            sx={{
                                                                backgroundColor: getColumnBackgroundColor(ii),
                                                                textAlign: 'center',
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

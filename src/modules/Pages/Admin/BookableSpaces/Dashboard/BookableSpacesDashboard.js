import React from 'react';
import PropTypes from 'prop-types';
import { useAccountContext } from 'context';

import { Grid } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import EditIcon from '@mui/icons-material/Edit';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

import DoneIcon from '@mui/icons-material/Done';

import { getFriendlyLocationDescription } from 'modules/Pages/BookableSpaces/spacesHelpers';
import { HeaderBar } from 'modules/Pages/Admin/BookableSpaces/HeaderBar';
import { addBreadcrumbsToSiteHeader, spacesAdminLink } from '../bookableSpacesAdminHelpers';
import { slugifyName, standardText } from 'helpers/general';

const backgroundColorColumn = '#f0f0f0';
const borderColour = '1px solid rgb(224 224 224 / 1)';

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

const StyledHeaderTableRow = styled(TableRow)(({ theme }) => ({
    '& th, & td': {
        ...standardText(theme),
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '& th, & td': {
        ...standardText(theme),
    },
    '&:hover': {
        backgroundColor: 'rgb(189 186 186)',
        '& th, & td': {
            backgroundColor: 'rgb(189 186 186)',
        },
    },
}));
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
    console.log('BookableSpacesDashboard top');
    console.log(
        'bookableSpacesRoomList',
        bookableSpacesRoomListLoading,
        bookableSpacesRoomListError,
        bookableSpacesRoomList,
    );
    console.log('weeklyHours', weeklyHoursLoading, weeklyHoursError, weeklyHours);
    console.log('facilityTypeList', facilityTypeListLoading, facilityTypeListError, facilityTypeList);

    const { account } = useAccountContext();

    React.useEffect(() => {
        console.log('BookableSpacesDashboard PAGE LOADED');
        addBreadcrumbsToSiteHeader([
            '<li class="uq-breadcrumb__item"><span class="uq-breadcrumb__link">Manage Spaces</span></li>',
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

    function hasFacility(facilityType, bookableSpace) {
        return bookableSpace?.facility_types.some(spaceFacility => {
            return spaceFacility.facility_type_id === facilityType.facility_type_id;
        });
    }

    const getColumnBackgroundColor = ii => (ii % 2 === 0 ? backgroundColorColumn : 'inherit');

    function prefilterFacilityData(data) {
        // first ensure sorted in sort order
        const sortedGroups = [...data?.facility_type_groups].sort(
            (a, b) => a.facility_type_group_order - b.facility_type_group_order,
        );

        // then add an overall sort order, to help us to tiger stripe the columns
        let overallCounter = 1;
        return sortedGroups?.map(group => {
            // sort the facility types alphabetically (they should already be, but...)
            const sortedChildren = [...group.facility_type_children].sort((a, b) =>
                a.facility_type_name.localeCompare(b.facility_type_name),
            );

            const childrenWithCounter = sortedChildren?.map(child => ({
                ...child,
                overall_order: overallCounter++,
            }));

            return {
                ...group,
                facility_type_children: childrenWithCounter,
            };
        });
    }

    const openEditSpacePage = e => {
        const buttonClicked = e.target.closest('button');
        const spaceuuid = !!buttonClicked && buttonClicked.getAttribute('data-spaceuuid');
        !!spaceuuid && (window.location.href = spacesAdminLink(`/admin/spaces/edit/${spaceuuid}`, account));
        /* istanbul ignore next */
        !spaceuuid && console.log('no valid button clicked');
    };

    function displayListOfBookableSpaces() {
        const tableDescription = 'Manage Spaces';

        const sortedFacilityTypeGroups = prefilterFacilityData(facilityTypeList?.data);

        return (
            <>
                <StyledTableContainer>
                    <Table aria-label={tableDescription} aria-describedby="tableDescriptionElement">
                        <StyledTableHead>
                            {facilityTypeList?.data?.facility_type_groups?.length > 0 && (
                                // top row of the two-row table head, to label the facilities block
                                <StyledHeaderTableRow data-testid="spaces-dashboard-header-row">
                                    {[...Array(2).keys()].map((unused, index) => (
                                        <TableCell
                                            component="th"
                                            sx={{ borderBottomWidth: 0, paddingBlock: 0 }}
                                            key={`header-cell-${index}`}
                                        />
                                    ))}
                                    {sortedFacilityTypeGroups?.map((group, index) => {
                                        return (
                                            <TableCell
                                                key={`header-cell-${index}`}
                                                component="th"
                                                colSpan={group.facility_type_children?.length}
                                                sx={{
                                                    borderBottomWidth: 0,
                                                    borderTop: borderColour,
                                                    textAlign: 'center',
                                                    backgroundColor: `${index % 2 === 0 ? 'white' : '#f0f0f0'}`,
                                                    borderLeft: borderColour,
                                                }}
                                            >
                                                {group.facility_type_group_name}
                                            </TableCell>
                                        );
                                    })}
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
                                {sortedFacilityTypeGroups?.map(group =>
                                    group?.facility_type_children?.map(facilityType => (
                                        <StyledHeadingFacilityTableCell
                                            component="th"
                                            key={`facilitytype-${facilityType.facility_type_id}`}
                                            sx={{
                                                backgroundColor: getColumnBackgroundColor(facilityType.overall_order),
                                                borderLeft: borderColour,
                                            }}
                                        >
                                            {facilityType.facility_type_name}
                                        </StyledHeadingFacilityTableCell>
                                    )),
                                )}
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
                                            <div>
                                                <IconButton
                                                    color="primary"
                                                    data-testid={`edit-space-${bookableSpace?.space_id}-button`}
                                                    data-spaceuuid={bookableSpace?.space_uuid}
                                                    onClick={openEditSpacePage}
                                                    aria-label={`Edit ${bookableSpace?.space_name}`}
                                                >
                                                    <EditIcon style={{ width: '1rem' }} />
                                                </IconButton>
                                                {bookableSpace?.space_name}
                                            </div>
                                            <div>{bookableSpace?.space_type}</div>
                                        </StyledStickyTableCell>

                                        <TableCell>{getFriendlyLocationDescription(bookableSpace)}</TableCell>

                                        {sortedFacilityTypeGroups?.length > 0 &&
                                            sortedFacilityTypeGroups?.map(group => {
                                                return group?.facility_type_children?.map(facilityType => {
                                                    const facilitySlug = slugifyName(facilityType.facility_type_name);
                                                    return (
                                                        <TableCell
                                                            key={`space-${bookableSpace?.space_id}-facilitytype-${facilitySlug}`}
                                                            data-testid={`space-${bookableSpace?.space_id}-facilitytype-${facilitySlug}`}
                                                            sx={{
                                                                backgroundColor: getColumnBackgroundColor(
                                                                    facilityType.overall_order,
                                                                ),
                                                                textAlign: 'center',
                                                                borderInline: borderColour,
                                                            }}
                                                        >
                                                            {hasFacility(facilityType, bookableSpace) ? (
                                                                <DoneIcon
                                                                    titleAccess={`Space has ${facilityType.facility_type_name}`}
                                                                    style={{ stroke: 'green' }}
                                                                    data-testid={`tick-${bookableSpace?.space_id}-facilitytype-${facilitySlug}`}
                                                                />
                                                            ) : null}
                                                        </TableCell>
                                                    );
                                                });
                                            })}
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
                                        <InlineLoader message="Loading" />
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

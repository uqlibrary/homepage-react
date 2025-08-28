import React from 'react';
import PropTypes from 'prop-types';

import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import EditIcon from '@mui/icons-material/Edit';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { breadcrumbs } from 'config/routes';

const StyledStandardCard = styled(StandardCard)(() => ({
    '& .MuiCardHeader-root': {
        paddingBottom: 0,
    },
    '& .MuiCardContent-root': {
        paddingBlock: 0,
    },
}));
const StyledGridItem = styled(Grid)(() => ({
    marginTop: '12px',
}));
const StyledEditIcon = styled(EditIcon)(() => ({
    color: 'grey',
    marginLeft: '0.5rem',
}));
const StyledDiv = styled('div')(() => ({
    display: 'flex',
    textAlign: 'center',
}));
export const BookableSpacesManageLocations = ({ actions, siteList, siteListLoading, siteListError }) => {
    React.useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.setAttribute('secondleveltitle', breadcrumbs.bookablespacesadmin.title);
        !!siteHeader && siteHeader.setAttribute('secondLevelUrl', breadcrumbs.bookablespacesadmin.pathname);

        // actions.clearSites();

        if (siteListError === null && siteListLoading === null && siteList === null) {
            actions.loadBookableSpaceSites();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function getLoctionListTableRow(site, building, floor, siteIdPrevious, buildingIdPrevious) {
        return (
            <TableRow key={`location-${site.site_id}-${building.building_id}-floor-${floor.floor_id}`}>
                <TableCell>
                    <StyledDiv>
                        {site.site_name}
                        {siteIdPrevious !== site.site_id && <StyledEditIcon />}
                    </StyledDiv>
                </TableCell>
                <TableCell>
                    <StyledDiv>
                        {building.building_name}
                        {buildingIdPrevious !== building.building_id && <StyledEditIcon />}
                    </StyledDiv>
                </TableCell>
                <TableCell>
                    <StyledDiv>
                        {floor.floor_id_displayed}
                        {building.ground_floor_id === floor.floor_id && ' [Ground]'}
                        <StyledEditIcon />
                    </StyledDiv>
                </TableCell>
            </TableRow>
        );
    }

    let siteIdPrevious = null;
    let buildingIdPrevious = null;
    return (
        <StandardPage title="Library bookable spaces Location management">
            <section aria-live="assertive">
                <StandardCard standardCardId="location-list-card" noPadding noHeader style={{ border: 'none' }}>
                    <Grid container spacing={3}>
                        {(() => {
                            if (!!siteListLoading) {
                                return (
                                    <StyledGridItem item xs={12} md={9}>
                                        <StyledStandardCard fullHeight>
                                            <InlineLoader message="Loading" />
                                        </StyledStandardCard>
                                    </StyledGridItem>
                                );
                            } else if (!!siteListError) {
                                return (
                                    <StyledGridItem item xs={12} md={9}>
                                        <StyledStandardCard fullHeight>
                                            <p>Something went wrong - please try again later.</p>
                                        </StyledStandardCard>
                                    </StyledGridItem>
                                );
                            } else if (!siteList || siteList.length === 0) {
                                return (
                                    <StyledGridItem item xs={12} md={9}>
                                        <StyledStandardCard fullHeight>
                                            <p>No spaces currently in system - please try again soon.</p>
                                        </StyledStandardCard>
                                    </StyledGridItem>
                                );
                            } else {
                                return (
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell component="th">Site</TableCell>
                                                    <TableCell component="th">Building</TableCell>
                                                    <TableCell component="th">Floor</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {siteList.map(site =>
                                                    site.buildings.map(building =>
                                                        building.floors.map(floor => {
                                                            const component = getLoctionListTableRow(
                                                                site,
                                                                building,
                                                                floor,
                                                                siteIdPrevious,
                                                                buildingIdPrevious,
                                                            );

                                                            siteIdPrevious = site.site_id;
                                                            buildingIdPrevious = building.building_id;

                                                            return component;
                                                        }),
                                                    ),
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                );
                            }
                        })()}
                    </Grid>
                </StandardCard>
            </section>
        </StandardPage>
    );
};

BookableSpacesManageLocations.propTypes = {
    actions: PropTypes.any,
    siteList: PropTypes.any,
    siteListLoading: PropTypes.any,
    siteListError: PropTypes.any,
};

export default React.memo(BookableSpacesManageLocations);

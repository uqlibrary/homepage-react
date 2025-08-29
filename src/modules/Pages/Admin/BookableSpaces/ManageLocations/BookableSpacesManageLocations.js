import React from 'react';
import PropTypes from 'prop-types';

import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

import EditIcon from '@mui/icons-material/Edit';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { breadcrumbs } from 'config/routes';
import { pluralise } from 'helpers/general';

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
    height: '1rem',
}));
const StyledDiv = styled('div')(() => ({
    display: 'flex',
    textAlign: 'center',
}));
const StyledRow = styled('div')(() => ({
    marginBlock: '1rem',
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

    function getLocationLayout(siteList) {
        return (
            <>
                {siteList.map(site => [
                    <StyledRow key={`site-${site.site_id}`}>
                        <div style={{ paddingLeft: '4rem' }}>
                            <StyledDiv>
                                {site.site_name}
                                {<StyledEditIcon />}
                            </StyledDiv>
                        </div>
                    </StyledRow>,
                    ...site.buildings.flatMap(building => [
                        <StyledRow key={`building-${building.building_id}`}>
                            <div style={{ paddingLeft: '8rem' }}>
                                <StyledDiv>
                                    <span>{`${building.building_name}`}</span>
                                    <span style={{ marginLeft: '0.5rem' }}>{`(${building.floors.length} ${pluralise(
                                        'Floor',
                                        building.floors.length,
                                    )})`}</span>
                                    {<StyledEditIcon />}
                                </StyledDiv>
                            </div>
                        </StyledRow>,
                        ...building.floors.map(floor => (
                            <StyledRow key={`location-floor-${floor.floor_id}`}>
                                <div style={{ paddingLeft: '12rem' }}>
                                    <StyledDiv>
                                        {floor.floor_id_displayed}
                                        {building.ground_floor_id === floor.floor_id && ' [Ground]'}
                                        <StyledEditIcon />
                                    </StyledDiv>
                                </div>
                            </StyledRow>
                        )),
                    ]),
                ])}
            </>
        );
    }

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
                                return <StyledGridItem>{getLocationLayout(siteList)}</StyledGridItem>;
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

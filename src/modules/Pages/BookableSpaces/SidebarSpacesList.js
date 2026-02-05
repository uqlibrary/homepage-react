import React from 'react';
import PropTypes from 'prop-types';

import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material';

import SpaceDetails from 'modules/Pages/BookableSpaces/SpaceDetails';

const StyledBookableSpaceGridItem = styled(Grid)(() => ({
    marginTop: '12px',
}));
const StyledBodyGrid = styled(Grid)(() => ({
    '& .showsOnlyOnFocus': {
        position: 'absolute',
        left: '-999px',
        top: '-999px',
        '&:focus': {
            position: 'relative',
            top: 'inherit',
            left: 'inherit',
        },
    },
}));
const StyledSpaceGridWrapperDiv = styled('div')(() => ({
    backgroundColor: 'white',
    flexDirection: 'row',
    flexGrow: 0,
    marginLeft: '1rem',
    overflowY: 'scroll',
    marginTop: '2px',
    maxWidth: '25%',
    flexBasis: '25%',
    '&.narrow': {
        maxWidth: '16.6667%',
        flexBasis: '16.6667%',
    },
    '&.wide': {
        //
    },
}));

const SidebarSpacesList = ({
    filteredSpaceLocations,
    weeklyHours,
    weeklyHoursLoading,
    weeklyHoursError,
    StyledStandardCard,
    sentClassName,
}) => {
    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down('sm')) || false;
    const _isTabletViewJust = useMediaQuery(theme.breakpoints.down('lg')) || false;
    const isTabletView = isMobileView ? false : _isTabletViewJust;
    const isDesktopView = !isTabletView && !isMobileView;

    return (
        <StyledSpaceGridWrapperDiv id="panelList" className={sentClassName}>
            <StyledBodyGrid container id="space-wrapper" data-testid="space-wrapper">
                <a className="showsOnlyOnFocus" href="#topOfSidebar">
                    Skip back to list of filters
                </a>
                {filteredSpaceLocations.length === 0 && (
                    <Grid item xs={9} data-testid={'no-spaces-visible'}>
                        <p>No Spaces match these filters - change your selection in the sidebar to show some spaces.</p>
                    </Grid>
                )}
                <Typography variant={'h2'} className="showsOnlyOnFocus">
                    Available Spaces
                </Typography>
                {filteredSpaceLocations.length > 0 &&
                    filteredSpaceLocations?.map(bookableSpace => {
                        return (
                            <StyledBookableSpaceGridItem
                                item
                                xs={12}
                                key={`space-${bookableSpace?.space_id}`}
                                id={`space-${bookableSpace?.space_id}`}
                                data-testid={`space-${bookableSpace?.space_id}`}
                                style={{ display: 'block' }}
                            >
                                <StyledStandardCard
                                    fullHeight
                                    title={`${bookableSpace?.space_name} - ${bookableSpace?.space_type}`}
                                    style={{ marginRight: '0.5rem' }}
                                    squareTop
                                    subCard
                                >
                                    <SpaceDetails
                                        weeklyHours={weeklyHours}
                                        weeklyHoursLoading={weeklyHoursLoading}
                                        weeklyHoursError={weeklyHoursError}
                                        bookableSpace={bookableSpace}
                                        collapseable
                                        minimalDetails={isTabletView || isMobileView}
                                        // minimalDetails
                                    />
                                </StyledStandardCard>
                            </StyledBookableSpaceGridItem>
                        );
                    })}
            </StyledBodyGrid>
        </StyledSpaceGridWrapperDiv>
    );
};

SidebarSpacesList.propTypes = {
    filteredSpaceLocations: PropTypes.any,
    weeklyHours: PropTypes.any,
    weeklyHoursLoading: PropTypes.bool,
    weeklyHoursError: PropTypes.any,
    StyledStandardCard: PropTypes.any,
    sentClassName: PropTypes.string,
};

export default React.memo(SidebarSpacesList);

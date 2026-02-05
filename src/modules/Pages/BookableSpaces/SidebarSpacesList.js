import React from 'react';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';

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
// const StyledMobileSpaceDiv = styled('div')(() => ({
//     '& .descriptionBlock': {
//         height: '3.5rem',
//         overflow: 'hidden',
//         '& p ': {
//             marginTop: 0,
//         },
//     },
// }));
const StyledSpaceGridWrapperDiv = styled('div')(() => ({
    position: 'sticky',
    top: 0,
    overflowY: 'auto',
    height: '100%',

    backgroundColor: 'white',
    flexDirection: 'row',
    flexGrow: 0,
    paddingLeft: '1rem',
    marginTop: '2px',
    flexBasis: '25%',
    // '&.desktop': {
    //     maxWidth: '16.6667%',
    //     flexBasis: '16.6667%',
    // },
    '&.mobile': {
        // position: 'absolute',
    },
}));

const SidebarSpacesList = ({
    filteredSpaceLocations,
    weeklyHours,
    weeklyHoursLoading,
    weeklyHoursError,
    StyledStandardCard,
    sentClassName,
    showAllData = false,
}) => {
    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down('sm')) || false;
    const _isTabletViewJust = useMediaQuery(theme.breakpoints.down('lg')) || false;
    const isTabletView = isMobileView ? false : _isTabletViewJust;
    const isDesktopView = !isTabletView && !isMobileView;

    // const markerRefs = React.useRef({});
    //
    // const handleMapOpenButtonClick = id => {
    //     if (markerRefs.current[id]) {
    //         markerRefs.current[id].openPopup();
    //     }
    // };

    return (
        <StyledSpaceGridWrapperDiv
            id="StyledSpaceGridWrapperDivTemp"
            className={sentClassName}
            style={{ paddingTop: '4.2rem' }}
        >
            <StyledBodyGrid container id="space-wrapper" data-testid="space-wrapper">
                <a className="showsOnlyOnFocus" href="#topOfSidebar">
                    Skip back to list of filters
                </a>
                {filteredSpaceLocations.length === 0 && (
                    <p data-testid="no-spaces-visible">
                        No Spaces match these filters - change your selection in the sidebar to show some spaces.
                    </p>
                )}
                {filteredSpaceLocations.length > 0 && (
                    <Typography
                        component={'h2'}
                        variant={'h6'}
                        // className="showsOnlyOnFocus"
                    >
                        Available Spaces
                    </Typography>
                )}
                {filteredSpaceLocations.length > 0 &&
                    filteredSpaceLocations?.map(bookableSpace => {
                        return (
                            <StyledBookableSpaceGridItem
                                item
                                xs={12}
                                key={`space-${bookableSpace?.space_id}`}
                                id={`space-${bookableSpace?.space_id}`}
                                data-testid={`space-${bookableSpace?.space_id}`}
                                // style={{ display: 'block' }}
                            >
                                {showAllData ? (
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
                                        />
                                    </StyledStandardCard>
                                ) : (
                                    // <Button onClick={() => handleMapOpenButtonClick(location.id)}>
                                    <StyledStandardCard
                                        fullHeight
                                        title={`${bookableSpace?.space_name} - ${bookableSpace?.space_type}`}
                                        style={{ marginRight: '0.5rem' }}
                                        squareTop
                                        subCard
                                    >
                                        {bookableSpace?.space_description?.length > 0 && (
                                            <div className="descriptionBlock">
                                                {parse(bookableSpace?.space_description)}
                                            </div>
                                        )}
                                    </StyledStandardCard>
                                    // </Button>
                                )}
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
    showAllData: PropTypes.bool,
};

export default React.memo(SidebarSpacesList);

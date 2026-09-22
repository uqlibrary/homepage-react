import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import JourneySpaceDetailsView from 'modules/Pages/BookableSpaces/SpacesListPage/MapListPage/components/JourneySpaceDetailsView';

import { BookingLink } from 'modules/Pages/BookableSpaces/Shared/BookingLink';
import SpacesOutageNotice from 'modules/Pages/BookableSpaces/Shared/SpacesOutageNotice';
import SpaceOpenStatusChip from 'modules/Pages/BookableSpaces/Shared/SpaceOpenStatusChip';

import { getVisibleSpaceOutage } from 'modules/Pages/Admin/BookableSpaces/Spaces/Form/spaceOutageHelpers';

const StyledSpaceDiv = styled('div')(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        overflow: 'auto',
        maxWidth: '80%',
    },
}));

const CollapsedSection = ({ bookableSpace, visibleOutage, weeklyHoursLoading, weeklyHoursError, weeklyHours }) => {
    return (
        <Stack spacing={1}>
            <Typography sx={{ color: 'designSystem.bodyCopy' }}>{bookableSpace?.space_library_name}</Typography>
            {!visibleOutage && (
                <Box>
                    <SpaceOpenStatusChip
                        space={bookableSpace}
                        weeklyHours={weeklyHours}
                        weeklyHoursLoading={weeklyHoursLoading}
                        weeklyHoursError={weeklyHoursError}
                    />
                </Box>
            )}
            {!!visibleOutage && (
                <SpacesOutageNotice bookableSpace={bookableSpace} visibleOutage={visibleOutage} hideReason />
            )}
            {!!bookableSpace?.space_type_details?.space_type_description && (
                <Typography variant="body2" sx={{ color: 'designSystem.bodyCopy' }}>
                    {bookableSpace.space_type_details.space_type_description}
                </Typography>
            )}
            {!!bookableSpace?.space_description && (
                <Typography
                    variant="body2"
                    data-testid={`space-${bookableSpace?.space_id}-description`}
                    sx={{ color: 'designSystem.bodyCopy', fontStyle: 'italic' }}
                >
                    {String(bookableSpace.space_description)
                        .replace(/<[^>]*>/g, ' ')
                        .trim()}
                </Typography>
            )}
            {!!bookableSpace?.space_external_book_url && (
                <Box sx={{ pt: 0.5 }}>
                    <BookingLink bookableSpace={bookableSpace} hideNoBookingRequired />
                </Box>
            )}
        </Stack>
    );
};
CollapsedSection.propTypes = {
    bookableSpace: PropTypes.any,
    visibleOutage: PropTypes.any,
    weeklyHoursLoading: PropTypes.any,
    weeklyHoursError: PropTypes.any,
    weeklyHours: PropTypes.any,
};

const MapSpaceDetails = ({
    actions,
    weeklyHours,
    weeklyHoursLoading,
    weeklyHoursError,
    bookableSpace,
    collapsed = /* istanbul ignore next */ false,
    isExpanded = false,
    // collapsed=true: called by sidebar, has open-close icon;
    // collapsed=false: opens from icon in map, no open-close icon
    onToggle = null,
    showToggle = true,
    isFavourite = false,
}) => {
    const isCollapsed = collapsed ? !isExpanded : false;

    const visibleOutage = React.useMemo(
        () => getVisibleSpaceOutage(bookableSpace?.space_outages),
        [bookableSpace?.space_outages],
    );

    const showHideSpacePanel = bookableSpace => {
        const spaceExtraElementsId = spaceId => `space-more-${spaceId}`;
        const togglePanelButtonElementId = spaceId => `toggle-panel-button-space-${spaceId}`;
        const toggleSpace = () => {
            onToggle?.(bookableSpace, isCollapsed);
        };
        return (
            <IconButton
                id={togglePanelButtonElementId(bookableSpace?.space_id)}
                data-testid={`space-${bookableSpace?.space_id}-toggle-panel-button`}
                onClick={toggleSpace}
                aria-label={
                    isCollapsed
                        ? `Show more information about ${bookableSpace?.space_name}`
                        : `Show fewer details for ${bookableSpace?.space_name}`
                }
                aria-haspopup="true"
                aria-expanded={`${isCollapsed ? 'false' : 'true'}`}
                aria-controls={spaceExtraElementsId(bookableSpace?.space_id)}
            >
                <KeyboardArrowDownIcon style={{ display: isCollapsed ? 'block' : 'none' }} className="closePanel" />
                <KeyboardArrowUpIcon style={{ display: isCollapsed ? 'none' : 'block' }} className="openPanel" />
            </IconButton>
        );
    };

    return (
        <div id="SpaceDetailsTemp">
            <StyledSpaceDiv>
                {!!showToggle && (
                    <div style={{ float: 'right', marginTop: '-40px', marginRight: '-10px' }}>
                        {showHideSpacePanel(bookableSpace)}
                    </div>
                )}
                {!!isCollapsed && (
                    <CollapsedSection
                        bookableSpace={bookableSpace}
                        visibleOutage={visibleOutage}
                        weeklyHoursLoading={weeklyHoursLoading}
                        weeklyHoursError={weeklyHoursError}
                        weeklyHours={weeklyHours}
                    />
                )}
                {!isCollapsed && (
                    <JourneySpaceDetailsView
                        actions={actions}
                        weeklyHours={weeklyHours}
                        weeklyHoursLoading={weeklyHoursLoading}
                        weeklyHoursError={weeklyHoursError}
                        selectedSpace={bookableSpace}
                        isFavourite={isFavourite}
                        showMap={false}
                        showBackButton={false}
                        narrowView
                        verticalView={false}
                    />
                )}
            </StyledSpaceDiv>
        </div>
    );
};

MapSpaceDetails.propTypes = {
    actions: PropTypes.any,
    weeklyHours: PropTypes.any,
    weeklyHoursLoading: PropTypes.bool,
    weeklyHoursError: PropTypes.any,
    bookableSpace: PropTypes.any,
    collapsed: PropTypes.bool,
    isExpanded: PropTypes.bool,
    onToggle: PropTypes.func,
    showToggle: PropTypes.bool,
    isFavourite: PropTypes.bool,
};

export default React.memo(MapSpaceDetails);

import React from 'react';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';

import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';

import { OpeningHoursShort } from './OpeningHoursShort';
import { getFriendlyLocationDescription } from 'modules/Pages/BookableSpaces/spacesHelpers';
import {
    formatSpaceOutageRangeForPublicNotice,
    formatSpaceOutageUntilForPublicNotice,
    getSpaceOutageShowTimePublic,
    getVisibleSpaceOutage,
} from 'modules/Pages/Admin/BookableSpaces/Spaces/Form/spaceOutageHelpers';
import { pluralise } from 'helpers/general';
import useMediaQuery from '@mui/material/useMediaQuery';
import UserAttention from 'modules/SharedComponents/Toolbox/UserAttention';
import JourneySpaceDetailsView from 'modules/Pages/BookableSpaces/JourneySpaceDetailsView';
import JourneyBreadcrumbs from './JourneyBreadcrumbs';

const StyledFriendlyLocationDiv = styled('div')(() => ({
    marginTop: '5px',
    '& .location-space': {
        lineHeight: 1.25,
    },
    '& .location-floor': {
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
    },
}));
const StyledSpaceDiv = styled('div')(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        overflow: 'auto',
        maxWidth: '80%',
    },
}));
const StyleCapacityDiv = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    columnGap: '0.5rem',
    '& svg': {
        color: theme.palette.primary.main,
    },
}));
const StyledOutageNotice = styled('div')(() => ({
    marginBlock: '0.5rem',
    '& p': {
        marginTop: '0.5rem',
    },
}));
const StyledDescriptionDiv = styled('div')(() => ({
    '&.truncated p': {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    '&.hasMinWidth': {
        minWidth: '400px',
    },
    '&.hasMaxHeight': {
        maxHeight: '4rem',
        overflow: 'auto',
        marginBottom: '1rem',
    },
}));
const StyledCollapsableSection = styled('div')(({ theme }) => ({
    transition: 'opacity 0.3s ease-in-out, height 0.3s ease-in-out',
    '&.hiddenSection': {
        visibility: 'hidden',
        height: 0,
        opacity: 0,
        overflow: 'hidden',
    },
    'ul.facilityTypeList li': {
        [theme.breakpoints.down('sm')]: {
            display: 'inline',
            '&::after': {
                content: '", "',
            },
            '&:last-child::after': {
                content: '""',
            },
        },
    },
}));

const ShowOutageNotice = ({ bookableSpace, visibleOutage, isCollapsed }) => {
    return (
        <StyledOutageNotice data-testid={`space-${bookableSpace?.space_id}-outage-notice`}>
            <UserAttention
                titleText={visibleOutage.status === 'Current' ? 'Current closure' : 'Upcoming closure'}
                tone={visibleOutage.tone}
                variant="aligned"
            >
                <Typography variant="body2" data-testid={`space-${bookableSpace?.space_id}-outage-message`}>
                    {visibleOutage.status === 'Current'
                        ? `Currently unavailable until ${formatSpaceOutageUntilForPublicNotice(
                              visibleOutage.outage?.space_outage_end,
                              undefined,
                              getSpaceOutageShowTimePublic(visibleOutage.outage),
                          )}.`
                        : `Closed ${formatSpaceOutageRangeForPublicNotice(
                              visibleOutage.outage?.space_outage_start,
                              visibleOutage.outage?.space_outage_end,
                              getSpaceOutageShowTimePublic(visibleOutage.outage),
                          )}.`}
                </Typography>
                {!isCollapsed && !!visibleOutage.reason && (
                    <Typography variant="body2" data-testid={`space-${bookableSpace?.space_id}-outage-reason`}>
                        Reason: {visibleOutage.reason}
                    </Typography>
                )}
            </UserAttention>
        </StyledOutageNotice>
    );
};
ShowOutageNotice.propTypes = {
    bookableSpace: PropTypes.any,
    visibleOutage: PropTypes.any,
    isCollapsed: PropTypes.any,
};

const StyledBookitLinkWrapperDiv = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    columnGap: '0.5rem',
    '& svg': {
        width: '24px',
        height: '24px',
        stroke: theme.palette.primary.main,
    },
    '& a': {
        '&:hover, &:focus': {
            backgroundColor: 'transparent',
            '& span': {
                backgroundColor: '#51247a',
                color: '#fff',
            },
        },
    },
}));
const BookingLink = ({ bookableSpace }) => {
    const uqBookitMakeABookingIcon = (
        <svg
            className="sidebarNav-link-icon"
            height="512"
            viewBox="0 0 24 24"
            width="512"
            xmlns="http://www.w3.org/2000/svg"
            style={{ strokeWidth: 0.2 }}
        >
            <path d="M17.5 24c-3.584 0-6.5-2.916-6.5-6.5s2.916-6.5 6.5-6.5 6.5 2.916 6.5 6.5-2.916 6.5-6.5 6.5zm0-11.5c-2.757 0-5 2.243-5 5s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
            <path d="M17.5 21a.75.75 0 01-.75-.75v-5.5a.75.75 0 011.5 0v5.5a.75.75 0 01-.75.75z" />
            <path d="M20.25 18.25h-5.5a.75.75 0 010-1.5h5.5a.75.75 0 010 1.5zM9.19 21H2.75A2.752 2.752 0 010 18.25V2.75A2.752 2.752 0 012.75 0h11.5A2.752 2.752 0 0117 2.75v6.09a.75.75 0 01-1.5 0V2.75c0-.689-.561-1.25-1.25-1.25H2.75c-.689 0-1.25.561-1.25 1.25v15.5c0 .689.561 1.25 1.25 1.25h6.44a.75.75 0 010 1.5z" />
            <path d="M13.25 9.5h-9.5a.75.75 0 010-1.5h9.5a.75.75 0 010 1.5zM9.25 13.5h-5.5a.75.75 0 010-1.5h5.5a.75.75 0 010 1.5zM8.25 5.5h-4.5a.75.75 0 010-1.5h4.5a.75.75 0 010 1.5z" />
        </svg>
    );
    return (
        <StyledBookitLinkWrapperDiv data-testid={`space-${bookableSpace?.space_id}-booking-link`}>
            {uqBookitMakeABookingIcon}
            <a href={bookableSpace?.space_external_book_url} target={'_blank'}>
                <span>Book this space</span>
            </a>
        </StyledBookitLinkWrapperDiv>
    );
};
BookingLink.propTypes = {
    bookableSpace: PropTypes.any,
};
const CollapsedSection = ({
    bookableSpace,
    visibleOutage,
    isBookable,
    // uqBookitMakeABookingIcon,
    getDescriptionClassName,
    getFirstParagraph,
    summaryPanelElementId,
    weeklyHoursLoading,
    weeklyHoursError,
    weeklyHours,
    // isMobileView,
}) => {
    return (
        <>
            <StyledFriendlyLocationDiv data-testid={`space-${bookableSpace?.space_id}-friendly-location-collapsed`}>
                {getFriendlyLocationDescription(bookableSpace, true)}
            </StyledFriendlyLocationDiv>
            {!!visibleOutage && (
                <ShowOutageNotice bookableSpace={bookableSpace} visibleOutage={visibleOutage} isCollapsed />
            )}
            {isBookable && <BookingLink bookableSpace={bookableSpace} />}
            {!isBookable && (
                <div data-testid={`space-${bookableSpace?.space_id}-not-bookable`}>No booking required.</div>
            )}
            {isBookable && !!bookableSpace?.space_capacity && bookableSpace?.space_capacity > 0 && (
                <StyleCapacityDiv data-testid={`space-${bookableSpace?.space_id}-capacity`}>
                    <PeopleOutlineIcon />
                    {`Space for ${bookableSpace?.space_capacity} ${pluralise(
                        'person',
                        bookableSpace?.space_capacity,
                        'people',
                    )}.`}
                </StyleCapacityDiv>
            )}
            <Typography variant="body2">{bookableSpace?.space_type_details?.space_type_description}</Typography>
            {bookableSpace?.space_description?.length > 0 && (
                <StyledDescriptionDiv
                    id={`space-description-${bookableSpace?.space_id}`}
                    data-testid={`space-${bookableSpace?.space_id}-description`}
                    className={getDescriptionClassName()}
                >
                    {parse(getFirstParagraph(bookableSpace?.space_description))}
                </StyledDescriptionDiv>
            )}
            <StyledCollapsableSection
                // loads open
                id={summaryPanelElementId(bookableSpace?.space_id)}
                data-testid={`space-${bookableSpace?.space_id}-summary-hours`}
                style={{ display: null }}
            >
                <OpeningHoursShort
                    weeklyHoursLoading={weeklyHoursLoading}
                    weeklyHoursError={weeklyHoursError}
                    weeklyHours={weeklyHours}
                    bookableSpace={bookableSpace}
                />
            </StyledCollapsableSection>
        </>
    );
};
CollapsedSection.propTypes = {
    bookableSpace: PropTypes.any,
    visibleOutage: PropTypes.any,
    isBookable: PropTypes.any,
    // uqBookitMakeABookingIcon: PropTypes.any,
    getDescriptionClassName: PropTypes.any,
    getFirstParagraph: PropTypes.any,
    summaryPanelElementId: PropTypes.any,
    weeklyHoursLoading: PropTypes.any,
    weeklyHoursError: PropTypes.any,
    weeklyHours: PropTypes.any,
    isMobileView: PropTypes.any,
};

const SpaceDetails = ({
    weeklyHours,
    weeklyHoursLoading,
    weeklyHoursError,
    bookableSpace,
    collapsed = false,
    isExpanded = false,
    // collapsed=true: called by sidebar, has open-close icon;
    // collapsed=false: opens from icon in map, no open-close icon
    onToggle = null,
    showToggle = true,
    isFavouriteActionInProgress = false,
    spacesFavouritesList = null,
}) => {
    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down('sm')) || false;
    // const _isTabletViewJust = useMediaQuery(theme.breakpoints.down('lg')) || false;
    // const isTabletView = isMobileView ? false : _isTabletViewJust;
    // const isDesktopView = !isTabletView && !isMobileView;

    const isCollapsed = collapsed ? !isExpanded : false;

    const visibleOutage = React.useMemo(
        () => getVisibleSpaceOutage(bookableSpace?.space_outages),
        [bookableSpace?.space_outages],
    );

    const summaryPanelElementId = spaceId => `summary-info-${spaceId}`;

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

    const getDescriptionClassName = () => {
        if (!!isMobileView) {
            return 'hasMaxHeight'; // on mobile we make the description scrollable, in a desperate attempt to keep the popup height reasonable
        }
        if (isCollapsed) {
            return 'truncated'; // main view can be shortened
        }
        // return 'hasMinWidth';
        return '';
    };
    const getFirstParagraph = htmlString => {
        if (!htmlString) {
            return htmlString;
        }

        // find the string before the second html tag in the supplied string
        const lookForString = '<';
        const instanceInString = 3; // #3 is <p></p> here -> <p>
        return htmlString?.split(lookForString, instanceInString)?.join(lookForString);
    };
    // taken from uqbookit sidenav for the page these land on

    const isBookable = !!bookableSpace?.space_external_book_url;
    const isSelectedSpaceFavourite = spacesFavouritesList?.some(fav => fav.space_id === bookableSpace?.space_id);
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
                        isBookable={isBookable}
                        // uqBookitMakeABookingIcon={uqBookitMakeABookingIcon}
                        getDescriptionClassName={getDescriptionClassName}
                        getFirstParagraph={getFirstParagraph}
                        summaryPanelElementId={summaryPanelElementId}
                        weeklyHoursLoading={weeklyHoursLoading}
                        weeklyHoursError={weeklyHoursError}
                        weeklyHours={weeklyHours}
                        isMobileView={isMobileView}
                    />
                )}
                {!isCollapsed && (
                    <JourneySpaceDetailsView
                        weeklyHours={weeklyHours}
                        weeklyHoursLoading={weeklyHoursLoading}
                        weeklyHoursError={weeklyHoursError}
                        selectedSpace={bookableSpace}
                        isSelectedSpaceFavourite={isSelectedSpaceFavourite}
                        isFavouriteActionInProgress={isFavouriteActionInProgress}
                        showMap={false}
                        showBackButton={false}
                        narrowView
                    />
                )}
            </StyledSpaceDiv>
        </div>
    );
};

SpaceDetails.propTypes = {
    weeklyHours: PropTypes.any,
    weeklyHoursLoading: PropTypes.bool,
    weeklyHoursError: PropTypes.any,
    bookableSpace: PropTypes.any,
    collapsed: PropTypes.bool,
    isExpanded: PropTypes.bool,
    onToggle: PropTypes.func,
    showToggle: PropTypes.bool,
    isFavouriteActionInProgress: PropTypes.bool,
    spacesFavouritesList: PropTypes.Array,
};

export default React.memo(SpaceDetails);

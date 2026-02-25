import React from 'react';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';

import IconButton from '@mui/material/IconButton';
import { styled, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { OpeningHoursDown } from './OpeningHoursDown';
import { OpeningHoursShort } from './OpeningHoursShort';
import { OpeningHoursTable } from './OpeningHoursTable';
import { getFriendlyLocationDescription } from 'modules/Pages/BookableSpaces/spacesHelpers';
import { addClass, removeClass } from 'helpers/general';
import useMediaQuery from '@mui/material/useMediaQuery';

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
const StyledLocationImg = styled('img')(({ theme }) => ({
    maxWidth: '100%',
    marginTop: '1rem',
    '&.hasMinWidth': {
        minWidth: '400px',
    },
    [theme.breakpoints.down('sm')]: {
        display: 'none',
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

const SpaceDetails = ({
    weeklyHours,
    weeklyHoursLoading,
    weeklyHoursError,
    bookableSpace,
    collapsed = false,
    // collapsed=true: called by sidebar, has open-close icon;
    // collapsed=false: opens from icon in map, no open-close icon
}) => {
    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down('sm')) || false;
    // const _isTabletViewJust = useMediaQuery(theme.breakpoints.down('lg')) || false;
    // const isTabletView = isMobileView ? false : _isTabletViewJust;
    // const isDesktopView = !isTabletView && !isMobileView;
    // console.log('BookableSpacesList window width (m, t, d):', isMobileView, isTabletView, isDesktopView);

    const [isCollapsed, setIsCollapsed] = React.useState(collapsed);

    const summaryPanelElementId = spaceId => `summary-info-${spaceId}`;

    const showHideSpacePanel = bookableSpace => {
        const hidePanel = (panelId, classname = 'hiddenSection') => {
            const openPanel = document.getElementById(panelId);
            addClass(openPanel, classname);
        };
        const showPanel = (panelId, classname = 'hiddenSection') => {
            const closedPanel = document.getElementById(panelId);
            removeClass(closedPanel, classname);
        };

        const spaceExtraElementsId = spaceId => `space-more-${spaceId}`;
        const spaceDescriptionElementsId = spaceId => `space-description-${spaceId}`;
        const togglePanelButtonElementId = spaceId => `toggle-panel-button-space-${spaceId}`;
        const expandSpace = (spaceId, spaceName) => {
            hidePanel(summaryPanelElementId(spaceId));
            showPanel(spaceExtraElementsId(spaceId));

            const spaceDescription = document.getElementById(spaceDescriptionElementsId(spaceId));
            removeClass(spaceDescription, 'truncated');

            const toggleButton = document.getElementById(togglePanelButtonElementId(spaceId));
            toggleButton?.setAttribute('aria-expanded', true);
            toggleButton?.setAttribute('aria-label', `Show fewer details for ${spaceName}`);
            const toggleButtonExpandIcon = toggleButton.querySelector('svg.closePanel');
            !!toggleButtonExpandIcon && (toggleButtonExpandIcon.style.display = 'none');
            const toggleButtonCollapseIcon = toggleButton.querySelector('svg.openPanel');
            !!toggleButtonCollapseIcon && (toggleButtonCollapseIcon.style.display = 'block');

            setIsCollapsed(false);
        };
        const collapseSpace = (spaceId, spaceName) => {
            showPanel(summaryPanelElementId(spaceId));
            hidePanel(spaceExtraElementsId(spaceId));

            const spaceDescription = document.getElementById(spaceDescriptionElementsId(spaceId));
            addClass(spaceDescription, 'truncated');

            const toggleButton = document.querySelector(`#${togglePanelButtonElementId(spaceId)}`);
            toggleButton?.setAttribute('aria-expanded', false);
            toggleButton?.setAttribute('aria-label', `Show more information about ${spaceName}`);
            const toggleButtonExpandIcon = document.querySelector(
                `#${togglePanelButtonElementId(spaceId)} svg.closePanel`,
            );
            !!toggleButtonExpandIcon && (toggleButtonExpandIcon.style.display = 'block');
            const toggleButtonCollapseIcon = document.querySelector(
                `#${togglePanelButtonElementId(spaceId)} svg.openPanel`,
            );
            !!toggleButtonCollapseIcon && (toggleButtonCollapseIcon.style.display = 'none');

            setIsCollapsed(true);
        };
        const toggleSpace = (spaceId, spaceName) => {
            const moreInfoPanel = document.getElementById(spaceExtraElementsId(spaceId));
            if (moreInfoPanel?.classList?.contains('hiddenSection')) {
                expandSpace(spaceId, spaceName);
            } else {
                collapseSpace(spaceId, spaceName);
            }
        };
        return (
            <IconButton
                id={togglePanelButtonElementId(bookableSpace?.space_id)}
                data-testid={`space-${bookableSpace?.space_id}-toggle-panel-button`}
                onClick={() => toggleSpace(bookableSpace?.space_id, bookableSpace?.space_name)}
                aria-label={`Show more information about ${bookableSpace?.space_name}`}
                aria-haspopup="true"
                aria-expanded={`${isCollapsed ? 'false' : 'true'}`}
                aria-controls={spaceExtraElementsId(bookableSpace?.space_id)}
            >
                <KeyboardArrowDownIcon style={{ display: 'block' }} className="closePanel" />
                <KeyboardArrowUpIcon style={{ display: 'none' }} className="openPanel" />
            </IconButton>
        );
    };

    const isExpanded = !isCollapsed;
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
        return htmlString.split(lookForString, instanceInString).join(lookForString);
    };
    return (
        <div id="SpaceDetailsTemp">
            <StyledSpaceDiv>
                <div style={{ float: 'right', marginTop: '-40px', marginRight: '-10px' }}>
                    {showHideSpacePanel(bookableSpace)}
                </div>
                {isCollapsed && (
                    <StyledFriendlyLocationDiv
                        data-testid={`space-${bookableSpace?.space_id}-friendly-location-collapsed`}
                    >
                        {getFriendlyLocationDescription(bookableSpace, isCollapsed)}
                    </StyledFriendlyLocationDiv>
                )}
                <div>[todo] Is bookable indicator</div>
                <div>[todo] "Up to x people" or "1 person only".</div>
                <div>[todo] Short generic description for space type</div>
                {bookableSpace?.space_description?.length > 0 && (
                    <StyledDescriptionDiv
                        id={`space-description-${bookableSpace?.space_id}`}
                        data-testid={`space-${bookableSpace?.space_id}-description`}
                        className={getDescriptionClassName()}
                    >
                        {!!isCollapsed
                            ? parse(getFirstParagraph(bookableSpace?.space_description))
                            : parse(bookableSpace?.space_description)}
                    </StyledDescriptionDiv>
                )}
                <StyledCollapsableSection
                    // loads open
                    id={summaryPanelElementId(bookableSpace?.space_id)}
                    data-testid={`space-${bookableSpace?.space_id}-summary-hours`}
                    style={{ display: isCollapsed ? null : 'none' }}
                >
                    <OpeningHoursShort
                        weeklyHoursLoading={weeklyHoursLoading}
                        weeklyHoursError={weeklyHoursError}
                        weeklyHours={weeklyHours}
                        bookableSpace={bookableSpace}
                    />
                </StyledCollapsableSection>

                <StyledCollapsableSection
                    // loads closed
                    id={`space-more-${bookableSpace?.space_id}`}
                    data-testid={`space-${bookableSpace?.space_id}-full-info`}
                    className={isCollapsed ? 'hiddenSection' : null}
                >
                    {!isMobileView && (
                        <StyledFriendlyLocationDiv data-testid={`space-${bookableSpace?.space_id}-friendly-location`}>
                            {getFriendlyLocationDescription(bookableSpace)}
                        </StyledFriendlyLocationDiv>
                    )}
                    <div>[todo] Share a location option.</div>
                    {isMobileView && (
                        <OpeningHoursDown
                            weeklyHoursLoading={weeklyHoursLoading}
                            weeklyHoursError={weeklyHoursError}
                            weeklyHours={weeklyHours}
                            bookableSpace={bookableSpace}
                        />
                    )}
                    {!isMobileView && (
                        <OpeningHoursTable
                            weeklyHoursLoading={weeklyHoursLoading}
                            weeklyHoursError={weeklyHoursError}
                            weeklyHours={weeklyHours}
                            bookableSpace={bookableSpace}
                        />
                    )}
                    {bookableSpace?.space_photo_url && (
                        <StyledLocationImg
                            src={bookableSpace?.space_photo_url}
                            alt={bookableSpace?.space_photo_description}
                            className={isCollapsed ? null : 'hasMinWidth'}
                        />
                    )}
                    {bookableSpace?.facility_types?.length > 0 && (
                        <>
                            <h4>Facilities</h4>
                            <ul className="facilityTypeList" data-testid={`space-${bookableSpace?.space_id}-facility`}>
                                {bookableSpace?.facility_types?.map(facility => {
                                    return (
                                        <li
                                            key={`space-${bookableSpace?.space_id}-facility-${facility.facility_type_id}`}
                                            data-testid={`space-${bookableSpace?.space_id}-facility-${facility.facility_type_id}`}
                                        >
                                            {facility.facility_type_name}
                                        </li>
                                    );
                                })}
                            </ul>
                        </>
                    )}
                    <div>[todo] ‘Check availability’ link to Bookit </div>
                    <div>[todo] ‘Check availability of similar rooms’ link to Bookit </div>
                </StyledCollapsableSection>
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
};

export default React.memo(SpaceDetails);

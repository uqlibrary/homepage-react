import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { ShortSpaceOpeningHours } from 'modules/Pages/BookableSpaces/ShortSpaceOpeningHours';
import { LongSpaceOpeningHours } from 'modules/Pages/BookableSpaces/LongSpaceOpeningHours';
import { getFriendlyLocationDescription } from 'modules/Pages/BookableSpaces/spacesHelpers';
import { addClass, removeClass } from 'helpers/general';

const StyledFriendlyLocationDiv = styled('div')(() => ({
    marginTop: '5px',
    '& > div': {
        marginTop: '-5px',
    },
}));
const StyledLocationPhoto = styled('img')(() => ({
    maxWidth: '100%',
    marginTop: '1rem',
}));
const StyledDescription = styled('div')(() => ({
    '&.truncated p': {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
}));
const StyledCollapsableSection = styled('div')(() => ({
    transition: 'opacity 0.3s ease-in-out, height 0.3s ease-in-out',
    '&.hiddenSection': {
        visibility: 'hidden',
        height: 0,
        opacity: 0,
    },
}));

const SpaceDetails = ({ weeklyHours, weeklyHoursLoading, weeklyHoursError, bookableSpace, collapseable = false }) => {
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
                aria-expanded="false"
                aria-controls={spaceExtraElementsId(bookableSpace?.space_id)}
            >
                <KeyboardArrowDownIcon style={{ display: 'block' }} className="closePanel" />
                <KeyboardArrowUpIcon style={{ display: 'none' }} className="openPanel" />
            </IconButton>
        );
    };

    return (
        <>
            {!!collapseable && (
                <div style={{ float: 'right', marginTop: '-40px', marginRight: '-10px' }}>
                    {showHideSpacePanel(bookableSpace)}
                </div>
            )}
            <StyledFriendlyLocationDiv data-testid={`space-${bookableSpace?.space_id}-friendly-location`}>
                {getFriendlyLocationDescription(bookableSpace)}
            </StyledFriendlyLocationDiv>
            {bookableSpace?.space_description?.length > 0 && (
                <StyledDescription
                    id={`space-description-${bookableSpace?.space_id}`}
                    data-testid={`space-${bookableSpace?.space_id}-description`}
                    className={'truncated'}
                >
                    <p>{bookableSpace?.space_description}</p>
                </StyledDescription>
            )}
            <StyledCollapsableSection
                // loads open
                id={summaryPanelElementId(bookableSpace?.space_id)}
                data-testid={`space-${bookableSpace?.space_id}-summary-info`}
            >
                <ShortSpaceOpeningHours
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
                className={'hiddenSection'}
            >
                <LongSpaceOpeningHours
                    weeklyHoursLoading={weeklyHoursLoading}
                    weeklyHoursError={weeklyHoursError}
                    weeklyHours={weeklyHours}
                    bookableSpace={bookableSpace}
                />
                {bookableSpace?.space_photo_url && (
                    <StyledLocationPhoto
                        src={bookableSpace?.space_photo_url}
                        alt={bookableSpace?.space_photo_description}
                    />
                )}
                {bookableSpace?.facility_types?.length > 0 && (
                    <>
                        <h3>Facilities</h3>
                        <ul data-testid={`space-${bookableSpace?.space_id}-facility`}>
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
            </StyledCollapsableSection>
        </>
    );
};

SpaceDetails.propTypes = {
    weeklyHours: PropTypes.any,
    weeklyHoursLoading: PropTypes.bool,
    weeklyHoursError: PropTypes.any,
    bookableSpace: PropTypes.any,
    collapseable: PropTypes.bool,
};

export default React.memo(SpaceDetails);

import React from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import { Grid, InputLabel } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CloseIcon from '@mui/icons-material/Close';
import ReplayIcon from '@mui/icons-material/Replay';

import { breadcrumbs } from 'config/routes';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { standardText } from 'helpers/general';

import { LongSpaceOpeningHours } from './LongSpaceOpeningHours';
import { ShortSpaceOpeningHours } from './ShortSpaceOpeningHours';
import {
    getFilteredFacilityTypeList,
    getFlatFacilityTypeList,
    getFriendlyLocationDescription,
} from 'modules/Pages/BookableSpaces/spacesHelpers';

const standardDivider = '1px solid #dcdcdd';

const svgOrangeCheckbox =
    "data:image/svg+xml,%3Csvg width='100%25' height='100%25' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMidYMid meet' focusable='false'%3E%3Cpath fill='%23c13e2a' d='M22.2,20.9l-1.3-1.3C21,19.4,21,19.2,21,19v-8h-2v6.7l-4.6-4.6l6-6l-1.4-1.4l-6,6L6.3,5H15V3H5C4.8,3,4.6,3,4.4,3.1L3,1.7L1.8,2.9l1.3,1.3C3.1,4.4,3,4.7,3,5v14c0,1.1,0.9,2,2,2h14c0.3,0,0.6-0.1,0.8-0.2l1.2,1.2L22.2,20.9z M5,19V6l6.9,6.9l-1.4,1.4l-3.1-3.1L6,12.6l4.5,4.5l2.8-2.8L18,19H5z'%3E%3C/path%3E%3C/svg%3E";
const visibleRejectedCheckbox = {
    backgroundImage: `url("${svgOrangeCheckbox}")`,
    backgroundRepeat: 'no-repeat',
    display: 'inline-block',
    padding: 0,
    height: '40px',
    width: '40px',
    backgroundSize: '50%',
    paddingLeft: '6px',
    marginTop: '8px',
    marginBottom: '-8px',
    marginLeft: '5px',
    cursor: 'pointer',
};

const StyledFullPageStandardCard = styled(StandardCard)(() => ({
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
const StyledStandardCard = styled(StandardCard)(({ theme }) => ({
    ...standardText(theme),
    fontWeight: '400 !important',
    '& .MuiCardHeader-root': {
        paddingBottom: 0,
    },
    '& .MuiCardContent-root': {
        paddingBlock: 0,
    },
}));

const StyledInputListItem = styled('li')(({ theme }) => ({
    listStyle: 'none',
    paddingLeft: 0,
    display: 'flex',
    '& label': {
        ...standardText(theme),
        display: 'inline',
        '& span:last-of-type': {
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
        },
    },
    // when we hover or focus on the reject-checkbox, style the label to be orange
    '&:hover label.rejectedFacilityTypeLabel': visibleRejectedCheckbox,
    '&:focus label.rejectedFacilityTypeLabel': visibleRejectedCheckbox,
    '&:has(> input:checked) label.rejectedFacilityTypeLabel': visibleRejectedCheckbox,
    '&:has(> input:inline-focus) label.rejectedFacilityTypeLabel': visibleRejectedCheckbox,
    '@media (pointer:coarse)': {
        // show the reject checkbox on mobile, as they can't hover
        'label.rejectedFacilityTypeLabel': visibleRejectedCheckbox,
    },
    '& input.rejectedFilterType': {
        display: 'none',
    },
    '& span:not(.fortestfocus)': {
        cursor: 'pointer',
    },
    '& .selectedFilterType': {
        paddingBlock: '0.5rem',
    },
    '& .selectedFilterTypeLabel': {
        display: 'inline-flex',
        alignItems: 'center',
    },
}));
const StyledBookableSpaceGridItem = styled(Grid)(() => ({
    marginTop: '12px',
}));
const StyledSidebarGridItem = styled(Grid)(() => ({
    position: 'sticky',
    top: 0,
    maxHeight: 'calc(100%-340px)', // 340 is height of headers above page content
    overflowY: 'auto',
    paddingInline: '1em',
    marginBlock: '1em',
    direction: 'rtl', // put the scroll bar on the left
    paddingRight: 0,
    '& > div': {
        direction: 'ltr',
    },
    '&::-webkit-scrollbar': {
        width: '8px',
    },
    '&::-webkit-scrollbar-track': {
        background: '#f1f1f1',
        borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
        background: '#c1c1c1',
        borderRadius: '4px',
        '&:hover': {
            background: '#a8a8a8',
        },
    },
    // Firefox scrollbar styling
    scrollbarWidth: 'thin',
    scrollbarColor: '#c1c1c1 #f1f1f1',
    '& > button': {
        margin: '0 0.5rem 0.5rem 0',
        display: 'inline-flex',
        alignItems: 'center',
        textTransform: 'none',
        textDecoration: 'underline',
        padding: '0.1rem 0.25rem 0.1rem 0',
        lineHeight: 'normal',
        '&:hover, &:focus': {
            backgroundColor: 'transparent',
        },
        '& span': {
            marginLeft: '0.25rem',
            '&:hover, &:focus': {
                backgroundColor: '#51247a',
                color: '#fff',
            },
        },
    },
}));
const StyledFacilityGroup = styled('div')(() => ({
    borderBottom: standardDivider,
    paddingBlock: '16px',
    '& h3': {
        marginTop: 0,
    },
    '& ul': {
        marginBottom: 0,
    },
}));
const StyledFilterSpaceListTypographyHeading = styled('h3')(() => ({
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 0,
    '& .countSelectedCheckboxes': {
        paddingLeft: '0.5rem',
        fontSize: '0.75rem',
        fontWeight: 400,
        fontStyle: 'italic',
    },
}));
const StyledSidebarDiv = styled('div')(() => ({
    '& > div:first-of-type': {
        borderTop: standardDivider,
        marginTop: '16px',
    },
    '& .hiddenFilters': {
        display: 'none',
    },
}));
const StyledFilterSpaceList = styled('ul')(() => ({
    marginTop: 0,
    paddingLeft: 0,
    paddingTop: 0,
}));
const StyledCartoucheList = styled('ul')(({ theme }) => ({
    listStyle: 'none',
    display: 'inline',
    margin: 0,
    padding: 0,
    '& li': {
        listStyle: 'none',
        display: 'inline',
        margin: 0,
        padding: 0,
        '& button': {
            margin: '0 0.5rem 0.5rem 0',
            display: 'inline-flex',
            alignItems: 'center',
            borderRadius: '12px',
            border: `1px solid ${theme.palette.primary.main}`,
            textTransform: 'none !important',
            padding: '0.1rem 0.25rem 0.1rem 0.5rem',
            '&.unselectedFilter span': {
                textDecoration: 'line-through',
            },
            '&:hover, :focus': {
                backgroundColor: '#fff',
                '& span': {
                    textDecoration: 'underline',
                },
                '&.unselectedFilter span': {
                    textDecoration: 'underline line-through',
                },
            },
            '& svg': {
                width: '0.7em',
                height: '0.7em',
            },
        },
    },
}));
const StyledLocationPhoto = styled('img')(() => ({
    maxWidth: '100%',
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

const showHideSpacePanel = bookableSpace => {
    const hidePanel = (panelId, classname = 'hiddenSection') => {
        const openPanel = document.getElementById(panelId);
        !!openPanel && !openPanel.classList.contains(classname) && openPanel.classList.add(classname);
    };
    const showPanel = (panelId, classname = 'hiddenSection') => {
        const closedPanel = document.getElementById(panelId);
        !!closedPanel && closedPanel.classList.contains(classname) && closedPanel.classList.remove(classname);
    };

    const spaceExtraElementsId = spaceId => `space-more-${spaceId}`;
    const summaryPanelElementId = spaceId => `summary-info-${spaceId}`;
    const spaceDescriptionElementsId = spaceId => `space-description-${spaceId}`;
    const togglePanelButtonElementId = spaceId => `toggle-panel-button-space-${spaceId}`;
    const expandSpace = (spaceId, spaceName) => {
        hidePanel(summaryPanelElementId(spaceId));
        showPanel(spaceExtraElementsId(spaceId));

        const spaceDescription = document.getElementById(spaceDescriptionElementsId(spaceId));
        !!spaceDescription &&
            spaceDescription.classList.contains('truncated') &&
            spaceDescription.classList.remove('truncated');

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
        !!spaceDescription &&
            !spaceDescription.classList.contains('truncated') &&
            spaceDescription.classList.add('truncated');

        const toggleButton = document.querySelector(`#${togglePanelButtonElementId(spaceId)}`);
        toggleButton?.setAttribute('aria-expanded', false);
        toggleButton?.setAttribute('aria-label', `Show more information about ${spaceName}`);
        const toggleButtonExpandIcon = document.querySelector(`#${togglePanelButtonElementId(spaceId)} svg.closePanel`);
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

export const BookableSpacesList = ({
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
    console.log('RERENDER!!!!!');
    console.log(
        'BookableSpacesList load facilityTypeList:',
        facilityTypeListLoading,
        facilityTypeListError,
        facilityTypeList,
    );
    console.log('BookableSpacesList load weeklyHours:', weeklyHoursLoading, weeklyHoursError, weeklyHours);

    const [facilityTypeFilterGroupOpenNess, setFacilityTypeFilterGroupOpenNess2] = React.useState([]);
    const setFacilityTypeFilterGroupOpenNess = list => {
        console.log('loadsopen: setFacilityTypeFilterGroupOpenNess', list);
        setFacilityTypeFilterGroupOpenNess2(list);
    };
    const resetFacilityTypeFilterGroupOpenNess = (filterGroupId, isGroupOpenInput) => {
        const newOpenness = facilityTypeFilterGroupOpenNess.filter(g => {
            return g.groupId !== filterGroupId;
        });
        newOpenness.push({
            groupId: filterGroupId,
            isGroupOpen: isGroupOpenInput,
        });
        setFacilityTypeFilterGroupOpenNess(newOpenness);
    };

    const [facilityTypeFilters, setFacilityTypeFilters2] = React.useState([]);
    const setFacilityTypeFilters = data => {
        console.log('setFacilityTypeFilters', data);
        setFacilityTypeFilters2(data);
    };
    const setFilters = (facilityTypeId, isSelected, isUnselected) => {
        const removedFilter = facilityTypeFilters?.find(ftf => {
            return ftf.facility_type_id === facilityTypeId;
        });
        const newFilters = facilityTypeFilters?.filter(ftf => {
            return ftf.facility_type_id !== facilityTypeId;
        });
        newFilters.push({
            facility_type_group_id: removedFilter.facility_type_group_id,
            facility_type_id: facilityTypeId,
            selected: isSelected,
            unselected: isUnselected,
        });
        setFacilityTypeFilters(newFilters);
    };

    React.useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.setAttribute('secondleveltitle', breadcrumbs.bookablespaces.title);
        !!siteHeader && siteHeader.setAttribute('secondLevelUrl', breadcrumbs.bookablespaces.pathname);
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
    React.useEffect(() => {
        if (
            facilityTypeListError === false &&
            facilityTypeListLoading === false &&
            facilityTypeList?.data?.facility_type_groups?.length > 0 &&
            facilityTypeFilters?.length === 0
        ) {
            // Filter the facility type list
            const filteredFacilityTypeList = getFilteredFacilityTypeList(bookableSpacesRoomList, facilityTypeList);

            // initialise openness storage
            const openNessList = [];
            filteredFacilityTypeList?.data?.facility_type_groups?.map(g => {
                openNessList.push({
                    groupId: g.facility_type_group_id,
                    isGroupOpen: g.facility_type_group_loads_open,
                });
            });
            setFacilityTypeFilterGroupOpenNess(openNessList);

            const flatFacilityTypeList = getFlatFacilityTypeList(filteredFacilityTypeList);
            const newFilters = flatFacilityTypeList.map(facilityType => ({
                facility_type_group_id: facilityType.facility_type_group_id,
                facility_type_id: facilityType.facility_type_id,
                selected: false,
                unselected: false,
            }));
            setFacilityTypeFilters(newFilters);
        }
    }, [facilityTypeListError, facilityTypeListLoading, facilityTypeList, facilityTypeFilters, bookableSpacesRoomList]);

    const getSpaceId = spaceId => {
        return `space-${spaceId}`;
    };

    function showSpace(spaceFacilityTypes, facilityTypeToGroup, facilityTypeFilters) {
        // Create a map of facility_type_id to group_id for quick lookup
        // Group selected filters by their facility type group
        const selectedFiltersByGroup = {};
        const rejectedFilters = [];

        facilityTypeFilters?.forEach(filter => {
            if (filter.selected) {
                const groupId = facilityTypeToGroup[filter.facility_type_id];
                if (groupId) {
                    if (!selectedFiltersByGroup[groupId]) {
                        selectedFiltersByGroup[groupId] = [];
                    }
                    selectedFiltersByGroup[groupId].push(filter.facility_type_id);
                }
            }

            // Collect rejected facility types
            if (filter.unselected) {
                rejectedFilters.push(filter.facility_type_id);
            }
        });

        // check if space should be excluded due to rejected facility types
        if (rejectedFilters.length > 0) {
            const hasRejectedFacility = rejectedFilters.some(rejectedId => spaceFacilityTypes?.includes(rejectedId));
            if (hasRejectedFacility) {
                return false;
            }
        }

        // If no inclusion filters are selected, show all spaces (that haven't been rejected)
        if (Object.keys(selectedFiltersByGroup).length === 0) {
            return true;
        }

        // AND between groups
        for (const groupId in selectedFiltersByGroup) {
            const selectedFiltersInGroup = selectedFiltersByGroup[groupId];

            // OR within group
            const hasMatchInGroup = selectedFiltersInGroup.some(filterId => spaceFacilityTypes?.includes(filterId));
            if (!hasMatchInGroup) {
                return false;
            }
        }
        return true;
    }

    // hide listitems that are checked
    const showHideActiveFilterListItems = (facilityTypeId, e) => {
        const listItemId = `facility-type-listitem-${facilityTypeId}`;
        console.log(
            'showHideActiveFilterListItems facilityTypeId=',
            facilityTypeId,
            'checked=',
            e.target.checked,
            'listItemId=',
            listItemId,
            e.target,
        );
        const listItemElement = document.getElementById(listItemId);
        !!e.target.checked &&
            !!listItemElement &&
            !listItemElement.classList.contains('checkedCheckbox') &&
            listItemElement.classList.add('checkedCheckbox') &&
            console.log('showHideActiveFilterListItems add checkedCheckbox');
        !e.target.checked &&
            !!listItemElement &&
            !!listItemElement.classList.contains('checkedCheckbox') &&
            listItemElement.classList.remove('checkedCheckbox') &&
            console.log('showHideActiveFilterListItems remove checkedCheckbox');
    };

    const scrollToTopOfContent = () => {
        const topOfPage = document.getElementById('topofcontent');
        !!topOfPage && typeof topOfPage.scrollIntoView === 'function' && topOfPage.scrollIntoView();

        const topOfSidebar = document.getElementById('topOfSidebar');
        !!topOfSidebar &&
            typeof topOfSidebar.scrollIntoView === 'function' &&
            topOfSidebar.scrollIntoView({
                behavior: 'smooth',
            });
        !!topOfSidebar && topOfSidebar.focus();
    };

    const handleFilterRejection = (e, facilityTypeId) => {
        showHideActiveFilterListItems(facilityTypeId, e);

        setFilters(facilityTypeId, false, !!e.target.checked);

        scrollToTopOfContent();
    };

    const handleFilterSelection = (e, facilityTypeId) => {
        showHideActiveFilterListItems(facilityTypeId, e);

        setFilters(facilityTypeId, !!e.target.checked, false);

        scrollToTopOfContent();
    };

    const toggleFilterGroup = filterGroupId => {
        const filterGroupPanelVisible = document.getElementById(`filter-group-list-${filterGroupId}`);
        // reverse the panel show/ hide
        resetFacilityTypeFilterGroupOpenNess(filterGroupId, !filterGroupPanelVisible);
    };

    const spacePanel = bookableSpace => {
        return (
            <>
                <div style={{ float: 'right', marginTop: '-40px', marginRight: '-10px' }}>
                    {showHideSpacePanel(bookableSpace)}
                </div>
                <div data-testid={`space-${bookableSpace?.space_id}-friendly-location`}>
                    {getFriendlyLocationDescription(bookableSpace)}
                </div>
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
                    id={`summary-info-${bookableSpace?.space_id}`}
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
                    data-testid={`space-${bookableSpace?.space_id}-collapsible`}
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
    const deSelectSelected = e => {
        const button = e?.target.closest('button');
        const facilityTypeId = parseInt(button.id.replace('button-deselect-selected-', ''), 10);
        console.log('deSelectSelected button=', facilityTypeId, button);

        showHideActiveFilterListItems(facilityTypeId, e);

        setFilters(facilityTypeId, false, false);
    };
    const deSelectAll = () => {
        // reset the facility types to all false - the render will clear the buttons and checkboxes for us!
        const newFacilityTypes = facilityTypeFilters?.map(ft => {
            return {
                facility_type_id: ft.facility_type_id,
                selected: false,
                unselected: false,
            };
        });
        setFacilityTypeFilters(newFacilityTypes);
    };
    const showFilterSidebar = () => {
        if (facilityTypeList?.data?.facility_type_groups?.length === 0) {
            return null;
        }

        const filteredFacilityTypeList = getFilteredFacilityTypeList(bookableSpacesRoomList, facilityTypeList);
        const sortedUsedGroups =
            !!filteredFacilityTypeList?.data?.facility_type_groups &&
            filteredFacilityTypeList?.data?.facility_type_groups.length > 0
                ? [...filteredFacilityTypeList?.data?.facility_type_groups].sort(
                      (a, b) => a.facility_type_group_order - b.facility_type_group_order,
                  )
                : [];

        const hasActiveFilters = facilityTypeFilters?.some(f => !!f.selected || !!f.unselected);

        const flatFacilityTypeList = getFlatFacilityTypeList(filteredFacilityTypeList);
        const checkFiltersList = facilityTypeFilters?.filter(f => !!f.selected || !!f.unselected);
        return (
            <>
                {!!hasActiveFilters && (
                    <>
                        <Typography component={'h3'} variant={'h6'}>
                            Active filters
                        </Typography>
                        <StyledCartoucheList id={'button-deselect-list'} data-testid={'button-deselect-list'}>
                            {facilityTypeFilters?.map(f => {
                                if (!!f.selected) {
                                    const facilityTypeRecord = flatFacilityTypeList.find(
                                        flat => flat.facility_type_id === f.facility_type_id,
                                    );
                                    return (
                                        <li key={`cartouche-select-${f.facility_type_id}`}>
                                            <Button
                                                id={`button-deselect-selected-${f.facility_type_id}`}
                                                data-testid={`button-deselect-selected-${f.facility_type_id}`}
                                                onClick={deSelectSelected}
                                                className="selectedFilter"
                                                title={`${facilityTypeRecord.facility_type_name} selected - click to deselect`}
                                            >
                                                <span>{facilityTypeRecord?.facility_type_name}</span> <CloseIcon />
                                            </Button>
                                        </li>
                                    );
                                }
                                if (!!f.unselected) {
                                    const facilityTypeRecord = flatFacilityTypeList.find(
                                        flat => flat.facility_type_id === f.facility_type_id,
                                    );
                                    return (
                                        <li key={`cartouche-unselect-${f.facility_type_id}`}>
                                            <Button
                                                id={`button-deselect-selected-${f.facility_type_id}`}
                                                data-testid={`button-deselect-unselected-${f.facility_type_id}`}
                                                onClick={deSelectSelected}
                                                className="unselectedFilter"
                                                aria-label={`${facilityTypeRecord.facility_type_name} excluded - click to deselect`}
                                            >
                                                <span>{facilityTypeRecord?.facility_type_name}</span> <CloseIcon />
                                            </Button>
                                        </li>
                                    );
                                }
                                return null;
                            })}
                        </StyledCartoucheList>
                        {checkFiltersList?.length > 0 && (
                            <Button
                                id={'button-deselect-all-filters'}
                                data-testid={'button-deselect-all-filters'}
                                onClick={deSelectAll}
                            >
                                <ReplayIcon />
                                <span>Remove all filters</span>
                            </Button>
                        )}
                    </>
                )}
                <StyledSidebarDiv data-testid="sidebarCheckboxes">
                    <a href="#space-wrapper" className="showsOnlyOnFocus" data-testid="skip-to-spaces-list">
                        Skip to list of Spaces
                    </a>
                    <Typography component={'h2'} variant={'h6'} id="topOfSidebar">
                        Filter Spaces
                    </Typography>
                    {sortedUsedGroups?.map(group => {
                        const filterGroupId = group.facility_type_group_id;
                        const isGroupOpen = !!facilityTypeFilterGroupOpenNess.find(o => o.groupId === filterGroupId)
                            ?.isGroupOpen;
                        const groupLength = facilityTypeFilters.filter(
                            ftf => ftf.facility_type_group_id === filterGroupId,
                        ).length;
                        const numberChecked = facilityTypeFilters.filter(
                            ftf => ftf.facility_type_group_id === filterGroupId && (ftf.selected || ftf.unselected),
                        ).length;
                        return (
                            <StyledFacilityGroup
                                key={`facility-group-${filterGroupId}`}
                                data-testid={`filter-group-block-${filterGroupId}`}
                            >
                                <StyledFilterSpaceListTypographyHeading
                                    component={'h3'}
                                    variant={'h6'}
                                    className="group-heading"
                                >
                                    {group.facility_type_group_name}{' '}
                                    {!isGroupOpen && numberChecked > 0 && (
                                        <span
                                            className="countSelectedCheckboxes"
                                            data-testid={`facility-type-group-${filterGroupId}-open-count`}
                                        >
                                            ({numberChecked} of {groupLength})
                                        </span>
                                    )}
                                    <IconButton
                                        id={`facility-type-group-${filterGroupId}`}
                                        data-testid={`facility-type-group-${filterGroupId}`}
                                        onClick={() => toggleFilterGroup(filterGroupId)}
                                        aria-label={
                                            !!isGroupOpen
                                                ? `Hide ${group.facility_type_group_name} filter options`
                                                : `Show ${group.facility_type_group_name} filter options`
                                        }
                                        aria-haspopup="true"
                                        aria-expanded={!!isGroupOpen ? 'true' : 'false'}
                                        aria-controls={`filter-group-list-${filterGroupId}`}
                                    >
                                        <KeyboardArrowDownIcon
                                            style={{ display: !!isGroupOpen ? 'block' : 'none' }}
                                            className="openGroup"
                                            data-testid={`facility-type-group-${filterGroupId}-open`}
                                        />
                                        <KeyboardArrowUpIcon
                                            style={{ display: !!isGroupOpen ? 'none' : 'block' }}
                                            className="closeGroup"
                                            data-testid={`facility-type-group-${filterGroupId}-collapsed`}
                                        />
                                    </IconButton>
                                </StyledFilterSpaceListTypographyHeading>
                                {!!isGroupOpen && (
                                    <StyledFilterSpaceList id={`filter-group-list-${filterGroupId}`}>
                                        {group.facility_type_children && group.facility_type_children.length > 0 ? (
                                            group.facility_type_children?.map(facilityType => (
                                                <StyledInputListItem
                                                    key={`facility-type-listitem-${facilityType.facility_type_id}`}
                                                    id={`facility-type-listitem-${facilityType.facility_type_id}`}
                                                    data-testid={`facility-type-listitem-${facilityType.facility_type_id}`}
                                                >
                                                    <InputLabel
                                                        title={`Only show Spaces with ${facilityType.facility_type_name}`}
                                                        htmlFor={`filtertype-${facilityType.facility_type_id}`}
                                                        className="selectedFilterTypeLabel"
                                                    >
                                                        <Checkbox
                                                            onChange={e =>
                                                                handleFilterSelection(e, facilityType.facility_type_id)
                                                            }
                                                            data-testid={`filtertype-${facilityType.facility_type_id}`}
                                                            id={`filtertype-${facilityType.facility_type_id}`}
                                                            className="selectedFilterType"
                                                            checked={
                                                                facilityTypeFilters?.find(
                                                                    f1 =>
                                                                        f1.facility_type_id ===
                                                                        facilityType.facility_type_id,
                                                                )?.selected || false
                                                            }
                                                        />
                                                        <span>{facilityType.facility_type_name}</span>
                                                    </InputLabel>
                                                    <input
                                                        type="checkbox"
                                                        id={`reject-filtertype-${facilityType.facility_type_id}`}
                                                        data-testid={`reject-filtertype-${facilityType.facility_type_id}`}
                                                        className="rejectedFilterType"
                                                        onChange={e =>
                                                            handleFilterRejection(e, facilityType.facility_type_id)
                                                        }
                                                        aria-label={`Exclude Spaces with ${facilityType.facility_type_name}`}
                                                        checked={
                                                            facilityTypeFilters?.find(
                                                                f1 =>
                                                                    f1.facility_type_id ===
                                                                    facilityType.facility_type_id,
                                                            )?.unselected || false
                                                        }
                                                    />
                                                    <label
                                                        htmlFor={`reject-filtertype-${facilityType.facility_type_id}`}
                                                        className="rejectedFacilityTypeLabel"
                                                        data-testid={`reject-filtertype-label-${facilityType.facility_type_id}`}
                                                        title={`Exclude Spaces with ${facilityType.facility_type_name}`}
                                                    />
                                                    <span className="fortestfocus" style={{ width: '10px' }} />
                                                </StyledInputListItem>
                                            ))
                                        ) : (
                                            <li className="no-items">No facility types available</li>
                                        )}
                                    </StyledFilterSpaceList>
                                )}
                            </StyledFacilityGroup>
                        );
                    })}
                </StyledSidebarDiv>
            </>
        );
    };
    return (
        <StandardPage title="Library spaces" standardPageId="topofcontent">
            <section aria-live="assertive">
                <StyledFullPageStandardCard
                    standardCardId="location-list-card"
                    noPadding
                    noHeader
                    style={{ border: 'none' }}
                >
                    <Grid container spacing={3} data-testid="library-spaces">
                        {(() => {
                            if (!!bookableSpacesRoomListLoading || !!weeklyHoursLoading) {
                                return (
                                    <StyledBookableSpaceGridItem item xs={12} md={9}>
                                        <InlineLoader message="Loading" />
                                    </StyledBookableSpaceGridItem>
                                );
                            } else if (!!bookableSpacesRoomListError || !!facilityTypeListError) {
                                return (
                                    <StyledBookableSpaceGridItem item xs={12} md={9}>
                                        <StyledStandardCard fullHeight>
                                            <p data-testid="spaces-error">
                                                Something went wrong - please try again later.
                                            </p>
                                        </StyledStandardCard>
                                    </StyledBookableSpaceGridItem>
                                );
                            } else if (
                                !bookableSpacesRoomList?.data?.locations ||
                                bookableSpacesRoomList?.data?.locations?.length === 0
                            ) {
                                return (
                                    <StyledBookableSpaceGridItem item xs={12} md={9}>
                                        <StyledStandardCard fullHeight>
                                            <p data-testid="no-spaces">No locations found - please try again soon.</p>
                                        </StyledStandardCard>
                                    </StyledBookableSpaceGridItem>
                                );
                            } else {
                                const facilityTypeToGroup = {};
                                getFilteredFacilityTypeList(
                                    bookableSpacesRoomList,
                                    facilityTypeList,
                                )?.data?.facility_type_groups?.forEach(group => {
                                    group.facility_type_children.forEach(child => {
                                        facilityTypeToGroup[child.facility_type_id] = group.facility_type_group_id;
                                    });
                                });
                                const filteredSpaceLocations = bookableSpacesRoomList?.data?.locations?.filter(s => {
                                    const spaceFacilityTypes = s?.facility_types?.map(item => item.facility_type_id);
                                    return showSpace(spaceFacilityTypes, facilityTypeToGroup, facilityTypeFilters);
                                });

                                return (
                                    <>
                                        <StyledSidebarGridItem id="StyledSidebarGridItem" item xs={3}>
                                            {showFilterSidebar()}
                                        </StyledSidebarGridItem>
                                        <Grid item xs={8} md={9}>
                                            <Grid container id="space-wrapper" data-testid="space-wrapper">
                                                <a className="showsOnlyOnFocus" href="#topOfSidebar">
                                                    Skip back to list of filters
                                                </a>
                                                {filteredSpaceLocations.length === 0 && (
                                                    <Grid item xs={9} data-testid={'no-spaces-visible'}>
                                                        <p>
                                                            No Spaces match these filters - change your selection in the
                                                            sidebar to show some spaces.
                                                        </p>
                                                    </Grid>
                                                )}
                                                {filteredSpaceLocations.length > 0 &&
                                                    filteredSpaceLocations?.map(bookableSpace => {
                                                        const locationKey = getSpaceId(bookableSpace?.space_id);
                                                        return (
                                                            <StyledBookableSpaceGridItem
                                                                item
                                                                xs={12}
                                                                key={locationKey}
                                                                id={locationKey}
                                                                data-testid={locationKey}
                                                                style={{ display: 'block' }}
                                                            >
                                                                <StyledStandardCard
                                                                    fullHeight
                                                                    title={`${bookableSpace?.space_name} - ${bookableSpace?.space_type}`}
                                                                >
                                                                    {spacePanel(bookableSpace)}
                                                                </StyledStandardCard>
                                                            </StyledBookableSpaceGridItem>
                                                        );
                                                    })}
                                            </Grid>
                                        </Grid>
                                    </>
                                );
                            }
                        })()}
                    </Grid>
                </StyledFullPageStandardCard>
            </section>
        </StandardPage>
    );
};

BookableSpacesList.propTypes = {
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

export default React.memo(BookableSpacesList);

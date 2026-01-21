import React from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import { InputLabel } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CloseIcon from '@mui/icons-material/Close';
import ReplayIcon from '@mui/icons-material/Replay';

import { addClass, removeClass, standardText } from 'helpers/general';

import { getFlatFacilityTypeList } from 'modules/Pages/BookableSpaces/spacesHelpers';

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

const StyledInputListItem = styled('li')(({ theme }) => ({
    listStyle: 'none',
    paddingLeft: 0,
    marginLeft: '-9px',
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
const StyledSidebarDiv = styled('div')(() => ({
    position: 'sticky',
    top: 0,
    // maxHeight: 'calc(100%-340px)', // 340 is height of headers above page content
    overflowY: 'auto',
    paddingLeft: '1em',
    paddingRight: 0,
    marginBlock: '1em',
    marginRight: 0,
    marginLeft: '1rem',
    direction: 'rtl', // put the scroll bar on the left
    flexBasis: '10%',
    maxWidth: '16.6667%',

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
    backgroundColor: 'white',
    flexDirection: 'row',
    flexGrow: 0,
    marginTop: '0.25rem',
}));
const StyledFacilityGroup = styled('div')(({ theme }) => ({
    borderBottom: theme.palette.designSystem.border,
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
const StyledSidebarSubDiv = styled('div')(({ theme }) => ({
    '& > div:first-of-type': {
        borderTop: theme.palette.designSystem.border,
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

export const SidebarFilters = ({
    facilityTypeList,
    facilityTypeListLoading,
    facilityTypeListError,
    selectedFacilityTypes,
    setSelectedFacilityTypes,
    filteredFacilityTypeList,
}) => {
    const [facilityTypeFilterGroupOpenNess, setFacilityTypeFilterGroupOpenNess] = React.useState([]);

    React.useEffect(() => {
        if (
            facilityTypeListError === false &&
            facilityTypeListLoading === false &&
            facilityTypeList?.data?.facility_type_groups?.length > 0 &&
            selectedFacilityTypes?.length === 0
        ) {
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
            setSelectedFacilityTypes(newFilters);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    const setFilters = (facilityTypeId, isSelected, isUnselected) => {
        const removedFilter = selectedFacilityTypes?.find(ftf => {
            return ftf.facility_type_id === facilityTypeId;
        });
        const newFilters = selectedFacilityTypes?.filter(ftf => {
            return ftf.facility_type_id !== facilityTypeId;
        });
        newFilters.push({
            facility_type_group_id: removedFilter.facility_type_group_id,
            facility_type_id: facilityTypeId,
            selected: isSelected,
            unselected: isUnselected,
        });
        setSelectedFacilityTypes(newFilters);
    };

    // hide listitems that are checked
    const showHideActiveFilterListItems = (facilityTypeId, e) => {
        const listItemId = `facility-type-listitem-${facilityTypeId}`;
        const listItemElement = !!listItemId && document.getElementById(listItemId);
        if (!!listItemElement) {
            !!e.target.checked
                ? addClass(listItemElement, 'checkedCheckbox')
                : removeClass(listItemElement, 'checkedCheckbox');
        }
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

    const deSelectSelected = e => {
        const button = e?.target.closest('button');
        const facilityTypeId = parseInt(button.id.replace('button-deselect-selected-', ''), 10);

        showHideActiveFilterListItems(facilityTypeId, e);

        setFilters(facilityTypeId, false, false);
    };
    const deSelectAll = () => {
        // reset the facility types to all false - the render will clear the buttons and checkboxes for us!
        const newFacilityTypes = selectedFacilityTypes?.map(ft => {
            return {
                facility_type_id: ft.facility_type_id,
                selected: false,
                unselected: false,
            };
        });
        setSelectedFacilityTypes(newFacilityTypes);
    };
    const getStyledInputListItem = facilityType => {
        return (
            <StyledInputListItem
                key={`facility-type-listitem-${facilityType.facility_type_id}`}
                id={`facility-type-listitem-${facilityType.facility_type_id}`}
                data-testid={`facility-type-listitem-${facilityType.facility_type_id}`}
            >
                <InputLabel
                    title={`Filter in Spaces with ${facilityType.facility_type_name}`}
                    htmlFor={`filtertype-${facilityType.facility_type_id}`}
                    className="selectedFilterTypeLabel"
                >
                    <Checkbox
                        onChange={e => handleFilterSelection(e, facilityType.facility_type_id)}
                        data-testid={`filtertype-${facilityType.facility_type_id}`}
                        id={`filtertype-${facilityType.facility_type_id}`}
                        className="selectedFilterType"
                        checked={
                            selectedFacilityTypes?.find(f1 => f1.facility_type_id === facilityType.facility_type_id)
                                ?.selected || false
                        }
                    />
                    <span>{facilityType.facility_type_name}</span>
                </InputLabel>
                <input
                    type="checkbox"
                    id={`reject-filtertype-${facilityType.facility_type_id}`}
                    data-testid={`reject-filtertype-${facilityType.facility_type_id}`}
                    className="rejectedFilterType"
                    onChange={e => handleFilterRejection(e, facilityType.facility_type_id)}
                    aria-label={`Exclude Spaces with ${facilityType.facility_type_name}`}
                    checked={
                        selectedFacilityTypes?.find(f1 => f1.facility_type_id === facilityType.facility_type_id)
                            ?.unselected || false
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
        );
    };
    const showFilterGroupHeading = (group, isGroupOpen, numberChecked, filterGroupId, groupLength) => {
        return (
            <StyledFilterSpaceListTypographyHeading component={'h3'} variant={'h6'} className="group-heading">
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
        );
    };
    const showCartoucheList = flatFacilityTypeList => {
        return (
            <>
                {selectedFacilityTypes?.map(f => {
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
            </>
        );
    };

    const sortedUsedGroups =
        !!filteredFacilityTypeList?.data?.facility_type_groups &&
        filteredFacilityTypeList?.data?.facility_type_groups.length > 0
            ? [...filteredFacilityTypeList?.data?.facility_type_groups].sort(
                  (a, b) => a.facility_type_group_order - b.facility_type_group_order,
              )
            : [];

    const hasActiveFilters = selectedFacilityTypes?.some(f => !!f.selected || !!f.unselected);

    const flatFacilityTypeList = getFlatFacilityTypeList(filteredFacilityTypeList);
    const checkFiltersList = selectedFacilityTypes?.filter(f => !!f.selected || !!f.unselected);

    return (
        <>
            {(() => {
                if (facilityTypeList?.data?.facility_type_groups?.length === 0) {
                    return null;
                } else {
                    return (
                        <StyledSidebarDiv>
                            {!!hasActiveFilters && (
                                <>
                                    <Typography component={'h3'} variant={'h6'}>
                                        Active filters
                                    </Typography>
                                    <StyledCartoucheList
                                        id={'button-deselect-list'}
                                        data-testid={'button-deselect-list'}
                                    >
                                        {showCartoucheList(flatFacilityTypeList)}
                                    </StyledCartoucheList>
                                    {checkFiltersList?.length > 0 && (
                                        <Button
                                            id={'button-deselect-all-filters'}
                                            data-testid={'button-deselect-all-filters'}
                                            onClick={deSelectAll}
                                            style={{ direction: 'ltr' }}
                                        >
                                            <ReplayIcon style={{ fontSize: '16px' }} />
                                            <span>Remove all filters</span>
                                        </Button>
                                    )}
                                </>
                            )}
                            <StyledSidebarSubDiv data-testid="sidebarCheckboxes">
                                <a href="#space-wrapper" className="showsOnlyOnFocus" data-testid="skip-to-spaces-list">
                                    Skip to list of Spaces
                                </a>
                                <Typography
                                    component={'h2'}
                                    variant={'h6'}
                                    id="topOfSidebar"
                                    data-testid="topOfSidebar"
                                >
                                    Filter Spaces
                                </Typography>
                                {sortedUsedGroups?.map(group => {
                                    const filterGroupId = group.facility_type_group_id;
                                    const isGroupOpen = !!facilityTypeFilterGroupOpenNess.find(
                                        o => o.groupId === filterGroupId,
                                    )?.isGroupOpen;
                                    const groupLength = selectedFacilityTypes.filter(
                                        ftf => ftf.facility_type_group_id === filterGroupId,
                                    ).length;
                                    const numberChecked = selectedFacilityTypes.filter(
                                        ftf =>
                                            ftf.facility_type_group_id === filterGroupId &&
                                            (ftf.selected || ftf.unselected),
                                    ).length;
                                    return (
                                        <StyledFacilityGroup
                                            key={`facility-group-${filterGroupId}`}
                                            data-testid={`filter-group-block-${filterGroupId}`}
                                        >
                                            {showFilterGroupHeading(
                                                group,
                                                isGroupOpen,
                                                numberChecked,
                                                filterGroupId,
                                                groupLength,
                                            )}
                                            {!!isGroupOpen && (
                                                <StyledFilterSpaceList id={`filter-group-list-${filterGroupId}`}>
                                                    {group.facility_type_children &&
                                                    group.facility_type_children.length > 0 ? (
                                                        group.facility_type_children?.map(facilityType =>
                                                            getStyledInputListItem(facilityType),
                                                        )
                                                    ) : (
                                                        <li className="no-items">No facility types available</li>
                                                    )}
                                                </StyledFilterSpaceList>
                                            )}
                                        </StyledFacilityGroup>
                                    );
                                })}
                            </StyledSidebarSubDiv>
                        </StyledSidebarDiv>
                    );
                }
            })()}
        </>
    );
};

SidebarFilters.propTypes = {
    facilityTypeList: PropTypes.any,
    facilityTypeListLoading: PropTypes.any,
    facilityTypeListError: PropTypes.any,
    filteredFacilityTypeList: PropTypes.any,
    selectedFacilityTypes: PropTypes.array,
    setSelectedFacilityTypes: PropTypes.func,
};

export default React.memo(SidebarFilters);

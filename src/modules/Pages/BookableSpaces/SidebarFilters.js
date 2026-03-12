import React from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import { InputLabel } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MuiInput from '@mui/material/Input';
import { styled } from '@mui/material/styles';
import Slider from '@mui/material/Slider';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CloseIcon from '@mui/icons-material/Close';
import ReplayIcon from '@mui/icons-material/Replay';

import { addClass, removeClass, standardText, StyledPrimaryButton } from 'helpers/general';

import {
    FACILITY_TYPE_SLIDER,
    FILTER_SPACE_CAPACITY,
    getFlatFacilityTypeList,
} from 'modules/Pages/BookableSpaces/spacesHelpers';

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

const StyledSlider = styled(Slider)(() => ({
    marginTop: '1rem', // space for tooltips to appear in
    '& .MuiSlider-track': {
        marginLeft: '0.2rem', // don't let the range bar peek out to the left
    },
    '& [data-index="0"]': {
        marginLeft: '0.6rem', // shift the minimum dot a little to the right so it's all visible
    },
    '& [data-index="1"]': {
        marginLeft: '-0.6rem !important', // shift the maximum dot a little to the left so it's all visible
    },
}));
const StyledSliderInput = styled(MuiInput)(() => ({
    width: '42px',
    '&.rightSlider input': {
        textAlign: 'right',
    },
}));

const StyledInputListItem = styled('li')(({ theme }) => ({
    listStyle: 'none',
    paddingLeft: 0,
    marginLeft: '-9px',
    display: 'flex',
    '& p': {
        margin: '0 0 0 1rem',
    },
    '&:has(.rightSlider)': {
        display: 'block',
    },
    '& label': {
        ...standardText(theme),
        textDecoration: 'underline',
        display: 'inline',
        '&:hover, :focus': {
            '& > span:nth-of-type(2)': {
                backgroundColor: theme.palette.primary.main,
                color: '#fff',
                textDecoration: 'underline',
                lineHeight: 1.2,
            },
        },
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
    height: '100%',
    overflowY: 'auto',
    left: 0,

    paddingTop: '3.5rem',
    paddingRight: 0,
    marginBlock: '1em',
    marginRight: 0,
    marginLeft: 0,
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
const StyledSidebarSubDiv = styled('div')(({ theme }) => ({
    '& > div:first-of-type': {
        borderTop: theme.palette.designSystem.border,
        marginTop: '16px',
    },
    '& .hiddenFilters': {
        display: 'none',
    },
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
const StyledFilterSpaceList = styled('ul')(() => ({
    marginTop: 0,
    paddingLeft: 0,
    paddingTop: 0,
}));
const StyledCartoucheList = styled('ul')(({ theme }) => ({
    listStyle: 'none',
    display: 'block',
    margin: '0 0 0.5rem 0',
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
    suppliedClassName,
    minimumSpaceCapacity,
    maximumSpaceCapacity,
    capacityFilterValue,
    setCapacityFilterValue,
}) => {
    const [facilityTypeFilterGroupExpandedness, setFacilityTypeFilterGroupExpandedness] = React.useState([]);

    function sortedUsedGroups() {
        if (
            !filteredFacilityTypeList?.data?.facility_type_groups ||
            filteredFacilityTypeList?.data?.facility_type_groups?.length === 0
        ) {
            return [];
        }
        const usedFilterList = [...filteredFacilityTypeList?.data?.facility_type_groups];

        return usedFilterList?.sort((a, b) => a?.facility_type_group_order - b?.facility_type_group_order);
    }

    React.useEffect(() => {
        if (
            facilityTypeListError === false &&
            facilityTypeListLoading === false &&
            facilityTypeList?.data?.facility_type_groups?.length > 0 &&
            selectedFacilityTypes?.length === 0
        ) {
            // initialise openness storage
            const expandednessList = [];
            sortedUsedGroups()?.map(g => {
                expandednessList?.push({
                    groupId: g?.facility_type_group_id,
                    isGroupExpanded: g?.facility_type_group_loads_open,
                });
            });
            setFacilityTypeFilterGroupExpandedness(expandednessList);

            const flatFacilityTypeList = getFlatFacilityTypeList(filteredFacilityTypeList);
            const newFilters = flatFacilityTypeList?.map(facilityType => {
                return {
                    facility_type_group_id: facilityType?.facility_type_group_id,
                    facility_type_id: facilityType?.facility_type_id,
                    selected: false,
                    unselected: false,
                    facility_special_action: facilityType?.facility_special_action,
                };
            });
            setSelectedFacilityTypes(newFilters);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const resetFacilityTypeFilterGroupExpandedness = (filterGroupId, isGroupExpandedInput) => {
        const newExpandedness = facilityTypeFilterGroupExpandedness?.filter(g => {
            return g?.groupId !== filterGroupId;
        });
        newExpandedness?.push({
            groupId: filterGroupId,
            isGroupExpanded: isGroupExpandedInput,
        });
        setFacilityTypeFilterGroupExpandedness(newExpandedness);
    };

    const setFilters = (facilityTypeId, isSelected, isUnselected, facilitySpecialAction) => {
        const removedFilter = selectedFacilityTypes?.find(ftf => {
            return ftf?.facility_type_id === facilityTypeId;
        });
        const newFilters = selectedFacilityTypes?.filter(ftf => {
            return ftf?.facility_type_id !== facilityTypeId;
        });
        !!removedFilter &&
            newFilters?.push({
                facility_type_group_id: removedFilter?.facility_type_group_id,
                facility_type_id: facilityTypeId,
                selected: isSelected,
                unselected: isUnselected,
                facility_special_action: facilitySpecialAction,
            });
        !!newFilters && setSelectedFacilityTypes(newFilters);
    };

    // hide listitems that are checked
    const showHideActiveFilterListItems = (facilityTypeId, isChecked) => {
        const listItemId = `facility-type-listitem-${facilityTypeId}`;
        const listItemElement = !!listItemId && document.getElementById(listItemId);
        if (!!listItemElement) {
            !!isChecked
                ? addClass(listItemElement, 'checkedCheckbox')
                : removeClass(listItemElement, 'checkedCheckbox');
        }
    };

    const scrollToTopOfContent = () => {
        // const topOfPage = document.getElementById('topofcontent');
        // !!topOfPage && typeof topOfPage.scrollIntoView === 'function' && topOfPage.scrollIntoView();

        const topOfSidebar = document.getElementById('topOfSidebar');
        !!topOfSidebar &&
            typeof topOfSidebar?.scrollIntoView === 'function' &&
            topOfSidebar?.scrollIntoView({
                behavior: 'smooth',
            });
        !!topOfSidebar && topOfSidebar?.focus();
    };

    const handleFilterRejection = (isChecked, facilityTypeId, facilitySpecialAction) => {
        showHideActiveFilterListItems(facilityTypeId, isChecked);

        setFilters(facilityTypeId, false, isChecked, facilitySpecialAction);

        scrollToTopOfContent();
    };

    const handleFilterSelection = (isChecked, facilityType) => {
        const facilityTypeId = facilityType?.facility_type_id;
        const facilitySpecialAction = facilityType?.facility_special_action;
        showHideActiveFilterListItems(facilityTypeId, isChecked);

        setFilters(facilityTypeId, !!isChecked, false, facilitySpecialAction);

        scrollToTopOfContent();
    };

    const handleCapacityFilterChange = (e, newValue, id = null) => {
        setCapacityFilterValue(newValue);

        // we have to pass the id directly on the Slider, but we can get it from the field for the 2 Text fields
        const idInput = id ?? e?.target?.id;
        const parts = idInput?.split('-');
        const facilityTypeId =
            !!parts && parts.length === 3 ? parseInt(parts.pop(), 10) : /* istanbul ignore next */ -999;

        const capacityFilterType = selectedFacilityTypes?.find(ft => ft.facility_type_id === facilityTypeId);
        const isCapacityDefaultValues = newValue[0] === minimumSpaceCapacity && newValue[1] === maximumSpaceCapacity;
        if (isCapacityDefaultValues) {
            handleFilterRejection(false, facilityTypeId, capacityFilterType?.facility_special_action);
        } else {
            handleFilterSelection(true, capacityFilterType);
        }
    };
    const handleCapacityMinInputChange = e => {
        const newMin = e?.target?.value === '' ? '' : Number(e?.target?.value);
        handleCapacityFilterChange(e, [newMin, capacityFilterValue[1]]);
    };
    const handleCapacityMinInputBlur = e => {
        const value = e?.target?.value;
        if (value < 0) {
            handleCapacityFilterChange(e, [minimumSpaceCapacity, capacityFilterValue[1]]);
        } else if (value > maximumSpaceCapacity) {
            handleCapacityFilterChange(e, [capacityFilterValue[0], maximumSpaceCapacity]);
        }
    };
    const handleCapacityMaxInputChange = e => {
        const newMax = e?.target?.value === '' ? '' : Number(e?.target?.value);
        handleCapacityFilterChange(e, [capacityFilterValue[0], newMax]);
    };
    const handleCapacityMaxInputBlur = e => {
        const value = e.target.value;
        if (value < 0) {
            handleCapacityFilterChange(e, [minimumSpaceCapacity, capacityFilterValue[1]]);
        } else if (value > maximumSpaceCapacity) {
            handleCapacityFilterChange(e, [capacityFilterValue[0], maximumSpaceCapacity]);
        }
    };

    const toggleFilterGroup = filterGroupId => {
        const filterGroupPanelVisible = document.getElementById(`filter-group-list-${filterGroupId}`);
        // reverse the panel show/ hide
        resetFacilityTypeFilterGroupExpandedness(filterGroupId, !filterGroupPanelVisible);
    };

    const deSelectSelected = e => {
        const button = e?.target?.closest('button');
        const facilityTypeId = parseInt(button?.id?.replace('button-deselect-selected-', ''), 10);

        const selectedFacilityType = selectedFacilityTypes.find(ft => ft.facility_type_id === facilityTypeId);
        if (selectedFacilityType?.facility_special_action === FILTER_SPACE_CAPACITY) {
            setCapacityFilterValue([minimumSpaceCapacity, maximumSpaceCapacity]);
        }
        showHideActiveFilterListItems(facilityTypeId, e?.target?.checked);

        setFilters(facilityTypeId, false, false);
    };
    const deSelectAll = () => {
        // reset the facility types to all false - the render will clear the buttons and checkboxes for us!
        const newFacilityTypes = selectedFacilityTypes?.map(ft => {
            return {
                facility_type_id: ft?.facility_type_id,
                selected: false,
                unselected: false,
                facility_special_action: ft?.facility_special_action,
                facility_type: ft?.facility_type,
            };
        });
        setSelectedFacilityTypes(newFacilityTypes);

        setCapacityFilterValue([minimumSpaceCapacity, maximumSpaceCapacity]);
    };
    function valueLabelComponent(props) {
        const { children, value } = props;

        return (
            <Tooltip enterTouchDelay={0} placement="top" title={value}>
                {children}
            </Tooltip>
        );
    }
    const getStyledInputListItem = facilityType => {
        return (
            <StyledInputListItem
                key={`facility-type-listitem-${facilityType?.facility_type_id}`}
                id={`facility-type-listitem-${facilityType?.facility_type_id}`}
                data-testid={`facility-type-listitem-${facilityType?.facility_type_id}`}
            >
                {facilityType.facility_type === FACILITY_TYPE_SLIDER ? (
                    <>
                        <p>Our largest space can fit {maximumSpaceCapacity} people.</p>
                        <InputLabel
                            title={`Filter in Spaces with ${facilityType?.facility_type_name}`}
                            htmlFor={`filtertype-${facilityType?.facility_type_id}`}
                            id={`filtertype-${facilityType?.facility_type_id}-label`}
                            className="selectedFilterTypeLabel"
                            style={{ marginLeft: '1rem' }}
                        >
                            <StyledSliderInput
                                className="rightSlider"
                                value={capacityFilterValue[0]}
                                size="small"
                                onChange={handleCapacityMinInputChange}
                                onBlur={handleCapacityMinInputBlur}
                                inputProps={{
                                    id: `capacitySlider-inputRight-${facilityType?.facility_type_id}`,
                                    'data-testid': 'capacitySlider-inputRight',
                                    step: 1,
                                    min: minimumSpaceCapacity,
                                    max: capacityFilterValue[1] - 1,
                                    type: 'number',
                                    'aria-labelledby': `filtertype-${facilityType?.facility_type_id}-label`,
                                }}
                                sx={{ marginRight: '0.5rem' }}
                            />
                            <StyledSlider
                                getAriaLabel={() => 'Space for number of people'} // word choice needs work
                                value={capacityFilterValue}
                                onChange={(event, newValue) =>
                                    handleCapacityFilterChange(
                                        event,
                                        newValue,
                                        `capacitySlider-slider-${facilityType?.facility_type_id}`,
                                    )
                                }
                                valueLabelDisplay="on"
                                // getAriaValueText={`${capacityFilterValue} people`}
                                sx={{ width: 200 }}
                                min={minimumSpaceCapacity}
                                max={maximumSpaceCapacity}
                                step={1}
                                components={{
                                    ValueLabel: valueLabelComponent,
                                }}
                            />
                            <StyledSliderInput
                                value={capacityFilterValue[1]}
                                size="small"
                                onChange={handleCapacityMaxInputChange}
                                onBlur={handleCapacityMaxInputBlur}
                                inputProps={{
                                    id: `capacitySlider-inputLeft-${facilityType?.facility_type_id}`,
                                    'data-testid': 'capacitySlider-inputLeft',
                                    step: 1,
                                    min: capacityFilterValue[0] + 1,
                                    max: maximumSpaceCapacity,
                                    type: 'number',
                                    'aria-labelledby': `filtertype-${facilityType?.facility_type_id}-label`,
                                }}
                                sx={{ marginLeft: '0.5rem' }}
                            />
                        </InputLabel>
                    </>
                ) : (
                    <>
                        <InputLabel
                            title={`Filter in Spaces with ${facilityType?.facility_type_name}`}
                            htmlFor={`filtertype-${facilityType?.facility_type_id}`}
                            className="selectedFilterTypeLabel"
                        >
                            <Checkbox
                                onChange={e => handleFilterSelection(e?.target?.checked, facilityType)}
                                data-testid={`filtertype-${facilityType?.facility_type_id}`}
                                id={`filtertype-${facilityType?.facility_type_id}`}
                                className="selectedFilterType"
                                checked={
                                    selectedFacilityTypes?.find(
                                        f1 => f1?.facility_type_id === facilityType?.facility_type_id,
                                    )?.selected || false
                                }
                            />
                            <span>{facilityType?.facility_type_name}</span>
                        </InputLabel>
                        <input
                            type="checkbox"
                            id={`reject-filtertype-${facilityType?.facility_type_id}`}
                            data-testid={`reject-filtertype-${facilityType?.facility_type_id}`}
                            className="rejectedFilterType"
                            onChange={e =>
                                handleFilterRejection(
                                    e?.target?.checked,
                                    facilityType?.facility_type_id,
                                    facilityType?.facility_special_action,
                                )
                            }
                            aria-label={`Exclude Spaces with ${facilityType?.facility_type_name}`}
                            checked={
                                selectedFacilityTypes?.find(
                                    f1 => f1?.facility_type_id === facilityType?.facility_type_id,
                                )?.unselected || false
                            }
                        />
                        <label
                            htmlFor={`reject-filtertype-${facilityType?.facility_type_id}`}
                            className="rejectedFacilityTypeLabel"
                            data-testid={`reject-filtertype-label-${facilityType?.facility_type_id}`}
                            title={`Exclude Spaces with ${facilityType?.facility_type_name}`}
                        />
                        <span className="fortestfocus" style={{ width: '10px' }} />
                    </>
                )}
            </StyledInputListItem>
        );
    };
    const showFilterGroupHeading = (group, isGroupExpanded, numberChecked, filterGroupId, groupLength) => {
        return (
            <StyledFilterSpaceListTypographyHeading component={'h3'} variant={'h6'} className="group-heading">
                {group?.facility_type_group_name}{' '}
                {!isGroupExpanded && numberChecked > 0 && (
                    <span
                        className="countSelectedCheckboxes"
                        data-testid={`facility-type-group-${filterGroupId}-expanded-count`}
                    >
                        ({numberChecked} of {groupLength})
                    </span>
                )}
                <IconButton
                    id={`facility-type-group-${filterGroupId}`}
                    data-testid={`facility-type-group-${filterGroupId}`}
                    onClick={() => toggleFilterGroup(filterGroupId)}
                    aria-label={
                        !!isGroupExpanded
                            ? `Hide ${group?.facility_type_group_name} filter options`
                            : `Show ${group?.facility_type_group_name} filter options`
                    }
                    aria-haspopup="true"
                    aria-expanded={!!isGroupExpanded ? 'true' : 'false'}
                    aria-controls={`filter-group-list-${filterGroupId}`}
                >
                    <KeyboardArrowDownIcon
                        style={{ display: !!isGroupExpanded ? 'block' : 'none' }}
                        className="expandedGroup"
                        data-testid={`facility-type-group-${filterGroupId}-open`}
                    />
                    <KeyboardArrowUpIcon
                        style={{ display: !!isGroupExpanded ? 'none' : 'block' }}
                        className="collapsedGroup"
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
                    if (!!f?.selected) {
                        const facilityTypeRecord = flatFacilityTypeList?.find(
                            flat => flat?.facility_type_id === f?.facility_type_id,
                        );
                        return (
                            <li key={`cartouche-select-${f?.facility_type_id}`}>
                                <Button
                                    id={`button-deselect-selected-${f?.facility_type_id}`}
                                    data-testid={`button-deselect-selected-${f?.facility_type_id}`}
                                    onClick={deSelectSelected}
                                    className="selectedFilter"
                                    title={`${facilityTypeRecord?.facility_type_name} selected - click to deselect`}
                                >
                                    <span>{facilityTypeRecord?.facility_type_name}</span> <CloseIcon />
                                </Button>
                            </li>
                        );
                    }
                    if (!!f?.unselected) {
                        const facilityTypeRecord = flatFacilityTypeList?.find(
                            flat => flat?.facility_type_id === f?.facility_type_id,
                        );
                        return (
                            <li key={`cartouche-unselect-${f?.facility_type_id}`}>
                                <Button
                                    id={`button-deselect-selected-${f?.facility_type_id}`}
                                    data-testid={`button-deselect-unselected-${f?.facility_type_id}`}
                                    onClick={deSelectSelected}
                                    className="unselectedFilter"
                                    aria-label={`${facilityTypeRecord?.facility_type_name} excluded - click to deselect`}
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

    const hasActiveFilters = selectedFacilityTypes?.some(f => !!f?.selected || !!f?.unselected);

    const flatFacilityTypeList = getFlatFacilityTypeList(filteredFacilityTypeList);
    const checkFiltersList = selectedFacilityTypes?.filter(f => !!f?.selected || !!f?.unselected);

    if (facilityTypeList?.data?.facility_type_groups?.length === 0) {
        return null;
    }

    return (
        <StyledSidebarDiv id="StyledSidebarDivTemp" className={suppliedClassName}>
            <StyledSidebarSubDiv data-testid="sidebarCheckboxes">
                <a href="#space-wrapper" className="showsOnlyOnFocus" data-testid="skip-to-spaces-list">
                    Skip to list of Spaces
                </a>
                <Typography component={'h2'} variant={'h6'} id="topOfSidebar" data-testid="topOfSidebar">
                    Filter Spaces
                </Typography>
                {/* <StyledFacilityGroup data-testid={'filter-group-block-open'}>*/}
                {/*    <StyledFilterSpaceList id={'filter-group-list-open'}>*/}
                {/*        {getStyledInputListItem({*/}
                {/*            facility_type_id: 'open',*/}
                {/*            facility_type_name: 'Currently open',*/}
                {/*        })}*/}
                {/*    </StyledFilterSpaceList>*/}
                {/* </StyledFacilityGroup>*/}
                {!!hasActiveFilters && (
                    <>
                        <Typography component={'h3'} variant={'h6'}>
                            Active filters
                        </Typography>
                        <StyledCartoucheList id={'button-deselect-list'} data-testid={'button-deselect-list'}>
                            {showCartoucheList(flatFacilityTypeList)}
                        </StyledCartoucheList>
                        {checkFiltersList?.length > 0 && (
                            <StyledPrimaryButton
                                id={'button-deselect-all-filters'}
                                data-testid={'button-deselect-all-filters'}
                                onClick={deSelectAll}
                                style={{
                                    padding: '0.5rem 1rem',
                                    marginRight: 'auto',
                                    marginLeft: 'auto',
                                    display: 'flex',
                                    alignItems: 'center',
                                    columnGap: '0.5rem',
                                }}
                            >
                                <ReplayIcon style={{ fontSize: '16px' }} />
                                <span>Remove all filters</span>
                            </StyledPrimaryButton>
                        )}
                    </>
                )}
                {sortedUsedGroups()?.map(group => {
                    const filterGroupId = group?.facility_type_group_id;
                    const isGroupExpanded = !!facilityTypeFilterGroupExpandedness?.find(
                        o => o?.groupId === filterGroupId,
                    )?.isGroupExpanded;
                    const groupLength = selectedFacilityTypes?.filter(
                        ftf => ftf?.facility_type_group_id === filterGroupId,
                    )?.length;
                    const numberChecked = selectedFacilityTypes?.filter(
                        ftf => ftf?.facility_type_group_id === filterGroupId && (ftf?.selected || ftf?.unselected),
                    ).length;
                    return (
                        <StyledFacilityGroup
                            key={`facility-group-${filterGroupId}`}
                            data-testid={`filter-group-block-${filterGroupId}`}
                        >
                            {showFilterGroupHeading(group, isGroupExpanded, numberChecked, filterGroupId, groupLength)}
                            {!!isGroupExpanded && (
                                <StyledFilterSpaceList id={`filter-group-list-${filterGroupId}`}>
                                    {group?.facility_type_children && group?.facility_type_children?.length > 0 ? (
                                        group?.facility_type_children?.map(facilityType =>
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
};

SidebarFilters.propTypes = {
    facilityTypeList: PropTypes.any,
    facilityTypeListLoading: PropTypes.any,
    facilityTypeListError: PropTypes.any,
    filteredFacilityTypeList: PropTypes.any,
    selectedFacilityTypes: PropTypes.array,
    setSelectedFacilityTypes: PropTypes.func,
    suppliedClassName: PropTypes.string,
    minimumSpaceCapacity: PropTypes.number,
    maximumSpaceCapacity: PropTypes.number,
    capacityFilterValue: PropTypes.array,
    setCapacityFilterValue: PropTypes.func,
};

export default React.memo(SidebarFilters);

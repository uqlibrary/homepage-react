import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import { getPathRoot } from 'modules/Pages/DigitalLearningObjects/dlorHelpers';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Divider, Pagination } from '@mui/material';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import BookmarkIcon from '@mui/icons-material/Bookmark';
import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { useConfirmationState } from 'hooks';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';

import { convertSnakeCaseToKebabCase } from 'modules/Pages/DigitalLearningObjects/dlorHelpers';
import VisitHomepage from 'modules/Pages/Admin/DigitalLearningObjects/SharedDlorComponents/VisitHomepage';
import { dlorAdminLink } from 'modules/Pages/Admin/DigitalLearningObjects/dlorAdminHelpers';
import { breadcrumbs } from 'config/routes';

const moment = require('moment');

const StyledPageListItemGridContainer = styled(Grid)(() => ({
    paddingTop: '10px',
    paddingLeft: '6px',
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
}));
const StyledPagination = styled(Pagination)(() => ({
    width: '100%',
    '& ul': {
        justifyContent: 'center',
    },
}));
const StyledTagLabelSpan = styled('span')(() => ({
    fontVariant: 'small-caps',
    textTransform: 'lowercase',
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    marginRight: '9px',
}));
const StyleObjectDetailGridItem = styled(Grid)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.up('lg')]: {
        marginLeft: '-50px',
        marginRight: '50px',
    },
}));

const exportToCSV = (data, filename) => {
    /* istanbul ignore next */
    if (!data || data.length === 0) {
        console.error('No data to export.');
        return;
    }

    const headerNameMap = {
        object_id: 'Object ID',
        object_public_uuid: 'Public UUID',
        object_title: 'Title',
        object_description: 'Description',
        object_summary: 'Summary',
        object_review_date_next: 'Next Review Date',
        object_status: 'Status',
        object_owning_team_id: 'Team ID',
        publishing_user_name: 'Publishing User',
        team_name: 'Team Name',
        object_download_instructions: 'Download Instructions',
        object_keywords: 'Keywords',
        object_link_interaction_type: 'Interaction Type',
        graduate_attributes: 'Graduate Attributes',
        // ... add all other mappings here
    };

    const headers = Object.keys(data[0]).filter(key => key !== 'object_filters');
    const filterTypes = new Set();

    data.forEach(item => {
        /* istanbul ignore else */
        if (item.object_filters) {
            item.object_filters.forEach(filter => {
                filterTypes.add(filter.filter_key);
            });
        }
    });

    const allHeaders = [...headers, ...Array.from(filterTypes), 'publishing_user_name', 'team_name'].filter(
        header => header !== 'owner',
    );
    const csvRows = [];

    // Use the map function to transform headers with custom names
    csvRows.push(allHeaders.map(header => headerNameMap[header] || header).join(','));

    data.forEach(item => {
        const values = allHeaders.map(header => {
            let value;

            if (header === 'publishing_user_name') {
                value = item.owner?.publishing_user_username || /* istanbul ignore next */ '';
            } else if (header === 'team_name') {
                value = item.owner?.team_name || /* istanbul ignore next */ '';
            } else if (item.object_filters && filterTypes.has(header)) {
                const matchingFilter = item.object_filters.find(filter => filter.filter_key === header);
                value = matchingFilter ? matchingFilter.filter_values.map(fv => fv.name).join(';') : '';
            } else {
                value = item[header];
                // *** boolean fields value conversion ***
                const booleanHeaders = ['object_is_featured', 'object_cultural_advice'];
                if (booleanHeaders.includes(header)) {
                    value = value === 1 ? 'yes' : 'no';
                }
                // *** DATE FORMATTING LOGIC ***
                const dateHeaders = ['date', 'created_at'];

                if (dateHeaders.some(dateHeader => header.includes(dateHeader))) {
                    // Check if the header contains "date" (adjust as needed)
                    /* istanbul ignore else */
                    if (value) {
                        const date = moment(value); // Use moment.js to parse the date
                        /* istanbul ignore else */
                        if (date.isValid()) {
                            value = date.format('MMMM DD, YYYY'); // Format the date (customize format as needed)
                        } else {
                            value = 'Invalid Date'; // Handle invalid dates gracefully
                        }
                    }
                }

                if (Array.isArray(value)) {
                    value = value
                        .map(v => {
                            /* istanbul ignore next */
                            if (typeof v === 'object') {
                                /* istanbul ignore next */
                                return JSON.stringify(v);
                            }
                            return v;
                        })
                        .join(';');
                } else if (typeof value === 'object') {
                    value = JSON.stringify(value);
                }

                if (typeof value === 'string') {
                    value = value.replace(/"/g, '""');
                    value = `"${value}"`;
                }
            }
            return value;
        });
        csvRows.push(values.join(','));
    });

    const csvString = csvRows.join('\r\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.setAttribute('data-testid', 'download-link'); // Add data-testid attribute
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const DLOAdminHomepage = ({ actions, dlorList, dlorListLoading, dlorListError, dlorItemDeleteError }) => {
    const statusTypes = [
        {
            type: 'new',
            label: 'New/ Draft',
            isChecked: false,
        },
        {
            type: 'current',
            label: 'Published',
            isChecked: true,
        },
        {
            type: 'rejected',
            label: 'Rejected',
            isChecked: false,
        },
        {
            type: 'deprecated',
            label: 'Deprecated (unpublished)',
            isChecked: false,
        },
        {
            type: 'deleted',
            label: 'Deleted',
            isChecked: false,
        },
        {
            type: 'submitted',
            label: 'User Submitted',
            isChecked: false,
        },
    ];
    const [checkedStatusType, setCheckedStatusType] = useState(statusTypes.map(status => status.isChecked));

    const [objectToDelete, setObjectToDelete] = useState(null);

    const [paginationPage, setPaginationPage] = useState(1);

    const [keywordSearch, setKeywordSearch] = useState('');
    const keyWordSearchRef = useRef('');

    const [isDeleteConfirmOpen, showDeleteConfirmation, hideDeleteConfirmation] = useConfirmationState();
    const [
        isDeleteFailureConfirmationOpen,
        showDeleteFailureConfirmation,
        hideDeleteFailureConfirmation,
    ] = useConfirmationState();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    React.useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.setAttribute('secondleveltitle', breadcrumbs.dloradmin.title);
        !!siteHeader && siteHeader.setAttribute('secondLevelUrl', breadcrumbs.dloradmin.pathname);
    }, []);

    React.useEffect(() => {
        if (!dlorListError && !dlorListLoading && !dlorList) {
            actions.loadAllDLORs();
        }
    }, [actions, dlorList, dlorListError, dlorListLoading]);

    const navigateToAddPage = () => {
        window.location.href = dlorAdminLink('/add');
    };

    const navigateToTeamsListPage = () => {
        window.location.href = dlorAdminLink('/team/manage');
    };

    const navigateToFilterManagePage = () => {
        window.location.href = dlorAdminLink('/filters');
    };

    const navigateToSeriesListPage = () => {
        window.location.href = dlorAdminLink('/series/manage');
    };

    const navigateToAddSeriesPage = () => {
        window.location.href = dlorAdminLink('/series/add');
    };

    const navigateToEditPage = uuid => {
        window.location.href = dlorAdminLink(`/edit/${uuid}`);
    };

    const confirmDelete = objectUuid => {
        setObjectToDelete(objectUuid);
        showDeleteConfirmation();
    };

    const deleteADlor = dlorId => {
        return actions.deleteDlor(dlorId);
    };

    const deleteSelectedObject = () => {
        !!objectToDelete &&
            deleteADlor(objectToDelete)
                .then(
                    /* istanbul ignore next */ () => /* istanbul ignore next */ {
                        setObjectToDelete('');
                        actions.loadAllDLORs();
                    },
                )
                .catch(() => {
                    setObjectToDelete('');
                    showDeleteFailureConfirmation();
                });
    };

    const handleStatusTypeChange = checkedType => () => {
        const checkedTypeId = statusTypes.findIndex(object => object.type === checkedType);

        const newStatusTypeSet = checkedStatusType.map((itemCurrentCheckedness, index) =>
            index === checkedTypeId ? !itemCurrentCheckedness : itemCurrentCheckedness,
        );
        setCheckedStatusType(newStatusTypeSet);
    };

    const numberItemsPerPage = 10; // value also set in cypress dlorHomepage.spec

    function keywordIsSearchable(keyword) {
        // don't filter on something terribly short
        return keyword?.length > 1;
    }

    const keywordFoundIn = (object, enteredKeyword) => {
        const enteredKeywordLower = enteredKeyword.toLowerCase();
        if (
            object.object_title.toLowerCase().includes(enteredKeywordLower) ||
            object.object_description.toLowerCase().includes(enteredKeywordLower) ||
            object.object_summary.toLowerCase().includes(enteredKeywordLower)
        ) {
            return true;
        }
        if (
            !!object?.object_keywords?.some(k => {
                return k.toLowerCase().startsWith(enteredKeywordLower);
            })
        ) {
            return true;
        }
        return false;
    };

    function filterOnKeyword(filteredDlorList) {
        let _filteredDlorList = filteredDlorList;
        if (!!keywordSearch && !!keywordIsSearchable(keywordSearch)) {
            _filteredDlorList = filteredDlorList.filter(t => keywordFoundIn(t, keywordSearch));
        }
        return _filteredDlorList;
    }

    const filterDLorList = dlorlistToFilter => {
        const requestedStatuses = statusTypes
            .filter((type, index) => checkedStatusType[index] === true)
            .map(t => t.type);
        let filteredDlorList = dlorlistToFilter.filter(d => requestedStatuses.includes(d.object_status));
        filteredDlorList = filterOnKeyword(filteredDlorList);

        filteredDlorList.sort((a, b) => b.object_is_featured - a.object_is_featured);
        return filteredDlorList;
    };
    const getPaginatedList = (filteredDlorList, pageloadShown) => {
        const paginatedFilteredDlorList = filteredDlorList.filter((_, index) => {
            const startIndex = (pageloadShown - 1) * numberItemsPerPage;
            const endIndex = startIndex + numberItemsPerPage;
            return index >= startIndex && index < endIndex;
        });
        return paginatedFilteredDlorList;
    };

    const numberOfListItemsOfType = (list, statusType) => list.filter(d => d.object_status === statusType)?.length;

    const handlePaginationChange = (e, value) => {
        setPaginationPage(value);
        // and scroll back to the top
        const topOfBodyElement = document.getElementById('topOfBody');
        topOfBodyElement?.scrollIntoView({ behavior: 'smooth' });
    };

    const clearKeywordField = () => {
        setKeywordSearch('');
        keyWordSearchRef.current.value = '';
        setPaginationPage(1);
    };

    const handleKeywordSearch = e => {
        const keyword = e?.target?.value;
        keyWordSearchRef.current.value = keyword;

        if (keywordIsSearchable(keyword)) {
            setKeywordSearch(keyword);
        } else {
            /* istanbul ignore next */
            if (keyword.length === 0) {
                clearKeywordField();
            }
        }
    };

    return (
        <StandardPage title="Digital Learning Hub Management">
            <ConfirmationBox
                actionButtonColor="secondary"
                actionButtonVariant="contained"
                confirmationBoxId="dlor-item-delete-confirm"
                onAction={() => deleteSelectedObject()}
                onClose={hideDeleteConfirmation}
                onCancelAction={hideDeleteConfirmation}
                isOpen={isDeleteConfirmOpen}
                locale={{
                    confirmationTitle: 'Do you want to delete this object?',
                    confirmationMessage: '',
                    cancelButtonLabel: 'No',
                    confirmButtonLabel: 'Yes',
                }}
            />

            <ConfirmationBox
                actionButtonColor="secondary"
                actionButtonVariant="contained"
                confirmationBoxId="dlor-item-delete-failure-notice"
                hideCancelButton
                onAction={hideDeleteFailureConfirmation}
                onClose={hideDeleteFailureConfirmation}
                isOpen={isDeleteFailureConfirmationOpen}
                locale={{
                    confirmationTitle: 'An error occurred deleting the Object',
                    confirmationMessage: dlorItemDeleteError?.message,
                    confirmButtonLabel: 'OK',
                }}
            />
            <Grid container spacing={2} sx={{ marginBottom: '25px' }}>
                <Grid item xs={12} sx={{ textAlign: 'right' }}>
                    <IconButton
                        color="primary"
                        aria-controls={open ? 'admin-dlor-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleMenuClick}
                        data-testid="admin-dlor-menu-button"
                        aria-label="Admin menu"
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="admin-dlor-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleMenuClose}
                        MenuListProps={{
                            'aria-labelledby': 'admin-dlor-menu-button',
                        }}
                    >
                        <MenuItem
                            onClick={() => {
                                navigateToAddSeriesPage();
                                handleMenuClose();
                            }}
                            data-testid="admin-dlor-visit-add-series-button"
                        >
                            Add series
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                navigateToSeriesListPage();
                                handleMenuClose();
                            }}
                            data-testid="admin-dlor-visit-manage-series-button"
                        >
                            Manage series
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                navigateToTeamsListPage();
                                handleMenuClose();
                            }}
                            data-testid="admin-dlor-visit-manage-teams-button"
                        >
                            Manage teams
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                navigateToFilterManagePage();
                                handleMenuClose();
                            }}
                            data-testid="admin-dlor-visit-manage-filters-button"
                        >
                            Manage filters
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                navigateToAddPage();
                                handleMenuClose();
                            }}
                            data-testid="admin-dlor-visit-add-button"
                        >
                            Add object
                        </MenuItem>
                        <Divider />
                        <MenuItem
                            onClick={() => {
                                exportToCSV(dlorList, 'dlor_data.csv');
                                handleMenuClose();
                            }}
                            data-testid="admin-dlor-export-data-button"
                        >
                            Export to CSV
                        </MenuItem>
                        <MenuItem
                            component="a"
                            href={`${getPathRoot()}/digital-learning-hub`}
                            rel="noopener noreferrer"
                            onClick={handleMenuClose}
                            data-testid="dlor-admin-public-homepage-link"
                        >
                            View public homepage list
                        </MenuItem>
                    </Menu>
                    {/* <ExportToCsvButton data={dlorList} filename="dlor_data.csv" /> */}
                    {/* <VisitHomepage /> */}
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                {(() => {
                    if (!!dlorListLoading) {
                        return (
                            <Grid item xs={12} md={9} sx={{ marginTop: '12px' }}>
                                <Box sx={{ minHeight: '600px' }}>
                                    <InlineLoader message="Loading" />
                                </Box>
                            </Grid>
                        );
                    } else if (!!dlorListError) {
                        return (
                            <Grid item xs={12} md={9} sx={{ marginTop: '12px' }}>
                                <Typography variant="body1" data-testid="dlor-homepage-error">
                                    {dlorListError}
                                </Typography>
                            </Grid>
                        );
                    } else if (!dlorList || dlorList.length === 0) {
                        return (
                            <Grid item xs={12} md={9} sx={{ marginTop: '12px' }}>
                                <Typography variant="body1" data-testid="dlor-homepage-noresult">
                                    We did not find any entries in the system - please try again later.
                                </Typography>
                            </Grid>
                        );
                    } else {
                        const filteredListLocal = filterDLorList(dlorList);
                        const paginationCount = Math.ceil(
                            filterOnKeyword(filteredListLocal)?.length / numberItemsPerPage,
                        );
                        const paginatedList = getPaginatedList(filteredListLocal, paginationPage);
                        return (
                            <>
                                <Grid item xs={12} id="topOfBody">
                                    {statusTypes?.length > 0 &&
                                        statusTypes.map((objectStatus, index) => {
                                            const checkBoxid = `checkbox-status-${objectStatus.type}`;
                                            return (
                                                <FormControlLabel
                                                    key={`statustype-checkox-${objectStatus.type}`}
                                                    control={
                                                        <Checkbox
                                                            onChange={handleStatusTypeChange(objectStatus.type)}
                                                            value={objectStatus.type}
                                                            data-testid={`${checkBoxid}`}
                                                            checked={checkedStatusType[index]}
                                                        />
                                                    }
                                                    label={`${objectStatus.label} (${numberOfListItemsOfType(
                                                        dlorList,
                                                        objectStatus.type,
                                                    )})`}
                                                />
                                            );
                                        })}
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        sx={{
                                            width: '100%',
                                        }}
                                        data-testid="dlor-homepage-keyword"
                                        label="Search by keyword"
                                        onChange={handleKeywordSearch}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={clearKeywordField}>
                                                        {keyWordSearchRef.current?.value === '' ? (
                                                            <SearchIcon />
                                                        ) : (
                                                            <CloseIcon data-testid="keyword-clear" />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        inputRef={keyWordSearchRef}
                                    />
                                </Grid>
                                <Grid item sx={{ width: '100%' }} data-testid="dlor-homepage-list">
                                    {paginatedList?.length > 0 &&
                                        paginatedList.map(o => {
                                            return (
                                                <StyledPageListItemGridContainer
                                                    container
                                                    key={`list-dlor-${o?.object_id}`}
                                                >
                                                    <Grid item xs={1} sx={{ marginTop: '4px' }}>
                                                        {o?.object_is_featured === 1 && (
                                                            <DoneIcon
                                                                data-testid={`dlor-homepage-featured-${o?.object_public_uuid}`}
                                                                title="This object is Featured"
                                                                sx={{ color: 'green' }}
                                                            />
                                                        )}
                                                    </Grid>
                                                    <StyleObjectDetailGridItem
                                                        item
                                                        xs={7}
                                                        data-testid={`dlor-homepage-panel-${convertSnakeCaseToKebabCase(
                                                            o?.object_public_uuid,
                                                        )}`}
                                                    >
                                                        <div>
                                                            <Typography component={'h2'} variant={'h6'}>
                                                                {o?.object_title}
                                                            </Typography>
                                                            <>
                                                                {(!!o?.object_cultural_advice ||
                                                                    !!o?.object_is_featured ||
                                                                    !!o?.object_series_name) && (
                                                                    <Typography
                                                                        component={'p'}
                                                                        sx={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            marginLeft: '-4px',
                                                                            marginTop: '-4px',
                                                                            marginBottom: '6px',
                                                                        }}
                                                                    >
                                                                        {!!o?.object_is_featured && (
                                                                            <>
                                                                                <BookmarkIcon
                                                                                    sx={{
                                                                                        fill: '#51247A',
                                                                                        marginRight: '2px',
                                                                                        width: '20px',
                                                                                    }}
                                                                                />
                                                                                <StyledTagLabelSpan
                                                                                    data-testid={
                                                                                        'dlor-detailpage-featured-custom-indicator'
                                                                                    }
                                                                                    sx={{ marginLeft: '-2px' }}
                                                                                >
                                                                                    Featured
                                                                                </StyledTagLabelSpan>
                                                                            </>
                                                                        )}
                                                                        {!!o?.object_cultural_advice && (
                                                                            <>
                                                                                <InfoIcon
                                                                                    sx={{
                                                                                        fill: '#2377CB',
                                                                                        marginRight: '2px',
                                                                                        width: '20px',
                                                                                    }}
                                                                                />
                                                                                <StyledTagLabelSpan
                                                                                    data-testid={
                                                                                        'dlor-detailpage-cultural-advice-custom-indicator'
                                                                                    }
                                                                                >
                                                                                    Cultural advice
                                                                                </StyledTagLabelSpan>
                                                                            </>
                                                                        )}
                                                                        {!!o?.object_series_name && (
                                                                            <>
                                                                                <PlaylistAddCheckIcon
                                                                                    sx={{
                                                                                        fill: '#4aa74e',
                                                                                        marginRight: '2px',
                                                                                        width: '24px',
                                                                                    }}
                                                                                />
                                                                                <StyledTagLabelSpan
                                                                                    data-testid={
                                                                                        'dlor-detailpage-object_series_name-custom-indicator'
                                                                                    }
                                                                                >
                                                                                    Series: {o?.object_series_name}
                                                                                </StyledTagLabelSpan>
                                                                            </>
                                                                        )}
                                                                    </Typography>
                                                                )}
                                                            </>
                                                            <Typography component={'p'}>{o?.object_summary}</Typography>
                                                        </div>
                                                    </StyleObjectDetailGridItem>
                                                    <Grid item xs={2}>
                                                        <Typography component={'p'}>
                                                            {o?.owner?.publishing_user_username}
                                                        </Typography>
                                                        <Typography
                                                            component={'p'}
                                                            sx={{ textIndent: '-12px', paddingLeft: '12px' }}
                                                        >
                                                            {o?.owner?.team_name}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={1}>
                                                        <IconButton
                                                            data-testid={`dlor-homepage-edit-${o?.object_public_uuid}`}
                                                            onClick={() => navigateToEditPage(o?.object_public_uuid)}
                                                            disabled={o?.object_status === 'deleted'}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Grid>
                                                    <Grid item xs={1}>
                                                        <IconButton
                                                            data-testid={`dlor-homepage-delete-${o?.object_public_uuid}`}
                                                            sx={{ height: '40px' }}
                                                            onClick={() => confirmDelete(o?.object_public_uuid)}
                                                            disabled={o?.object_status === 'deleted'}
                                                        >
                                                            <DeleteForeverIcon />
                                                        </IconButton>
                                                    </Grid>
                                                </StyledPageListItemGridContainer>
                                            );
                                        })}
                                    {!!paginationCount && paginationCount > 0 && (
                                        <StyledPagination
                                            count={paginationCount}
                                            showFirstButton
                                            showLastButton
                                            onChange={handlePaginationChange}
                                            page={paginationPage}
                                        />
                                    )}
                                </Grid>
                            </>
                        );
                    }
                })()}
            </Grid>
        </StandardPage>
    );
};

DLOAdminHomepage.propTypes = {
    actions: PropTypes.any,
    dlorList: PropTypes.array,
    dlorListLoading: PropTypes.bool,
    dlorListError: PropTypes.any,
    dlorItemDeleteError: PropTypes.any,
};

export default DLOAdminHomepage;

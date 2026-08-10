import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ClearIcon from '@mui/icons-material/Clear';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';

import { pageRange, pluralApplications, SORT_NEWEST, SORT_OLDEST } from '../membershipAdmin';
import { default as locale } from '../membershipAdmin.locale';

const strings = locale.list.toolbar;
const resultStrings = locale.list.results;
const exportStrings = locale.list.export;

export const typeOptions = (accountTypes = []) =>
    [...accountTypes].sort((a, b) => String(a.title).localeCompare(String(b.title)));

/**
 * The controls that drive the server query: a search across name and email, a type filter, a sort, and the
 * span of the page that came back. Reload re-runs the current query, for when new applications have arrived.
 */
export const MembershipToolbar = ({
    accountTypes,
    searchText,
    onSearchText,
    type,
    onType,
    sort,
    onSort,
    onReload,
    reloading,
    onExport,
    exporting,
    pagination,
}) => {
    const range = pageRange(pagination);

    return (
        <Box data-testid="membership-toolbar">
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 2 }}>
                <TextField
                    label={strings.search.label}
                    placeholder={strings.search.placeholder}
                    value={searchText}
                    onChange={event => onSearchText(event.target.value)}
                    size="small"
                    sx={{ flex: '2 1 240px', minWidth: 200 }}
                    // The placeholder is always present, so the label floats up out of its way rather than
                    // sitting over it.
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ 'data-testid': 'membership-search-name' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" aria-hidden="true" />
                            </InputAdornment>
                        ),
                        endAdornment: !!searchText && (
                            <InputAdornment position="end">
                                <IconButton
                                    size="small"
                                    aria-label={strings.search.clear}
                                    onClick={() => onSearchText('')}
                                    data-testid="membership-search-clear"
                                    edge="end"
                                >
                                    <ClearIcon fontSize="small" />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    select
                    label={strings.type.label}
                    value={type}
                    onChange={event => onType(event.target.value)}
                    size="small"
                    sx={{ flex: '1 1 170px', minWidth: 150 }}
                    // A native select cannot tell MUI whether it holds a value, so the label is kept floated up
                    // rather than left to overlay the selected option.
                    InputLabelProps={{ shrink: true }}
                    SelectProps={{ native: true }}
                    inputProps={{ 'data-testid': 'membership-filter-type' }}
                >
                    <option value="">{strings.type.any}</option>
                    {typeOptions(accountTypes).map(accountType => (
                        <option key={accountType.value} value={accountType.value}>
                            {accountType.title}
                        </option>
                    ))}
                </TextField>

                <TextField
                    select
                    label={strings.sort.label}
                    value={sort}
                    onChange={event => onSort(event.target.value)}
                    size="small"
                    sx={{ flex: '1 1 150px', minWidth: 140 }}
                    InputLabelProps={{ shrink: true }}
                    SelectProps={{ native: true }}
                    inputProps={{ 'data-testid': 'membership-sort' }}
                >
                    <option value={SORT_NEWEST}>{strings.sort.newest}</option>
                    <option value={SORT_OLDEST}>{strings.sort.oldest}</option>
                </TextField>

                <IconButton
                    aria-label={locale.list.reload}
                    onClick={onReload}
                    disabled={!!reloading}
                    data-testid="membership-reload"
                    sx={{ marginBottom: 0.25 }}
                >
                    <RefreshIcon />
                </IconButton>

                <Button
                    variant="outlined"
                    startIcon={<FileDownloadIcon />}
                    onClick={onExport}
                    disabled={!!exporting}
                    data-testid="membership-export"
                    sx={{ marginBottom: 0.25, whiteSpace: 'nowrap' }}
                >
                    {exporting ? exportStrings.inProgress : exportStrings.label}
                </Button>
            </Box>

            {/* Announced as the query changes, because the list redraws below where focus is. */}
            <Typography
                variant="body2"
                color="text.secondary"
                role="status"
                data-testid="membership-list-status"
                sx={{ marginTop: 1.5 }}
            >
                {range
                    ? resultStrings.showing(range.start, range.end, range.total, pluralApplications(range.total))
                    : resultStrings.noneShort}
            </Typography>
        </Box>
    );
};

MembershipToolbar.propTypes = {
    accountTypes: PropTypes.array,
    searchText: PropTypes.string.isRequired,
    onSearchText: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    onType: PropTypes.func.isRequired,
    sort: PropTypes.string.isRequired,
    onSort: PropTypes.func.isRequired,
    onReload: PropTypes.func.isRequired,
    reloading: PropTypes.bool,
    onExport: PropTypes.func.isRequired,
    exporting: PropTypes.bool,
    pagination: PropTypes.object,
};

export default MembershipToolbar;

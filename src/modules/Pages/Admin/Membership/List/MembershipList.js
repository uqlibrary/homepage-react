import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import SearchOffIcon from '@mui/icons-material/SearchOff';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { breadcrumbs } from 'config/routes';

import { isFrozen } from 'modules/Pages/Membership/membershipOutage';
import { DEFAULT_PER_PAGE, SORT_NEWEST, STATUS_ALL } from '../membershipAdmin';
import MembershipApplicationCard from './MembershipApplicationCard';
import MembershipStatusTiles from './MembershipStatusTiles';
import MembershipToolbar from './MembershipToolbar';
import { default as locale } from '../membershipAdmin.locale';

const strings = locale.list;

// Long enough that a search fires once the admin stops typing, not on every keystroke into a table of
// thousands.
export const SEARCH_DEBOUNCE_MS = 300;

const initialFilters = { type: '', status: STATUS_ALL, sort: SORT_NEWEST };

export const typeTitlesFrom = (accountTypes = []) =>
    accountTypes.reduce((titles, type) => ({ ...titles, [type.value]: type.title }), {});

const Skeletons = () => (
    <Box aria-hidden="true" sx={{ marginTop: 2 }} data-testid="membership-list-skeleton">
        {[0, 1, 2].map(index => (
            <Skeleton key={index} variant="rounded" height={116} sx={{ borderRadius: 2, marginBottom: 1.5 }} />
        ))}
    </Box>
);

export const MembershipList = ({
    actions,
    memberships,
    pagination,
    counts,
    membershipsLoading,
    membershipsError,
    membershipFormData,
    membershipFormDataLoading,
}) => {
    const [filters, setFilters] = useState(initialFilters);
    const [page, setPage] = useState(1);
    // What is in the search box, and the value the query actually runs on once typing settles.
    const [searchInput, setSearchInput] = useState('');
    const [name, setName] = useState('');

    const accountTypes = useMemo(() => membershipFormData?.account_types ?? [], [membershipFormData]);
    const typeTitles = useMemo(() => typeTitlesFrom(accountTypes), [accountTypes]);

    const query = useMemo(
        () => ({
            name,
            type: filters.type,
            status: filters.status,
            sort: filters.sort,
            page,
            perPage: DEFAULT_PER_PAGE,
        }),
        [name, filters, page],
    );

    useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.setAttribute('secondleveltitle', breadcrumbs.membershipadmin.title);
        !!siteHeader && siteHeader.setAttribute('secondLevelUrl', breadcrumbs.membershipadmin.pathname);

        if (!membershipFormData && !membershipFormDataLoading) {
            actions.loadMembershipFormData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // The search settles into the query after a pause, and a new search always starts back at page one.
    useEffect(() => {
        const timer = setTimeout(() => {
            setName(searchInput);
            setPage(1);
        }, SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // One page of the queue is fetched whenever the query changes - which includes the first render.
    useEffect(() => {
        actions.loadMemberships(query);
    }, [query, actions]);

    const onStatus = useCallback(status => {
        setFilters(current => ({ ...current, status }));
        setPage(1);
    }, []);
    const onType = useCallback(type => {
        setFilters(current => ({ ...current, type }));
        setPage(1);
    }, []);
    const onSort = useCallback(sort => {
        setFilters(current => ({ ...current, sort }));
        setPage(1);
    }, []);
    const onReload = useCallback(() => actions.loadMemberships(query), [actions, query]);
    const onClearFilters = useCallback(() => {
        setSearchInput('');
        setFilters(initialFilters);
        setPage(1);
    }, []);

    if (isFrozen()) {
        return (
            <StandardPage title={strings.title}>
                <Alert severity="error" data-testid="membership-admin-frozen">
                    {strings.frozen}
                </Alert>
            </StandardPage>
        );
    }

    const hasLoaded = memberships !== null;
    const showWorkspace = hasLoaded && !membershipsError;
    const filtersActive = name !== '' || filters.type !== '' || filters.status !== STATUS_ALL;
    const pages = pagination?.pages ?? 0;

    return (
        <StandardPage title={strings.title}>
            <StandardCard noHeader>
                {!!membershipsError && (
                    <Alert
                        severity="error"
                        data-testid="membership-list-error"
                        action={
                            <Button color="inherit" size="small" onClick={onReload} data-testid="membership-retry">
                                {strings.retry}
                            </Button>
                        }
                    >
                        {strings.loadFailed}
                    </Alert>
                )}

                {showWorkspace && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <MembershipStatusTiles counts={counts} value={filters.status} onChange={onStatus} />
                        <MembershipToolbar
                            accountTypes={accountTypes}
                            searchText={searchInput}
                            onSearchText={setSearchInput}
                            type={filters.type}
                            onType={onType}
                            sort={filters.sort}
                            onSort={onSort}
                            onReload={onReload}
                            reloading={!!membershipsLoading}
                            pagination={pagination}
                        />
                    </Box>
                )}

                {!!membershipsLoading && <Skeletons />}

                {!membershipsLoading && showWorkspace && memberships.length === 0 && (
                    <Box sx={{ textAlign: 'center', paddingY: 6 }} data-testid="membership-list-empty">
                        <SearchOffIcon sx={{ fontSize: 48, color: 'text.disabled' }} aria-hidden="true" />
                        <Typography variant="subtitle1" sx={{ marginTop: 1, fontWeight: 600 }}>
                            {filtersActive ? strings.results.noMatch : strings.results.none}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {filtersActive ? strings.results.noMatchHint : strings.results.noneHint}
                        </Typography>
                        {filtersActive && (
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={onClearFilters}
                                data-testid="membership-clear-filters"
                                sx={{ marginTop: 2 }}
                            >
                                {strings.results.clear}
                            </Button>
                        )}
                    </Box>
                )}

                {!membershipsLoading && showWorkspace && memberships.length > 0 && (
                    <>
                        <Box
                            component="ul"
                            aria-label={strings.results.caption}
                            data-testid="membership-list"
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1.5,
                                listStyle: 'none',
                                margin: 0,
                                marginTop: 1,
                                padding: 0,
                            }}
                        >
                            {memberships.map(membership => (
                                <MembershipApplicationCard
                                    key={membership.id}
                                    membership={membership}
                                    typeTitles={typeTitles}
                                />
                            ))}
                        </Box>

                        {pages > 1 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                                <Pagination
                                    count={pages}
                                    page={page}
                                    onChange={(event, value) => setPage(value)}
                                    color="primary"
                                    data-testid="membership-pager"
                                    aria-label={strings.pager.label}
                                />
                            </Box>
                        )}
                    </>
                )}
            </StandardCard>
        </StandardPage>
    );
};

MembershipList.propTypes = {
    actions: PropTypes.object.isRequired,
    memberships: PropTypes.array,
    pagination: PropTypes.object,
    counts: PropTypes.object,
    membershipsLoading: PropTypes.bool,
    membershipsError: PropTypes.any,
    membershipFormData: PropTypes.object,
    membershipFormDataLoading: PropTypes.bool,
};

export default MembershipList;

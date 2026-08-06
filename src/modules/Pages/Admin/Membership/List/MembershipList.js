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
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
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

/**
 * What to tell the admin about a failed action.
 *
 * A refusal the backend names ("This applicant is already a member.") reaches us as a plain `{ message }` the
 * shared axios interceptor has passed through, and that message is what the admin needs to read. Anything else
 * rejects as a raw axios Error, whose message names a status code and nothing an admin can act on, so a
 * fallback stands in its place. A rejection that carries nothing at all still has to say something.
 */
export const messageOf = (failure, fallback = strings.errorDialog.unknown) =>
    (!!failure && typeof failure === 'object' && !(failure instanceof Error) && failure.message) || fallback;

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
    // What each card is waiting on, and the record that came back for it. This is not the store's to hold: a
    // confirm answers with one record, and the page it came from is not that record's to rewrite. It clears
    // whenever a fresh page is fetched, so server truth always wins in the end.
    const [rows, setRows] = useState({});
    const [error, setError] = useState(null);

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

    // One page of the queue is fetched whenever the query changes - which includes the first render. A fresh
    // page is the moment any card-level overrides stop applying, so they are dropped here and the triage
    // counts that arrive with the page speak for the queue again.
    useEffect(() => {
        setRows({});
        actions.loadMemberships(query);
    }, [query, actions]);

    const setRow = (id, patch) => setRows(current => ({ ...current, [id]: { ...current[id], ...patch } }));

    // A card shows what its last confirm returned, if it has had one, and the server's record otherwise.
    const displayed = (memberships ?? []).map(membership => rows[membership.id]?.record ?? membership);

    const onConfirm = async membership => {
        setRow(membership.id, { busy: 'confirming' });
        try {
            const confirmed = await actions.confirmMembership(membership);
            setRow(membership.id, { busy: null, record: confirmed });
        } catch (failure) {
            setRow(membership.id, { busy: null });
            setError(messageOf(failure));
        }
    };

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
                            {displayed.map(membership => (
                                <MembershipApplicationCard
                                    key={membership.id}
                                    membership={membership}
                                    typeTitles={typeTitles}
                                    busy={rows[membership.id]?.busy}
                                    onConfirm={onConfirm}
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

            {/* One dialog for whatever an action failed with. It carries no cancel: there is nothing to undo,
                only a message to read and dismiss. */}
            <ConfirmationBox
                confirmationBoxId={strings.errorDialog.confirmationBoxId}
                isOpen={!!error}
                hideCancelButton
                locale={{
                    confirmationTitle: strings.errorDialog.confirmationTitle,
                    confirmationMessage: `${strings.errorDialog.confirmationMessage} ${error ?? ''}`,
                    confirmButtonLabel: strings.errorDialog.confirmButtonLabel,
                }}
                onAction={() => setError(null)}
                onClose={() => setError(null)}
            />
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

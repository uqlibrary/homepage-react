import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { buildCsv, downloadCsv } from '../membershipCsv';
import MembershipApplicationCard, { fullName } from './MembershipApplicationCard';
import MembershipApplicationDialog from './MembershipApplicationDialog';
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
    // A one-off note to show the admin - here, whether a renewal email went out. Distinct from `error`: this
    // reports the outcome of an action that completed, not a failure.
    const [message, setMessage] = useState(null);
    // The application awaiting the delete prompt, if any. Delete cannot be undone, so it is asked for before it
    // is done rather than fired straight from the card.
    const [pendingDelete, setPendingDelete] = useState(null);
    // True while the export is gathering the matching set across pages, so the control reads as busy and cannot
    // be fired again mid-gather.
    const [exporting, setExporting] = useState(false);
    // The application whose full record is open in the view/edit dialog, if any, and whether a save from it is
    // in flight.
    const [pendingView, setPendingView] = useState(null);
    const [viewSaving, setViewSaving] = useState(false);
    // The control the view dialog was opened from, so focus can be returned to it when the dialog closes
    // (WCAG 2.4.3). Focus is moved off it as the dialog opens - otherwise the dialog marks the rest of the page
    // hidden from assistive tech while this button is still the focused element - and put back here on close.
    const viewTriggerRef = useRef(null);

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

    const onDelete = async membership => {
        setRow(membership.id, { busy: 'deleting' });
        try {
            await actions.deleteMembership(membership.id);
            setRow(membership.id, { busy: null, deleted: true });
        } catch (failure) {
            setRow(membership.id, { busy: null });
            setError(messageOf(failure));
        }
    };

    const onUpdate = async (membership, attribute, value) => {
        setRow(membership.id, { busy: 'updating' });
        try {
            const saved = await actions.updateMembership({ ...membership, [attribute]: value });
            setRow(membership.id, { busy: null, record: saved });
        } catch (failure) {
            // The save did not take, so the card is left showing what it showed before - the value still held
            // on the server - rather than the rejected edit. A barcode-specific reason stands in where the
            // backend's own text cannot go on screen.
            setRow(membership.id, { busy: null });
            setError(messageOf(failure, attribute === 'barcode' ? strings.errorDialog.barcodeRejected : undefined));
        }
    };

    const onResend = async membership => {
        // The endpoint reports whether it sent by its answer rather than by an error, so a truthy result is a
        // send and a falsy one is not; a request that could not be reached at all is reported as not sent too.
        try {
            const sent = await actions.resendRenewalEmail(membership.id);
            setMessage(`${fullName(membership)}: ${sent ? strings.resendDialog.sent : strings.resendDialog.notSent}`);
        } catch (failure) {
            setMessage(`${fullName(membership)}: ${strings.resendDialog.notSent}`);
        }
    };

    const onView = membership => {
        // Remember the control the record was opened from, then take focus off it before the dialog hides the
        // page behind it, so the focused element is never inside the hidden region. A dialog is always opened
        // from a focused control, so the guard's empty side is only ever the defensive one.
        const trigger = document.activeElement;
        viewTriggerRef.current = trigger;
        /* istanbul ignore else */
        if (trigger instanceof HTMLElement) {
            trigger.blur();
        }
        setPendingView(membership);
    };

    const onCloseView = () => {
        setPendingView(null);
        // Return focus once the dialog has released the page, so it lands on a control that is no longer hidden.
        const trigger = viewTriggerRef.current;
        /* istanbul ignore else */
        if (trigger instanceof HTMLElement) {
            requestAnimationFrame(() => trigger.focus());
        }
    };

    const onSaveView = async edited => {
        // The whole record is sent back with the changed contact fields, the same update path the inline edits
        // take. On success the card takes on what was saved and the dialog closes; on failure the dialog stays
        // open over the reason, so the admin can correct and try again.
        setViewSaving(true);
        try {
            const saved = await actions.updateMembership(edited);
            setRow(saved.id, { busy: null, record: saved });
            onCloseView();
        } catch (failure) {
            setError(messageOf(failure));
        } finally {
            setViewSaving(false);
        }
    };

    const onExport = async () => {
        // Gather every matching application, not just the page on screen, then hand it to the browser as a
        // file. A failure to gather the set is reported the same way an action failure is.
        setExporting(true);
        try {
            const all = await actions.fetchAllMemberships(query);
            downloadCsv(strings.export.filename, buildCsv(all, typeTitles));
        } catch (failure) {
            setError(messageOf(failure));
        } finally {
            setExporting(false);
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
                            onExport={onExport}
                            exporting={exporting}
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
                                    deleted={!!rows[membership.id]?.deleted}
                                    onConfirm={onConfirm}
                                    onDelete={setPendingDelete}
                                    onUpdate={onUpdate}
                                    onResend={onResend}
                                    onView={onView}
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

            {/* The delete prompt. It only ever acts on the application the admin asked to delete, and closing
                it - by any route - clears that intent. */}
            <ConfirmationBox
                confirmationBoxId={strings.deleteDialog.confirmationBoxId}
                isOpen={!!pendingDelete}
                locale={{
                    confirmationTitle: strings.deleteDialog.confirmationTitle,
                    confirmationMessage: pendingDelete
                        ? strings.deleteDialog.confirmationMessage(fullName(pendingDelete))
                        : '',
                    confirmButtonLabel: strings.deleteDialog.confirmButtonLabel,
                    cancelButtonLabel: strings.deleteDialog.cancelButtonLabel,
                }}
                onAction={() => onDelete(pendingDelete)}
                onCancelAction={() => setPendingDelete(null)}
                onClose={() => setPendingDelete(null)}
            />

            {/* The full record, opened from a card to read it whole and correct the applicant's contact
                details. It stays mounted so focus returns to the card's control when it closes. */}
            <MembershipApplicationDialog
                membership={pendingView}
                membershipFormData={membershipFormData}
                typeTitles={typeTitles}
                open={!!pendingView}
                saving={viewSaving}
                onSave={onSaveView}
                onClose={onCloseView}
            />

            {/* The outcome of a resend, reported whether it sent or not. No cancel - there is only a result to
                read and dismiss. */}
            <ConfirmationBox
                confirmationBoxId={strings.resendDialog.confirmationBoxId}
                isOpen={!!message}
                hideCancelButton
                locale={{
                    confirmationTitle: strings.row.resend,
                    confirmationMessage: message ?? '',
                    confirmButtonLabel: strings.resendDialog.confirmButtonLabel,
                }}
                onAction={() => setMessage(null)}
                onClose={() => setMessage(null)}
            />

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

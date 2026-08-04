import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import SearchOffIcon from '@mui/icons-material/SearchOff';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { breadcrumbs } from 'config/routes';

import { isFrozen } from 'modules/Pages/Membership/membershipOutage';
import MembershipApplicationCard from './MembershipApplicationCard';
import MembershipSearchForm from './MembershipSearchForm';
import { default as locale } from '../membershipAdmin.locale';

const strings = locale.list;

// What the API's own paging is tuned to, and more than a queue ever holds at once.
export const SEARCH_LIMIT = 100;

export const typeTitlesFrom = (accountTypes = []) =>
    accountTypes.reduce((titles, type) => ({ ...titles, [type.value]: type.title }), {});

export const MembershipList = ({
    actions,
    memberships,
    membershipsLoading,
    membershipsError,
    membershipFormData,
    membershipFormDataLoading,
}) => {
    // Held steady across renders, or the `?? []` fallback would be a new array each time and every row would
    // redraw on any state change at all.
    const accountTypes = useMemo(() => membershipFormData?.account_types ?? [], [membershipFormData]);
    const typeTitles = useMemo(() => typeTitlesFrom(accountTypes), [accountTypes]);

    useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.setAttribute('secondleveltitle', breadcrumbs.membershipadmin.title);
        !!siteHeader && siteHeader.setAttribute('secondLevelUrl', breadcrumbs.membershipadmin.pathname);

        if (!membershipFormData && !membershipFormDataLoading) {
            actions.loadMembershipFormData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSearch = useCallback(
        values => {
            actions.loadMemberships(values, SEARCH_LIMIT);
        },
        [actions],
    );

    if (isFrozen()) {
        return (
            <StandardPage title={strings.title}>
                <Alert severity="error" data-testid="membership-admin-frozen">
                    {strings.frozen}
                </Alert>
            </StandardPage>
        );
    }

    return (
        <StandardPage title={strings.title}>
            <StandardCard noHeader>
                {!!membershipFormDataLoading && <InlineLoader message={strings.loading} />}

                {!membershipFormDataLoading && (
                    <MembershipSearchForm
                        accountTypes={accountTypes}
                        searching={!!membershipsLoading}
                        onSearch={onSearch}
                    />
                )}

                {!!membershipsError && (
                    <Alert severity="error" sx={{ marginTop: 2 }} data-testid="membership-list-error">
                        {strings.loadFailed}
                    </Alert>
                )}

                {/* Results land below the button that asked for them, so they are announced rather than found. */}
                <Box role="status" sx={{ marginTop: 2 }} data-testid="membership-list-status">
                    {!membershipsLoading && !!memberships && (
                        <Typography variant="body2" color="text.secondary">
                            {memberships.length === 0
                                ? strings.results.none
                                : strings.results.count(memberships.length)}
                        </Typography>
                    )}
                </Box>

                {/* Cards in the shape of the ones about to arrive, rather than a spinner in the middle of an
                    empty page: the page does not jump when they land, and the wait is legible as "results are
                    coming" rather than "something is happening". The count above is what is announced. */}
                {!!membershipsLoading && (
                    <Box aria-hidden="true" sx={{ marginTop: 1 }} data-testid="membership-list-skeleton">
                        {[0, 1, 2].map(index => (
                            <Skeleton
                                key={index}
                                variant="rounded"
                                height={116}
                                sx={{ borderRadius: 2, marginBottom: 1.5 }}
                            />
                        ))}
                    </Box>
                )}

                {!membershipsLoading && memberships?.length === 0 && (
                    <Box sx={{ textAlign: 'center', paddingY: 6 }} data-testid="membership-list-empty">
                        <SearchOffIcon sx={{ fontSize: 48, color: 'text.disabled' }} aria-hidden="true" />
                        <Typography variant="subtitle1" sx={{ marginTop: 1, fontWeight: 600 }}>
                            {strings.results.none}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {strings.results.noneHint}
                        </Typography>
                    </Box>
                )}

                {!membershipsLoading && !!memberships?.length && (
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
                )}
            </StandardCard>
        </StandardPage>
    );
};

MembershipList.propTypes = {
    actions: PropTypes.object.isRequired,
    memberships: PropTypes.array,
    membershipsLoading: PropTypes.bool,
    membershipsError: PropTypes.any,
    membershipFormData: PropTypes.object,
    membershipFormDataLoading: PropTypes.bool,
};

export default MembershipList;

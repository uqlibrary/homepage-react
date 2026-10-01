import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { AUTH_URL_LOGIN } from 'config/general';
import { pathConfig } from 'config/pathConfig';
import { breadcrumbs } from 'config/routes';

import ConfigText from '../SharedComponents/ConfigText';
import locale from '../membership.locale';

const { landing } = locale;

/**
 * One list, laid out over two columns on a wide screen.
 *
 * A single list that CSS happens to lay out in columns reads as "list of 12 items" to a screen reader - which
 * is what it is - rather than as two unrelated lists of arbitrary length.
 */
const StyledTypeList = styled('ul')(({ theme }) => ({
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    columnGap: theme.spacing(4),
    [theme.breakpoints.down('md')]: {
        gridTemplateColumns: '1fr',
    },
}));

const StyledTypeListItem = styled('li')(({ theme }) => ({
    marginBottom: theme.spacing(3),
    '& .membership-type-description': {
        marginBlock: theme.spacing(0.5),
    },
}));

// Target size, so the apply link is comfortably tappable and not crowded by its neighbours (WCAG 2.5.8).
const StyledApplyLink = styled(Link)(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: 24,
    paddingBlock: theme.spacing(0.5),
    marginBlockStart: theme.spacing(0.5),
}));

export const MembershipLanding = ({
    actions,
    account,
    accountLoading,
    membershipFormData,
    membershipFormDataLoading,
    membershipFormDataError,
    membershipRenewing,
    membershipRenewingLoading,
    membershipRenewingError,
}) => {
    const accountTypes = membershipFormData?.account_types;

    const isLoggedIn = !!account;
    const isRenewing = isLoggedIn && membershipRenewing?.renewing === true;

    useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.setAttribute('secondleveltitle', breadcrumbs.membership.title);
        !!siteHeader && siteHeader.setAttribute('secondLevelUrl', breadcrumbs.membership.pathname);
    }, []);

    useEffect(() => {
        /* istanbul ignore else */
        if (!membershipFormDataError && !membershipFormDataLoading && !membershipFormData) {
            actions.loadMembershipFormData();
        }
    }, [actions, membershipFormData, membershipFormDataError, membershipFormDataLoading]);

    // Only a signed-in member can have a renewal waiting for them, so there is nothing to ask about until the
    // account has arrived.
    useEffect(() => {
        if (isLoggedIn && !membershipRenewingError && !membershipRenewingLoading && !membershipRenewing) {
            actions.checkIsRenewing();
        }
    }, [actions, isLoggedIn, membershipRenewing, membershipRenewingError, membershipRenewingLoading]);

    const loginUrl = `${AUTH_URL_LOGIN}?return=${window.btoa(window.location.href)}`;
    const renewalUrl =
        !!membershipRenewing &&
        pathConfig.membershipRenewal(membershipRenewing.type, membershipRenewing.id, membershipRenewing.renewal_code);

    // Until we know whether they are signed in, saying "not a member?" to an existing member would be wrong,
    // so the intro waits rather than guessing.
    const introReady = accountLoading === false;

    return (
        <StandardPage title={landing.title}>
            <div data-testid="membership-landing">
                {!!introReady && (
                    <Box data-testid="membership-landing-intro" sx={{ marginBottom: 3 }}>
                        {!isLoggedIn && (
                            <>
                                <Typography data-testid="membership-landing-returning">
                                    {landing.anonymous.returningMember}{' '}
                                    <a data-testid="membership-landing-login" href={loginUrl}>
                                        {landing.anonymous.login}
                                    </a>
                                </Typography>
                                <Typography>{landing.anonymous.notAMember}</Typography>
                            </>
                        )}

                        {!!isRenewing && (
                            <>
                                <Typography data-testid="membership-landing-renewal">
                                    {landing.renewing.prompt}{' '}
                                    <Link data-testid="membership-landing-renew-link" to={renewalUrl}>
                                        {landing.renewing.renew}
                                    </Link>
                                </Typography>
                                <Typography>{landing.renewing.orApply}</Typography>
                            </>
                        )}

                        {!!isLoggedIn && !isRenewing && (
                            <Typography data-testid="membership-landing-welcome">
                                {landing.loggedIn.becomeAMember}
                            </Typography>
                        )}

                        <Typography id="membership-type-list-label">{landing.chooseType}</Typography>
                    </Box>
                )}

                {!!membershipFormDataLoading && <InlineLoader message="Loading membership types" />}

                {!!membershipFormDataError && (
                    <Typography data-testid="membership-landing-error" role="alert" color="error">
                        {landing.loadFailed}
                    </Typography>
                )}

                {!membershipFormDataLoading && !membershipFormDataError && !!accountTypes && (
                    <StyledTypeList
                        data-testid="membership-type-list"
                        aria-label={introReady ? undefined : landing.typeListLabel}
                        aria-labelledby={introReady ? 'membership-type-list-label' : undefined}
                    >
                        {accountTypes.map(type => (
                            <StyledTypeListItem key={type.value} data-testid={`membership-type-${type.value}`}>
                                <Typography component="h2" variant="h6">
                                    {type.title}
                                </Typography>
                                <ConfigText
                                    className="membership-type-description"
                                    component="p"
                                    data-testid={`membership-type-${type.value}-description`}
                                    text={type.description}
                                />
                                <StyledApplyLink
                                    data-testid={`membership-type-${type.value}-apply`}
                                    to={pathConfig.membershipForm(type.value)}
                                    aria-label={landing.applyLabel(type.title)}
                                >
                                    {landing.apply}
                                </StyledApplyLink>
                            </StyledTypeListItem>
                        ))}
                    </StyledTypeList>
                )}
            </div>
        </StandardPage>
    );
};

MembershipLanding.propTypes = {
    actions: PropTypes.object,
    account: PropTypes.object,
    accountLoading: PropTypes.bool,
    membershipFormData: PropTypes.object,
    membershipFormDataLoading: PropTypes.bool,
    membershipFormDataError: PropTypes.any,
    membershipRenewing: PropTypes.object,
    membershipRenewingLoading: PropTypes.bool,
    membershipRenewingError: PropTypes.any,
};

export default MembershipLanding;

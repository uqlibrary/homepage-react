import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import { styled } from '@mui/material/styles';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { isTestTagUser } from 'helpers/access';
import UserAttention from 'modules/SharedComponents/Toolbox/UserAttention';
import PaperCutMenu from './PaperCutMenu';
import { totalFines, markedLoanQuantity, markedRequestQuantity } from './Helpers';
import {
    dSTimeClockFileSearchIcon,
    dsStarIcon,
    dsStudyBookIcon,
    dsBookCloseBookmarkIcon,
    dsChecklistIcon,
} from './Icons';

const StyledAlertDiv = styled('div')(() => ({
    display: 'flex',
    marginRight: '24px',
    marginBottom: '24px',
    marginLeft: '25px',
    '& a': {
        marginLeft: '30px',
    },
    '& > div': {
        width: '100%',
    },
}));

const StyledUl = styled('ul')(({ theme }) => ({
    marginBottom: 0,
    '& li': {
        paddingBottom: '16px',
        marginLeft: '-20px',
        listStyleType: 'none',
        '& button': {
            color: theme.palette.primary.main,
            fontWeight: 500,
            fontSize: '16px',
            textAlign: 'left',
            textTransform: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            lineHeight: 'normal',
            padding: '0 4px',
            '&:hover': {
                backgroundColor: 'inherit',
            },
            '& span': {
                textDecoration: 'underline',
                '&:hover': {
                    backgroundColor: theme.palette.primary.main,
                    color: '#fff',
                },
            },
            '& svg:first-of-type': {
                stroke: theme.palette.primary.main,
                paddingRight: '12px',
            },
            '& .MuiTouchRipple-root': {
                display: 'none', // remove mui ripple
            },
        },
        '& a': {
            display: 'inline-flex',
            alignItems: 'center',
            paddingLeft: '4px',
            '&:hover': {
                color: 'inherit',
                backgroundColor: 'inherit',
                textDecorationColor: 'white',
            },
            '& svg': {
                stroke: theme.palette.primary.main,
                paddingRight: '12px',
            },
            '&:hover span': {
                color: '#fff',
                backgroundColor: theme.palette.primary.main,
            },
            '&:hover svg': {
                color: 'inherit',
                backgroundColor: 'inherit',
            },
            '&:hover path': {
                color: 'inherit',
                backgroundColor: 'inherit',
            },
        },
    },
}));

const PRIME_ROOT = 'https://search.library.uq.edu.au/discovery';

export const AccountPanel = ({
    account,
    loans,
    loansLoading,
    printBalance,
    printBalanceLoading,
    printBalanceError,
}) => {
    return (
        <StandardCard subCard noPadding primaryHeader standardCardId="catalogue-panel" title="Your library account">
            <StyledUl>
                <li data-testid={'show-searchhistory'}>
                    <Link to={`${PRIME_ROOT}/favorites?vid=61UQ_INST:61UQ&lang=en&section=search_history`}>
                        {dSTimeClockFileSearchIcon} <span>Search history</span>
                    </Link>
                </li>
                <li data-testid={'show-savedsearches'}>
                    <Link to={`${PRIME_ROOT}/favorites?vid=61UQ_INST:61UQ&lang=en&section=queries`}>
                        {dsStarIcon} <span>Saved searches</span>
                    </Link>
                </li>
                <li data-testid={'show-requests'}>
                    <Link to={`${PRIME_ROOT}/account?vid=61UQ_INST:61UQ&section=requests&lang=en`}>
                        {dsStudyBookIcon} <span>Requests {markedRequestQuantity(loans, loansLoading)}</span>
                    </Link>
                </li>
                <li data-testid={'show-loans'}>
                    <Link
                        to={`${PRIME_ROOT}/account?vid=61UQ_INST:61UQ&section=loans&lang=en`}
                        data-analyticsid={'pp-loans-menu-button'}
                    >
                        {dsBookCloseBookmarkIcon} <span>Loans {markedLoanQuantity(loans, loansLoading)}</span>
                    </Link>
                </li>
                <li data-testid={'show-papercut'}>
                    <PaperCutMenu
                        account={account}
                        printBalance={printBalance}
                        printBalanceLoading={printBalanceLoading}
                        printBalanceError={printBalanceError}
                    />
                </li>
                {isTestTagUser(account) && (
                    <li data-testid={'show-testntag'}>
                        <Link to={'admin/testntag'}>
                            {dsChecklistIcon}
                            <span>Test and tag</span>
                        </Link>
                    </li>
                )}
            </StyledUl>
            {!!loans && loans.total_fines_count > 0 && (
                <StyledAlertDiv data-testid={'show-fines'}>
                    <UserAttention titleText={'Fines and charges'}>
                        <Link
                            to={`${PRIME_ROOT}/account?vid=61UQ_INST:61UQ&section=fines&lang=en`}
                            id="fines-and-charges-link"
                            data-analyticsid={'pp-fines-tooltip'}
                        >
                            <span>${`${totalFines(loans?.fines)}`} payable</span>
                        </Link>
                    </UserAttention>
                </StyledAlertDiv>
            )}
        </StandardCard>
    );
};

AccountPanel.propTypes = {
    account: PropTypes.object,
    loans: PropTypes.object,
    loansLoading: PropTypes.bool,
    printBalance: PropTypes.object,
    printBalanceLoading: PropTypes.bool,
    printBalanceError: PropTypes.bool,
};

export default AccountPanel;

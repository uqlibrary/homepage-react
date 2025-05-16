import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { styled } from '@mui/material/styles';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { isTestTagUser } from 'helpers/access';
import UserAttention from 'modules/SharedComponents/Toolbox/UserAttention';
import PaperCutMenu from './PaperCutMenu';

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
            color: theme.palette.primary.light,
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
                    backgroundColor: theme.palette.primary.light,
                    color: '#fff',
                },
            },
            '& svg:first-of-type': {
                stroke: theme.palette.primary.light,
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
                stroke: theme.palette.primary.light,
                paddingRight: '12px',
            },
            '&:hover span': {
                color: '#fff',
                backgroundColor: theme.palette.primary.light,
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

const dsStarIcon = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
        <g id="star">
            <path
                d="M12.6988 3.43449L14.9056 7.8896C14.9557 8.00269 15.0347 8.10063 15.1345 8.17369C15.2344 8.24675 15.3516 8.29235 15.4746 8.30597L20.3461 9.02767C20.4871 9.04581 20.6201 9.1037 20.7294 9.19458C20.8388 9.28545 20.9201 9.40559 20.9639 9.54094C21.0074 9.67627 21.0117 9.82125 20.9761 9.95891C20.9404 10.0966 20.8663 10.2213 20.7625 10.3184L17.2511 13.802C17.1615 13.8857 17.0942 13.9905 17.0554 14.1069C17.0167 14.2232 17.0075 14.3474 17.0291 14.4682L17.8757 19.3674C17.9001 19.5081 17.8847 19.653 17.831 19.7854C17.7771 19.9178 17.6873 20.0325 17.5717 20.1163C17.456 20.2003 17.3191 20.25 17.1765 20.2598C17.0339 20.2698 16.8915 20.2394 16.7654 20.1724L12.3796 17.8546C12.2673 17.7995 12.1439 17.7708 12.0188 17.7708C11.8936 17.7708 11.7702 17.7995 11.6579 17.8546L7.27219 20.1724C7.14601 20.2394 7.00355 20.2698 6.861 20.2598C6.71845 20.25 6.58153 20.2003 6.46585 20.1163C6.35016 20.0325 6.26034 19.9178 6.2066 19.7854C6.15286 19.653 6.13737 19.5081 6.16188 19.3674L7.00849 14.4127C7.02995 14.2919 7.02087 14.1677 6.98209 14.0514C6.9433 13.935 6.87604 13.8302 6.78643 13.7465L3.23344 10.3184C3.12833 10.2186 3.05441 10.0905 3.02063 9.94953C2.98686 9.80858 2.99468 9.66085 3.04315 9.52425C3.09162 9.38766 3.17866 9.26805 3.29372 9.17991C3.40879 9.09178 3.54694 9.0389 3.69145 9.02767L8.56292 8.30597C8.68589 8.29235 8.80314 8.24675 8.90298 8.17369C9.00281 8.10063 9.08177 8.00269 9.13195 7.8896L11.3387 3.43449C11.3988 3.30474 11.4947 3.19489 11.6153 3.1179C11.7358 3.04091 11.8758 3 12.0188 3C12.1617 3 12.3018 3.04091 12.4223 3.1179C12.5428 3.19489 12.6387 3.30474 12.6988 3.43449Z"
                stroke="#4B2271"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </g>
    </svg>
);

const dsStudyBookIcon = (
    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
        <g clipPath="url(#clip0_1362_2629)">
            <path
                d="M6.94119 14.9674C5.39361 14.4538 3.7794 14.1686 2.14952 14.1209C1.84375 14.1045 1.55608 13.9708 1.34635 13.7477C1.13662 13.5246 1.02098 13.2292 1.02348 12.923V2.25354C1.02318 2.08999 1.05638 1.92812 1.12103 1.77789C1.18567 1.62766 1.28039 1.49226 1.39936 1.38003C1.51832 1.2678 1.65901 1.18112 1.81274 1.12532C1.96648 1.06953 2.13002 1.04581 2.29327 1.05563C7.34848 1.31917 9.99987 3.12403 9.99987 4.49764C9.99987 3.13201 12.9707 1.34313 17.6985 1.06361C17.8633 1.05029 18.0291 1.07145 18.1852 1.12577C18.3414 1.18008 18.4845 1.26634 18.6055 1.37905C18.7265 1.49176 18.8226 1.62844 18.8879 1.78039C18.9531 1.93233 18.9859 2.09619 18.9842 2.26153V12.324"
                stroke="#51247A"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M10 4.49756V7.60416" stroke="#51247A" strokeLinecap="round" strokeLinejoin="round" />
            <path
                d="M7.876 5.64757C6.43958 5.12659 4.94637 4.77808 3.42773 4.60938"
                stroke="#51247A"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M7.876 8.69012C6.43764 8.17733 4.94508 7.83166 3.42773 7.65991"
                stroke="#51247A"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M18.8963 18.9843L18.9762 18.0899C19.0288 17.5095 18.868 16.9299 18.524 16.4595C18.1801 15.9891 17.6764 15.6602 17.1074 15.5343L14.1925 14.8875V10.3034C14.2075 10.0976 14.18 9.89088 14.1115 9.69617C14.0431 9.50146 13.9352 9.32295 13.7947 9.17179C13.6542 9.02063 13.484 8.90007 13.2948 8.81762C13.1056 8.73518 12.9015 8.69263 12.6951 8.69263C12.4887 8.69263 12.2845 8.73518 12.0953 8.81762C11.9061 8.90007 11.7359 9.02063 11.5954 9.17179C11.4549 9.32295 11.3471 9.50146 11.2786 9.69617C11.2102 9.89088 11.1826 10.0976 11.1977 10.3034V17.6507L9.99977 16.7642C9.76416 16.5846 9.47131 16.4967 9.17574 16.5169C8.88016 16.5371 8.60198 16.664 8.39298 16.8739C8.18398 17.0839 8.05838 17.3627 8.03958 17.6584C8.02077 17.954 8.11003 18.2465 8.29074 18.4812L8.66609 18.9843"
                stroke="#51247A"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </g>
        <defs>
            <clipPath id="clip0_1362_2629">
                <rect width="20" height="20" fill="white" />
            </clipPath>
        </defs>
    </svg>
);

const dsBookCloseBookmarkIcon = (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true" focusable="false">
        <g id="Book-Close-Bookmark-1--Streamline-Streamline--3.0" clipPath="url(#clip0_1183_4075)">
            <path
                d="M18.5469 20.2336H5.33984C4.83945 20.2336 4.35956 20.0349 4.00573 19.681C3.6519 19.3272 3.45313 18.8473 3.45312 18.3469"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M11 2.62427H5.96875C5.30156 2.62427 4.66171 2.88931 4.18993 3.36108C3.71816 3.83285 3.45313 4.47271 3.45312 5.13989V18.3469C3.45312 17.8465 3.6519 17.3666 4.00573 17.0128C4.35956 16.659 4.83945 16.4602 5.33984 16.4602H17.918C18.0848 16.4602 18.2447 16.3939 18.3627 16.276C18.4806 16.1581 18.5469 15.9981 18.5469 15.8313V3.25317C18.5469 3.08638 18.4806 2.92641 18.3627 2.80847C18.2447 2.69053 18.0848 2.62427 17.918 2.62427H16.0312"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M17.2893 20.2336V16.4602" strokeLinecap="round" strokeLinejoin="round" />
            <path
                d="M16.0312 11.4292L13.5156 8.91357L11 11.4292V2.62451C11 2.29092 11.1325 1.97099 11.3684 1.7351C11.6043 1.49922 11.9242 1.3667 12.2578 1.3667H14.7734C15.107 1.3667 15.427 1.49922 15.6628 1.7351C15.8987 1.97099 16.0312 2.29092 16.0312 2.62451V11.4292Z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </g>
        <defs>
            <clipPath>
                <rect width="21" height="21" fill="white" transform="translate(0.5 0.300049)" />
            </clipPath>
        </defs>
    </svg>
);

const dSTimeClockFileSearchIcon = (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true" focusable="false">
        <g id="Time-Clock-File-Search--Streamline-Streamline--3.0 1" clipPath="url(#clip0_1180_4054)">
            <path
                d="M6.68452 12.862C6.12021 12.6618 5.61163 12.3302 5.20082 11.8946C4.79001 11.459 4.48876 10.9319 4.32196 10.3568C4.15517 9.78172 4.12762 9.17521 4.2416 8.58739C4.35558 7.99957 4.6078 7.44731 4.97743 6.97625C5.34707 6.50519 5.82349 6.12885 6.36734 5.87834C6.91119 5.62784 7.50684 5.51034 8.10508 5.53558C8.70332 5.56082 9.28696 5.72805 9.80778 6.02347C10.3286 6.31889 10.7716 6.73401 11.1003 7.23453"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M9.20815 9.30898H7.95117V8.052" strokeLinecap="round" strokeLinejoin="round" />
            <path
                d="M8.58014 18.1077H2.92334C2.58975 18.1077 2.26982 17.9752 2.03393 17.7393C1.79805 17.5034 1.66553 17.1835 1.66553 16.8499V3.02319C1.66553 2.6896 1.79805 2.36967 2.03393 2.13379C2.26982 1.8979 2.58975 1.76538 2.92334 1.76538H11.8303C12.1637 1.76545 12.4834 1.89786 12.7192 2.1335L15.1258 4.54012C15.3614 4.77591 15.4938 5.09561 15.4939 5.42897V6.79495"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M9.84912 14.3486C9.84912 15.5155 10.3127 16.6346 11.1378 17.4597C11.9629 18.2848 13.082 18.7484 14.2489 18.7484C15.4159 18.7484 16.535 18.2848 17.3601 17.4597C18.1852 16.6346 18.6488 15.5155 18.6488 14.3486C18.6488 13.1817 18.1852 12.0625 17.3601 11.2374C16.535 10.4123 15.4159 9.94873 14.2489 9.94873C13.082 9.94873 11.9629 10.4123 11.1378 11.2374C10.3127 12.0625 9.84912 13.1817 9.84912 14.3486Z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M20.534 20.6336L17.3601 17.4597" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
            <clipPath>
                <rect width="21" height="21" fill="white" transform="translate(0.600098 0.699951)" />
            </clipPath>
        </defs>
    </svg>
);

const dsChecklistIcon = (
    <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" width="22" height="22">
        <path
            d="M3.81513 2.57129H20.1438C20.8724 2.57129 21.4296 3.12844 21.4296 3.81416V20.1429C21.4296 20.8286 20.8724 21.3857 20.1867 21.3857H3.81513C3.12941 21.4286 2.57227 20.8714 2.57227 20.1857V3.81416C2.57227 3.12844 3.12941 2.57129 3.81513 2.57129Z"
            stroke="#51247A"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />
        <path
            d="M12.0002 5.7002L8.22879 10.7145L5.7002 8.18593"
            stroke="#51247A"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />
        <path d="M13.8857 8.87109H17.6582" stroke="#51247A" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path
            d="M12.0002 13.2432L8.22879 18.2575L5.7002 15.7289"
            stroke="#51247A"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />
        <path d="M13.8857 16.4141H17.6582" stroke="#51247A" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
);

export const AccountPanel = ({
    account,
    loans,
    loansLoading,
    printBalance,
    printBalanceLoading,
    printBalanceError,
}) => {
    function totalFines(fines) {
        return fines.reduce((sum, fine) => {
            return sum + (typeof fine.fineAmount === 'number' ? fine.fineAmount : /* istanbul ignore next */ 0);
        }, 0);
    }

    function markedLoanQuantity() {
        if (!!loansLoading || !loans?.hasOwnProperty('total_loans_count')) {
            return null;
        }
        return <> ({`${loans?.total_loans_count}`})</>;
    }

    function markedRequestQuantity() {
        if (!!loansLoading || !loans?.hasOwnProperty('total_holds_count')) {
            return null;
        }
        return <> ({`${loans?.total_holds_count}`})</>;
    }

    return (
        <StandardCard subCard noPadding primaryHeader standardCardId="catalogue-panel" title="Your library account">
            <StyledUl>
                <li data-testid={'show-searchhistory'}>
                    <Link to="https://search.library.uq.edu.au/primo-explore/favorites?vid=61UQ&lang=en_US&section=search_history">
                        {dSTimeClockFileSearchIcon} <span>Search history</span>
                    </Link>
                </li>
                <li data-testid={'show-savedsearches'}>
                    <Link to="https://search.library.uq.edu.au/primo-explore/favorites?vid=61UQ&lang=en_US&section=queries">
                        {dsStarIcon} <span>Saved searches</span>
                    </Link>
                </li>
                <li data-testid={'show-requests'}>
                    <Link to="https://search.library.uq.edu.au/primo-explore/account?vid=61UQ&section=requests&lang=en_US">
                        {dsStudyBookIcon} <span>Requests {markedRequestQuantity()}</span>
                    </Link>
                </li>
                <li data-testid={'show-loans'}>
                    <Link
                        to="https://search.library.uq.edu.au/primo-explore/account?vid=61UQ&section=loans&lang=en_US"
                        data-analyticsid={'pp-loans-menu-button'}
                    >
                        {dsBookCloseBookmarkIcon} <span>Loans {markedLoanQuantity()}</span>
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
                {isTestTagUser(account) &&
                /* istanbul ignore next */ !['uqldegro', 'uqslanca', 'uqjtilse'].includes(account.id) && ( // hide until end of 2024 dev(
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
                            to="https://search.library.uq.edu.au/primo-explore/account?vid=61UQ&section=fines&lang=en_US"
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

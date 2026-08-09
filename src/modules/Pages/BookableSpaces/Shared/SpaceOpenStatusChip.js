import React from 'react';
import PropTypes from 'prop-types';

import { getVisibleSpaceOutage } from 'modules/Pages/Admin/BookableSpaces/Spaces/Form/spaceOutageHelpers';
import { StyledIconWordWrapperDiv } from 'modules/Pages/BookableSpaces/Shared/SharedStyles';
import { spaceOpeningHours } from 'modules/Pages/BookableSpaces/Shared/spacesHelpers';

export const closingSoonMessage = (message = 'Closing soon') => {
    // https://www.streamlinehq.com/icons/download/technology-device-wearable-smart-watch-circle-app-1--27614
    return (
        <StyledIconWordWrapperDiv data-testid={'spaces-journey-open-status-chip-closing-soon'}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24" width="24">
                <path
                    stroke="#51247a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.89001 6.388V2.25c0 -0.39782 0.15804 -0.77936 0.43934 -1.06066C4.61066 0.908035 4.99219 0.75 5.39001 0.75h4.5c0.39779 0 0.77939 0.158035 1.06069 0.43934 0.2813 0.2813 0.4393 0.66284 0.4393 1.06066v4.138"
                    strokeWidth="1.5"
                />
                <path
                    stroke="#51247a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.89001 17.6121v4.138c0 0.3978 0.15804 0.7794 0.43934 1.0607 0.28131 0.2813 0.66284 0.4393 1.06066 0.4393h4.5c0.39779 0 0.77939 -0.158 1.06069 -0.4393 0.2813 -0.2813 0.4393 -0.6629 0.4393 -1.0607v-4.138"
                    strokeWidth="1.5"
                />
                <path
                    stroke="#51247a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.64001 18.75C11.3679 18.75 14.39 15.7279 14.39 12c0 -3.72792 -3.0221 -6.75 -6.74999 -6.75C3.91209 5.25 0.890015 8.27208 0.890015 12c0 3.7279 3.022075 6.75 6.749995 6.75Z"
                    strokeWidth="1.5"
                />
                <path
                    stroke="#51247a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.11 12c0 0.6922 -0.2053 1.3689 -0.5899 1.9445 -0.3846 0.5756 -0.93118 1.0242 -1.57072 1.2891 -0.63954 0.2649 -1.34328 0.3342 -2.02221 0.1991 -0.67893 -0.135 -1.30257 -0.4683 -1.79206 -0.9578 -0.48948 -0.4895 -0.82282 -1.1131 -0.95787 -1.7921 -0.13505 -0.6789 -0.06574 -1.3827 0.19917 -2.0222 0.26491 -0.6395 0.71351 -1.18616 1.28908 -1.57074C6.24106 8.70527 6.91775 8.5 7.60999 8.5"
                    strokeWidth="1.5"
                />
                <path
                    stroke="#51247a"
                    d="M7.64001 12.498c-0.27614 0 -0.5 -0.2239 -0.5 -0.5 0 -0.2762 0.22386 -0.5 0.5 -0.5"
                    strokeWidth="1.5"
                />
                <path
                    stroke="#51247a"
                    d="M7.64001 12.498c0.27615 0 0.5 -0.2239 0.5 -0.5 0 -0.2762 -0.22385 -0.5 -0.5 -0.5"
                    strokeWidth="1.5"
                />
                <path
                    stroke="#51247a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.156 17.771c1.2641 -1.5634 1.9537 -3.513 1.9537 -5.5235 0 -2.0105 -0.6896 -3.96013 -1.9537 -5.5235"
                    strokeWidth="1.5"
                />
                <path
                    stroke="#51247a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.725 9.02502c0.7375 0.91208 1.1399 2.04948 1.1399 3.22248s-0.4024 2.3104 -1.1399 3.2225"
                    strokeWidth="1.5"
                />
            </svg>
            <span>{message}</span>
        </StyledIconWordWrapperDiv>
    );
};
const closedNowMessage = (message = 'Currently closed') => {
    return (
        <StyledIconWordWrapperDiv data-testid={'spaces-journey-open-status-chip-closed'}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="css-1m01c8l">
                <circle cx="12" cy="12" r="9.25" stroke="#51247A" strokeWidth="1.5" />
                <path d="M12 7.8v4" stroke="#51247A" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="11.9" cy="15.6" r=".6" fill="#000" stroke="#51247A" />
            </svg>
            <span>{message}</span>
        </StyledIconWordWrapperDiv>
    );
};
const openNowMessage = (message = 'Open now') => {
    // https://www.streamlinehq.com/icons/download/shop-sign-open--27633
    return (
        <StyledIconWordWrapperDiv data-testid={'spaces-journey-open-status-chip-open'}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24" width="24">
                <path
                    stroke="#51247a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M0.75 22.75h22.5"
                    strokeWidth="1.5"
                />
                <path
                    stroke="#51247a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M23.25 9.25H0.75"
                    strokeWidth="1.5"
                />
                <path
                    stroke="#51247a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.5 6.25 -3.3 -4.4c-0.1397 -0.18629 -0.3209 -0.3375 -0.5292 -0.44164C12.4625 1.30422 12.2329 1.25 12 1.25c-0.2329 0 -0.4625 0.05422 -0.6708 0.15836 -0.2083 0.10414 -0.3895 0.25535 -0.5292 0.44164l-3.3 4.4"
                    strokeWidth="1.5"
                />
                <path
                    stroke="#51247a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 19.749v-7.5"
                    strokeWidth="1.5"
                />
                <path
                    stroke="#51247a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 12.249h0.75c0.59674 0 1.16903 0.2371 1.59099 0.659 0.42191 0.422 0.65901 0.9943 0.65901 1.591 0 0.5968 -0.2371 1.1691 -0.65901 1.591 -0.42196 0.422 -0.99425 0.659 -1.59099 0.659H7.5"
                    strokeWidth="1.5"
                />
                <path
                    stroke="#51247a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12.25c-0.39782 0 -0.77936 0.158 -1.06066 0.4393 -0.2813 0.2813 -0.43934 0.6629 -0.43934 1.0607v4.5c0 0.3978 0.15804 0.7794 0.43934 1.0607S2.60218 19.75 3 19.75c0.39782 0 0.77936 -0.158 1.06066 -0.4393 0.2813 -0.2813 0.43934 -0.6629 0.43934 -1.0607v-4.5c0 -0.3978 -0.15804 -0.7794 -0.43934 -1.0607S3.39782 12.25 3 12.25Z"
                    strokeWidth="1.5"
                />
                <path
                    stroke="#51247a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 19.749H15c-0.3978 0 -0.7794 -0.158 -1.0607 -0.4393S13.5 18.6468 13.5 18.249v-4.5c0 -0.3978 0.158 -0.7793 0.4393 -1.0606s0.6629 -0.4394 1.0607 -0.4394h1.5"
                    strokeWidth="1.5"
                />
                <path
                    stroke="#51247a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 16.749h3"
                    strokeWidth="1.5"
                />
                <path
                    stroke="#51247a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 19.749v-7.5l3 7.5v-7.5"
                    strokeWidth="1.5"
                />
            </svg>
            <span>{message}</span>
        </StyledIconWordWrapperDiv>
    );
};

const getSpaceHoursStatus = (space, weeklyHours) => {
    const days = spaceOpeningHours(space, weeklyHours);
    if (!days || days.length === 0) {
        console.log('getSpaceHoursStatus return null 1');
        return null;
    }
    const today = days[0];
    if (!today) {
        console.log('getSpaceHoursStatus return null 2');
        return null;
    }

    const status = today?.times?.status;
    if (status === 'closed') return 'closed';
    if (status === '24hours') return 'open';

    const openStr = today?.open; // e.g. "07:30:00"
    const closeStr = today?.close; // e.g. "19:30:00"

    if (!openStr || !closeStr) {
        console.log('getSpaceHoursStatus return null 3');
        return null;
    }

    const now = new Date();
    const [oh, om] = openStr.split(':').map(Number);
    const [ch, cm] = closeStr.split(':').map(Number);

    const openTime = new Date();
    openTime.setHours(oh, om, 0, 0);
    const closeTime = new Date();
    closeTime.setHours(ch, cm, 0, 0);

    if (now < openTime || now >= closeTime) return 'closed';

    const minsUntilClose = (closeTime - now) / 60000;
    if (minsUntilClose <= 60) return 'closing-soon';
    return 'open';
};

export const SpaceOpenStatusChip = ({ space, weeklyHours, weeklyHoursLoading, weeklyHoursError }) => {
    const visibleOutage = getVisibleSpaceOutage(space?.space_outages);
    if (visibleOutage?.status === 'Current') {
        return closedNowMessage();
    }
    if (visibleOutage?.status === 'Upcoming') {
        return closingSoonMessage();
    }

    if (weeklyHoursLoading || weeklyHoursError || !weeklyHours) {
        return null;
    }

    const status = getSpaceHoursStatus(space, weeklyHours);
    if (!status) {
        return null;
    }

    if (status === 'open') {
        return openNowMessage();
    }
    if (status === 'closing-soon') {
        return closingSoonMessage;
    }
    if (status === 'closed') {
        return closedNowMessage();
    }

    console.log('unexpectedly no valid status available');
    return null;
};

SpaceOpenStatusChip.propTypes = {
    space: PropTypes.object,
    weeklyHours: PropTypes.object,
    weeklyHoursLoading: PropTypes.bool,
    weeklyHoursError: PropTypes.bool,
    chipStyles: PropTypes.any,
};

export default SpaceOpenStatusChip;

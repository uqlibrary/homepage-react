import React from 'react';
import PropTypes from 'prop-types';

import { styled } from '@mui/material/styles';
import { isBookable } from './spacesHelpers';

const StyledBookitLinkWrapperDiv = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    columnGap: '0.5rem',
    '& svg': {
        width: '24px',
        height: '24px',
        stroke: theme.palette.primary.main,
    },
    '& a': {
        color: theme.palette.primary.main,
        fontWeight: 500,
        paddingBlock: '2px',
        textDecoration: 'underline',
        '&:hover, &:focus': {
            backgroundColor: 'transparent',
            '& span': {
                backgroundColor: theme.palette.primary.main,
                color: '#fff',
            },
        },
    },
}));
export const BookingLink = ({ bookableSpace, hideNoBookingRequired = false }) => {
    const uqBookitMakeABookingIcon = (
        <svg
            data-testid={`space-${bookableSpace?.space_id}-booking-icon`}
            height="512"
            viewBox="0 0 24 24"
            width="512"
            xmlns="http://www.w3.org/2000/svg"
            style={{ strokeWidth: 0.2 }}
        >
            <path d="M17.5 24c-3.584 0-6.5-2.916-6.5-6.5s2.916-6.5 6.5-6.5 6.5 2.916 6.5 6.5-2.916 6.5-6.5 6.5zm0-11.5c-2.757 0-5 2.243-5 5s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
            <path d="M17.5 21a.75.75 0 01-.75-.75v-5.5a.75.75 0 011.5 0v5.5a.75.75 0 01-.75.75z" />
            <path d="M20.25 18.25h-5.5a.75.75 0 010-1.5h5.5a.75.75 0 010 1.5zM9.19 21H2.75A2.752 2.752 0 010 18.25V2.75A2.752 2.752 0 012.75 0h11.5A2.752 2.752 0 0117 2.75v6.09a.75.75 0 01-1.5 0V2.75c0-.689-.561-1.25-1.25-1.25H2.75c-.689 0-1.25.561-1.25 1.25v15.5c0 .689.561 1.25 1.25 1.25h6.44a.75.75 0 010 1.5z" />
            <path d="M13.25 9.5h-9.5a.75.75 0 010-1.5h9.5a.75.75 0 010 1.5zM9.25 13.5h-5.5a.75.75 0 010-1.5h5.5a.75.75 0 010 1.5zM8.25 5.5h-4.5a.75.75 0 010-1.5h4.5a.75.75 0 010 1.5z" />
        </svg>
    );
    if (isBookable(bookableSpace)) {
        return (
            <StyledBookitLinkWrapperDiv data-testid={`space-${bookableSpace?.space_id}-booking-link`}>
                {uqBookitMakeABookingIcon}
                <a
                    href={bookableSpace?.space_external_book_url}
                    target={'_blank'}
                    data-testid={`space-${bookableSpace?.space_id}-map-popup-booking-link`}
                >
                    <span>Book this space</span>
                </a>
            </StyledBookitLinkWrapperDiv>
        );
    }
    if (!isBookable(bookableSpace) && !hideNoBookingRequired) {
        return <div data-testid={`space-${bookableSpace?.space_id}-not-bookable`}>No booking required.</div>;
    }
    return null;
};
BookingLink.propTypes = {
    bookableSpace: PropTypes.any,
    hideNoBookingRequired: PropTypes.bool,
};

export default BookingLink;

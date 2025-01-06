import React from 'react';
import { styled } from '@mui/material/styles';

const StyledSvg = styled('svg')(({ sx }) => ({
    height: '24px',
    width: '24px',
    ...sx,
}));

const UqArrowForwardIcon = props => (
    <StyledSvg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={'arrowForwardIcon'}
        {...props}
    >
        <path
            d="M4 12h15M14 18l6-6-6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </StyledSvg>
);

export default UqArrowForwardIcon;

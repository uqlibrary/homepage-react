import React from 'react';
import { styled } from '@mui/material/styles';

const StyledSvg = styled('svg')(({ sx }) => ({
    height: '24px',
    width: '24px',
    ...sx,
}));

const UqDsExclamationCircle = props => {
    return (
        <StyledSvg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <circle cx="12" cy="12" r="9.25" stroke="#51247A" strokeWidth="1.5" />
            <path d="M12 7.8v4" stroke="#51247A" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="11.9" cy="15.6" r=".6" fill="#000" stroke="#51247A" />
        </StyledSvg>
    );
};

export default UqDsExclamationCircle;

import React from 'react';
import PropTypes from 'prop-types';

import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import UqDsExclamationCircle from '../Icons/UqDsExclamationCircle';

const StyledSubtitleTypography = styled(Typography)(() => ({
    fontStyle: 'normal',
    fontWeight: 500,
    letterSpacing: '0.16px',
    lineHeight: '160%', // 25.6px
    display: 'flex',
    alignItems: 'flex-start',
    '& span': {
        marginLeft: '8px',
    },
}));
const uqDsWarningYellow = '#fef8e8';
const UserAttention = ({ titleText, children }) => {
    return (
        <div
            style={{
                backgroundColor: uqDsWarningYellow,
                padding: '16px',
            }}
        >
            <StyledSubtitleTypography component={'h4'}>
                <UqDsExclamationCircle style={{ height: '22px' }} /> <span>{titleText}</span>
            </StyledSubtitleTypography>
            {children}
        </div>
    );
};

UserAttention.propTypes = {
    titleText: PropTypes.string,
    children: PropTypes.any,
};

export default UserAttention;

import React from 'react';
import PropTypes from 'prop-types';

import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import UqDsExclamationCircle from '../Icons/UqDsExclamationCircle';

const StyledAttentionDiv = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.designSystem.warningYellow,
    padding: '16px',
    '& h4': {
        fontStyle: 'normal',
        fontWeight: 500,
        letterSpacing: '0.16px',
        lineHeight: '160%', // 25.6px
        display: 'flex',
        alignItems: 'flex-start',
        columnGap: '0.5rem',
        '& svg': {
            height: '22px',
        },
    },
}));
const UserAttention = ({ titleText, children }) => {
    return (
        <StyledAttentionDiv>
            <Typography component={'h4'}>
                <UqDsExclamationCircle />
                <span>{titleText}</span>
            </Typography>
            {children}
        </StyledAttentionDiv>
    );
};

UserAttention.propTypes = {
    titleText: PropTypes.string,
    children: PropTypes.any,
};

export default UserAttention;

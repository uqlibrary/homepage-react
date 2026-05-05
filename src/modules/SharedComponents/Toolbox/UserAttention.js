import React from 'react';
import PropTypes from 'prop-types';

import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import UqDsExclamationCircle from '../Icons/UqDsExclamationCircle';

const StyledAttentionDiv = styled('div', {
    shouldForwardProp: prop => !['tone', 'variant'].includes(prop),
})(({ theme, tone, variant }) => {
    if (variant === 'aligned') {
        return {
            backgroundColor: tone === 'error' ? '#fbeaea' : theme.palette.designSystem.warningYellow,
            color: theme.palette.designSystem.headingColor,
            padding: '16px',
            '& .uq-userattention-row': {
                display: 'grid',
                gridTemplateColumns: '24px 1fr',
                columnGap: '0.5rem',
                alignItems: 'start',
            },
            '& .uq-userattention-icon': {
                marginTop: '2px',
                '& svg': {
                    height: '22px',
                    width: '22px',
                    display: 'block',
                },
                '& svg path, & svg circle': {
                    stroke: `${theme.palette.designSystem.headingColor} !important`,
                },
            },
            '& .uq-userattention-content h4': {
                color: theme.palette.designSystem.headingColor,
                margin: 0,
                fontStyle: 'normal',
                fontWeight: 500,
                letterSpacing: '0.16px',
                lineHeight: '160%', // 25.6px
            },
            '& .uq-userattention-content p': {
                color: theme.palette.designSystem.headingColor,
                marginTop: '0.5rem',
                marginBottom: 0,
            },
        };
    }

    return {
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
    };
});

const UserAttention = ({ titleText, children, tone = 'warning', variant = 'legacy' }) => {
    if (variant === 'aligned') {
        return (
            <StyledAttentionDiv tone={tone} variant={variant}>
                <div className="uq-userattention-row">
                    <div className="uq-userattention-icon" aria-hidden="true">
                        <UqDsExclamationCircle />
                    </div>
                    <div className="uq-userattention-content">
                        <Typography component={'h4'}>{titleText}</Typography>
                        {children}
                    </div>
                </div>
            </StyledAttentionDiv>
        );
    }

    return (
        <StyledAttentionDiv tone={tone} variant={variant}>
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
    tone: PropTypes.oneOf(['warning', 'error']),
    variant: PropTypes.oneOf(['legacy', 'aligned']),
};

export default UserAttention;

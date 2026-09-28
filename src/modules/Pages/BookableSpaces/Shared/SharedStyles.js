import { styled } from '@mui/material/styles';

// can be used for a word beside an icon. word can be wrapped in an anchor, or just a span
export const StyledIconWordWrapperDiv = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    columnGap: '0.5rem',
    '& svg': {
        width: '24px',
        height: '24px',
        stroke: theme.palette.primary.main,
    },
    '& span': {
        color: theme.palette.designSystem.headingColor,
        fontSize: '0.875rem',
        fontWeight: 700,
        lineHeight: '1.25rem',
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

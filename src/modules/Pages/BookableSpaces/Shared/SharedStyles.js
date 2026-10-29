import { styled } from '@mui/material/styles';

// can be used for a word beside an icon. word can be wrapped in an anchor, or just a span
export const StyledIconWordWrapperDiv = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    columnGap: '0.5rem',
    color: theme.palette.primary.main,
    '& svg': {
        width: '24px',
        height: '24px',
        color: theme.palette.primary.main,
        fill: 'currentColor',
        stroke: 'currentColor',
    },
    '& span': {
        color: theme.palette.designSystem.headingColor,
        fontSize: '0.875rem',
        fontWeight: 700,
        lineHeight: '1.25rem',
    },
    '& a, & a:visited, & a:link': {
        color: theme.palette.primary.main,
        fontWeight: 500,
        paddingBlock: '2px',
        textDecoration: 'underline',
        '& span': {
            color: theme.palette.primary.main,
        },
        '&:hover, &:focus': {
            backgroundColor: 'transparent',
            '& span': {
                backgroundColor: theme.palette.primary.main,
                color: '#fff',
            },
        },
    },
}));

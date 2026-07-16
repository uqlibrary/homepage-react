import { Box, Button, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledJourneyContentShell = styled(Box)(({ theme }) => ({
    width: '100%',
    backgroundColor: '#fff',
    minHeight: 'calc(100vh - 200px)',
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: '6rem',
    [theme.breakpoints.down('sm')]: {
        paddingBottom: '8rem',
    },
}));

export const StyledJourneyPanel = styled('section', {
    shouldForwardProp: prop => prop !== 'hasTopSpacing',
})(({ theme, hasTopSpacing }) => ({
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    rowGap: '2rem',
    padding: `${hasTopSpacing ? '2rem' : '0'} 0 2rem`,
    [theme.breakpoints.down('sm')]: {
        padding: `${hasTopSpacing ? '1rem' : '0'} 0 1rem`,
        rowGap: '1.25rem',
    },
    [theme.breakpoints.down('md')]: {
        maxWidth: '100%',
    },
}));

export const StyledResultsSplitLayout = styled('div')(({ theme }) => ({
    display: 'grid',
    gap: '2rem',
    gridTemplateColumns: 'minmax(0, 4fr) minmax(0, 8fr)',
    alignItems: 'start',
    width: '100%',
    [theme.breakpoints.down('lg')]: {
        gridTemplateColumns: '1fr',
        width: '100%',
    },
}));

export const StyledResultsSidebarPanel = styled('aside')(({ theme }) => ({
    padding: '0',
    position: 'sticky',
    top: '1rem',
    [theme.breakpoints.down('lg')]: {
        position: 'relative',
        top: 'auto',
    },
}));

export const StyledListItemStack = styled(Stack)(({ theme }) => ({
    position: 'relative',

    '& a.cardBody': {
        width: '100%',
        padding: '0',
        textTransform: 'none',
        justifyContent: 'flex-start',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.palette.designSystem.borderRadius,
        backgroundColor: '#fff',
        color: 'inherit',
        '&:hover, &:focus': {
            backgroundColor: theme.palette.designSystem.panelBackgroundColor,
        },
    },
    '&:has(.bookitLink)': {
        '& a.cardBody': {
            paddingBottom: '4rem',
        },
    },
}));

export const StyledResultCardButton = styled(Button)(({ theme }) => ({}));

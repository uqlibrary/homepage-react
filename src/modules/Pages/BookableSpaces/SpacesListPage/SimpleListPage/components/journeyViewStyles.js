import { Box, Stack } from '@mui/material';
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

export const StyledJourneyPanelSection = styled('section', {
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

export const StyledResultsSplitLayoutDiv = styled('div')(({ theme }) => ({
    display: 'grid',
    gap: '2rem',
    gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 9fr)',
    alignItems: 'start',
    width: '100%',
    [theme.breakpoints.down('md')]: {
        gridTemplateColumns: '1fr',
        width: '100%',
    },
    '& h1': {
        fontFamily: theme.palette.designSystem.fontFamilyH1,
        fontWeight: 500,
        color: theme.palette.designSystem.headingColor,
        fontSize: '40px',
    },
    '& h2': {
        color: theme.palette.designSystem.bodyCopy,
        marginTop: 1.5,
    },
    '> .aside': {
        order: -1, // flip the order to get the heading structures right
    },
    '& .showsOnlyOnFocus': {
        position: 'absolute',
        left: '-999px',
        top: '-999px',
        '&:focus': {
            position: 'relative',
            top: 'inherit',
            left: 'inherit',
            backgroundColor: theme.palette.primary.main,
            color: '#fff',
            fontWeight: 500,
            textDecoration: 'underline',
        },
    },
}));

export const StyledButtonWrapperStack = styled(Stack)(() => ({
    marginTop: '0.75rem',
}));

export const StyledResultsSidebarPanelDiv = styled('div')(({ theme }) => ({
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
            '& h3': {
                textDecoration: 'underline',
            },
        },
        '.spaceHolderForFavouriteStar': {
            width: '1.5rem',
            height: '1.5rem',
        },
        '> div': {
            padding: '1.5rem',
            width: '100%',
            textAlign: 'left',
        },
    },
    '&:has(.bookingLink)': {
        '& a.cardBody': {
            paddingBottom: '3rem',
        },
    },
    '.bookingLink': {
        marginTop: 1.5,
        paddingTop: 1.5,
        position: 'absolute',
        bottom: '1rem',
        left: '1.5rem',
    },
}));

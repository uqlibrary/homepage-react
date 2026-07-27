import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledHeaderWithLinkToAllGridItem = styled(Grid)(({ theme }) => ({
    marginTop: '-32px',
    paddingBottom: theme.spacing(3),
    '& h2': {
        marginTop: '22px',
        fontSize: '32px',
        fontWeight: 500,
        display: 'inline-block',
        marginRight: '16px',
    },
    // ensure heading doesn't capture pointer above the inline link
    '& h2, & h2 *': {
        zIndex: 0,
    },
    '& a': {
        fontWeight: 500,
        marginLeft: theme.spacing(0),
        paddingBlock: '2px',
        display: 'inline-block',
        textDecoration: 'underline',
        transition: 'color 200ms ease-out, text-decoration 200ms ease-out, background-color 200ms ease-out',
        color: theme.palette.primary.main,
        zIndex: 1,
        pointerEvents: 'auto',
        '&:hover': {
            color: '#fff',
            backgroundColor: theme.palette.primary.main,
            textDecoration: 'underline',
        },
        '&, & *': {
            color: 'inherit',
        },
    },
}));

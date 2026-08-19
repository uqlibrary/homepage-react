import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import TrailAudioPlayer from './TrailAudioPlayer';
import TrailImage from './TrailImage';

export const StyledAccordion = styled(Accordion)(() => ({
    marginBottom: 'var(--art-trail-spacing)',
    '&.Mui-expanded:last-of-type': { marginBottom: 'var(--art-trail-spacing)' },
}));

export const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
    '& p': {
        fontSize: 'var(--art-trail-font-size)',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        lineHeight: 1.5,
        '&:first-of-type': {
            marginTop: 0,
        },
        '&:last-of-type': {
            marginBottom: 0,
        },
    },
}));

export const StyledImage = styled('img')({
    maxWidth: '100%',
    width: '100%',
    position: 'relative',
});
export const StyledTrailImage = styled(TrailImage)({
    maxWidth: '100%',
    width: '100%',
    position: 'relative',
});

export const StyledAudioPlayer = styled(TrailAudioPlayer)({});

export const StyledImageCaption = styled('figcaption')(({ theme }) => ({
    marginTop: theme.spacing(1),
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
}));

export const StyledUl = styled('ul')(({ theme }) => ({
    paddingInlineStart: '1.25rem',
    '& li:not(:last-of-type)': {
        marginBottom: theme.spacing(1),
    },
}));

export const StyledDrawerHeader = styled(Typography)(({ theme }) => ({
    fontSize: '1.125rem',
    fontWeight: theme.typography.fontWeightMedium,
    fontFamily: 'var(--art-trail-font-family)',
    lineHeight: '1.6',
}));

export const StyledAccordionGrid = styled(Grid)(() => ({
    paddingLeft: 'var(--art-trail-spacing)',
    paddingRight: 'var(--art-trail-spacing)',
    paddingBottom: 'calc(var(--art-trail-spacing) * 3)',
}));

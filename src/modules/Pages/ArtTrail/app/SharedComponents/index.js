/* istanbul ignore file */
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

import DisclosureSection from './DisclosureSection';
import TrailAudioPlayer from './TrailAudioPlayer';
import TrailImage from './TrailImage';

export const StyledHeading = styled(Typography)(({ theme }) => ({
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
}));

export const StyledAccordion = styled(Accordion)(() => ({
    marginBottom: 'var(--art-trail-spacing)',
    '&.Mui-expanded:last-of-type': { marginBottom: 'var(--art-trail-spacing)' },
}));

export const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
    '& p': {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
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
    fontSize: 'var(--art-trail-font-size)',
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
    paddingBottom: 'var(--art-trail-spacing)',
}));

export const StyedButtonDS = styled(Button)(({ theme }) => ({
    boxSizing: 'border-box',
    color: theme.palette.white.main,
    cursor: 'pointer',
    textAlign: 'center',
    backgroundColor: theme.palette.primary.main,
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: theme.palette.primary.main,
    borderRadius: '.25rem',
    alignItems: 'center',
    gap: '.5rem',
    padding: '1rem 1.5rem',
    fontFamily: 'Roboto,Helvetica Neue,Helvetica,Arial,sans-serif',
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1,
    textDecoration: 'none',
    transition: 'background-color .2s ease-out,color .2s ease-out,border .2s ease-out',
    display: 'inline-flex',
    position: 'relative',
    '&:hover': {
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.white.main,
        borderColor: theme.palette.primary.main,
        textDecoration: 'underline',
    },
    '&:focus': {
        outlineOffset: 0,
        outline: '2px solid #0d6dcd',
    },
}));

export const StyledButtonDSSecondary = styled(StyedButtonDS)(({ theme }) => ({
    color: theme.palette.primary.main,
    backgroundColor: '#0000',
    borderColor: theme.palette.primary.main,

    '&:hover': {
        color: theme.palette.white.main,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
    },
}));

export { DisclosureSection };

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import parse from 'html-react-parser';
import { useCookies } from 'react-cookie';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import EditIcon from '@mui/icons-material/Edit';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InfoIcon from '@mui/icons-material/Info';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import StarIcon from '@mui/icons-material/Star';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { isDlorAdminUser } from 'helpers/access';
import { useAccountContext } from 'context';

import LoginPrompt from 'modules/Pages/DigitalLearningObjects/SharedComponents/LoginPrompt';
import {
    getDurationString,
    getFileSizeString,
    getYoutubeUrlForPreviewEmbed,
    isPreviewableUrl,
    getDlorViewPageUrl,
    getPathRoot,
    toTitleCase,
    convertSnakeCaseToKebabCase,
} from 'modules/Pages/DigitalLearningObjects/dlorHelpers';
import { dlorAdminLink, isValidEmail } from 'modules/Pages/Admin/DigitalLearningObjects/dlorAdminHelpers';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';

const StyledUQActionButton = styled('div')(({ theme }) => ({
    marginBlock: '32px',
    '& button, & a': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.white.main,
        borderColor: theme.palette.primary.main,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: '6px',
        padding: '8px 12px',
        fontWeight: 400,
        '&:hover': {
            backgroundColor: theme.palette.white.main,
            color: theme.palette.primary.main,
            textDecoration: 'none',
        },
    },
    '&:has(button)': {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '12px',
    },
}));
const StyledTitleTypography = styled(Typography)(({ theme }) => ({
    color: theme.palette.primary.light,
}));
const StyledContentGrid = styled(Grid)(() => ({
    marginTop: '6px',
    '& > div.MuiGrid-item': {
        paddingTop: '6px',
    },
}));
const StyledTitleBlockDiv = styled('div')(() => ({
    display: 'flex',
    alignItems: 'center',
    '& p:first-child': {
        padding: 0,
        fontSize: 16,
        '& a': {
            color: 'rgba(0, 0, 0, 0.87)',
        },
    },
    '& svg': {
        width: 10,
        marginInline: '6px',
    },
    '& > p:nth-child(2)': {
        padding: 0,
    },
}));
const StyledHeaderDiv = styled(Typography)(() => ({
    backgroundColor: 'white',
    padding: '12px',
    '& p': {
        margin: 0,
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        fontWight: 300,
        fontSize: '1rem',
        lineHeight: 1.5,
        letterSpacing: '0.00938em',
    },
}));
const StyledIframe = styled('iframe')(() => ({
    left: 0,
    top: 0,
    height: '100%',
    width: '100%',
    position: 'absolute',
}));
const StyledTagLabelSpan = styled('span')(() => ({
    fontVariant: 'small-caps',
    textTransform: 'lowercase',
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    marginRight: '10px',
}));
const StyledSeriesList = styled('ol')(() => ({
    paddingInlineStart: 0,
    marginInlineStart: 0,
    '& li': {
        display: 'flex',
        marginBottom: '0.5em',
        '& a': {
            backgroundColor: '#d1d0d2', // $grey-300
            color: '#000',
        },
        '& a, & > span': {
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            padding: 10,
            textDecoration: 'none',
            border: '1px solid #d1d0d2', // $grey-300
        },
        '& a:hover': {
            backgroundColor: '#a3a1a4', // $grey-500
        },
    },
}));
const StyledDemographicsBox = styled(Box)(() => ({
    padding: '1em',
    marginTop: '24px',
    borderRadius: '10px',
    backgroundColor: 'white',
    '& p': { marginLeft: '-8px' },
    '& form': { margin: '-8px', '& p': { marginBlock: '3em 0', marginLeft: '2px' } },
}));
const StyledLayoutBox = styled(Box)(() => ({
    backgroundColor: 'white',
    padding: '12px',
    marginTop: '24px',
}));
const StyledKeywordList = styled('ul')(() => ({
    listStyleType: 'none',
    paddingLeft: 0,
    '& li': {
        display: 'flex',
        alignItems: 'center',
        listStyleType: 'none',
        paddingBottom: '6px',
    },
}));
const StyledSidebarList = styled('ul')(() => ({
    listStyleType: 'none',
    paddingLeft: 0,
    '& li': {
        display: 'flex',
        alignItems: 'center',
        listStyleType: 'none',
        paddingBottom: '6px',
        '& a': {
            color: '#333',
            marginTop: '2px',
            marginLeft: '3px',
        },
    },
}));
const StyledSidebarHeadingTypography = styled(Typography)(() => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
    '& svg': {
        width: 30,
        paddingRight: '6px',
    },
}));

function getTitleBlock(detailTitle = 'View a series') {
    return (
        <StyledTitleBlockDiv>
            <Typography component={'p'} variant={'h6'} data-testid="dlor-seriespage-sitelabel">
                <a href={`${getPathRoot()}/digital-learning-hub`}>Find a digital learning object</a>
            </Typography>
            <ArrowForwardIcon />
            <Typography>{detailTitle}</Typography>
        </StyledTitleBlockDiv>
    );
}

export const SeriesView = ({
    actions, dlorSeries
}) => {
    const { account } = useAccountContext();
    useEffect(() => {
        if (!dlorSeries) {
            actions.loadDlorSeries(1);
        }
    }, [dlorSeries]);
    console.log("series List", dlorSeries, account) 
    return (
        <StandardPage>
            {getTitleBlock()}
            <StyledContentGrid container spacing={4} data-testid="dlor-seriespage">
                <Grid item xs={12} md={9}>
                    <LoginPrompt account={account} instyle={{ marginBottom: '12px' }} />
                    <Box sx={{ marginBottom: '12px' }}>
                        <StyledTitleTypography component={'h1'} variant={'h4'}>
                            {dlorSeries?.series_title}
                        </StyledTitleTypography>
                    </Box>
                    <StyledHeaderDiv data-testid="dlor-seriespage-description">
                                {!!dlorSeries?.series_description && parse(dlorSeries?.series_description)}
                    </StyledHeaderDiv>
                    <StyledLayoutBox>
                        <StyledTitleTypography component="h2" variant="h6">
                            Objects contained in this series:
                        </StyledTitleTypography>
                        <StyledSeriesList>
                            {dlorSeries?.series_list
                                ?.sort((a, b) => a.series_object_order - b.series_object_order)
                                .map((s, index) => {
                                    return (
                                        <li
                                            key={`dlor-view-series-item-${s.series_object_uuid}`}
                                            data-testid={`dlor-view-series-item-${convertSnakeCaseToKebabCase(
                                                s.series_object_uuid,
                                            )}-order-${index}`}
                                        >
                                            
                                            <a
                                                href={getDlorViewPageUrl(s?.series_object_uuid)}
                                                rel="noopener noreferrer"
                                            >
                                                {s.series_object_title}
                                            </a>
                                           
                                        </li>
                                    );
                                })}
                        </StyledSeriesList>
                    </StyledLayoutBox>
                </Grid>
            </StyledContentGrid>
        </StandardPage>
    );
};

SeriesView.propTypes = {
    dlorSeries: PropTypes.any,
};

export default React.memo(SeriesView);

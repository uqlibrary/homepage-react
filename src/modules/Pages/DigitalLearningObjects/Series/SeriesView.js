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
import DescriptionIcon from '@mui/icons-material/Description';
import LaptopIcon from '@mui/icons-material/Laptop';
import LocalLibrarySharpIcon from '@mui/icons-material/LocalLibrarySharp';
import CopyrightIcon from '@mui/icons-material/Copyright';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TopicIcon from '@mui/icons-material/Topic';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CloseIcon from '@mui/icons-material/Close';
import SchoolSharpIcon from '@mui/icons-material/SchoolSharp';
import SearchIcon from '@mui/icons-material/Search';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { isDlorAdminUser } from 'helpers/access';
import { useAccountContext } from 'context';
import { ContentLoader } from 'modules/SharedComponents/Toolbox/Loaders';

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
    marginTop: '16px',
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


const StyledTagLabel = styled('span')(() => ({
    fontVariant: 'small-caps',
    textTransform: 'lowercase',
    fontWeight: 'bold',
    marginRight: 10,
    color: '#333',
}));
const StyledArticleCard = styled('button')(({ theme }) => ({
    backgroundColor: '#fff',
    borderColor: 'transparent',
    fontFamily: 'Roboto, sans-serif',
    paddingInline: 0,
    textAlign: 'left',
    width: '100%',
    '&:hover': {
        cursor: 'pointer',
        textDecoration: 'none',
        borderTopColor: '#f2f2f2',
        borderLeftColor: '#f2f2f2',
        '& > article': {
            backgroundColor: '#f2f2f2',
        },
    },
    '& article': {
        padding: '12px',
        '& header': {
            '& h2': {
                lineHeight: 1.2,
                marginBlock: 7,
                display: 'flex',
                alignItems: 'center',
            },
        },
        '& > div': {
            maxHeight: 180,
            overflowY: 'auto',
            overflowX: 'hidden',
            fontWeight: 300,
        },
        '& > div p': {
            marginBottom: '0.2em',
            marginTop: '0.2em',
            fontSize: 16,
        },
        '& > div p:first-of-type': {
            marginTop: 0,
        },
        '& footer': {
            color: theme.palette.primary.light,
            fontWeight: 400,
            marginTop: 6,
            display: 'flex',
            alignItems: 'center', // horizontally, align icon and label at the center
            '& > svg:not(:first-of-type)': {
                paddingLeft: 12,
            },
            '& svg': {
                width: 20,
                '& > path': {
                    fill: theme.palette.primary.light,
                },
            },
            '& span': {
                paddingLeft: 2,
            },
        },
    },
}));

export const SeriesView = ({
    actions, dlorSeries, dlorSeriesLoading, dlorSeriesError, dlorList,  dlorListError, dlorListLoading,
}) => {
    const { account } = useAccountContext();
    const { seriesId } = useParams();

    const hasLoaded = React.useRef(false);

    useEffect(() => {
        if (seriesId && !hasLoaded.current) {
            console.log("USEEFFECT", dlorSeries, seriesId);
            actions.loadDlorSeries(seriesId);
            hasLoaded.current = true
           
        } 
        //initialRender.current = false;
       
    }, [seriesId]);


    const [filterListTrimmed] = React.useState([]);

    const getPublicHelp = facetTypeSlug => {
        let result = '';
        /* istanbul ignore else */
        if (!!filterListTrimmed) {
            result = filterListTrimmed?.filter(f => f?.facet_type_slug === facetTypeSlug)?.pop()
                ?.facet_type_help_public;
        }
        return result;
    };
    const getFacetTypeIcon = facetTypeSlug => {
        const iconList = {
            item_type: <LaptopIcon aria-label={getPublicHelp(facetTypeSlug)} />,
            media_format: <DescriptionIcon aria-label={getPublicHelp(facetTypeSlug)} />,
            licence: <CopyrightIcon aria-label={getPublicHelp(facetTypeSlug)} />,
            topic: <TopicIcon aria-label={getPublicHelp(facetTypeSlug)} />,
            graduate_attributes: <SchoolSharpIcon aria-label={getPublicHelp(facetTypeSlug)} />,
            subject: <LocalLibrarySharpIcon aria-label={getPublicHelp(facetTypeSlug)} />,
        };
        return iconList[facetTypeSlug];
    };

    function displayItemPanel(object, index) {
        function hasTopicFacet(facetTypeSlug) {
            const f = object?.object_filters?.filter(o => o.filter_key === facetTypeSlug);
            return !(!f || f.length === 0);
        }
    
        const getConcatenatedFilterLabels = (facetTypeSlug, wrapInParam = false) => {
            const f = object?.object_filters?.filter(o => o?.filter_key === facetTypeSlug);
            const output = f?.pop();
            const facetNames = output?.filter_values?.map(item => item.name)?.join(', ');
            return !!wrapInParam ? /* istanbul ignore next */ `(${facetNames})` : facetNames;
        };
    
        return (
            <Grid
                item
                xs={12}
                sx={{
                    // paddingLeft: '16px',
                    paddingBottom: '16px',
                    paddingTop: '0 !important',
                }}
                key={object?.object_id}
                data-testid={`dlor-homepage-panel-${convertSnakeCaseToKebabCase(object?.object_public_uuid)}`}
            >
                <StyledArticleCard
                    onClick={() => navigateToDetailPage(object?.object_public_uuid)}
                    aria-label={`Click for more details on ${object.object_title}`}
                    id={index === 0 ? 'first-panel-button' : null}
                >
                    <article>
                        <header>
                            <Typography component={'h2'} variant={'h6'}>
                                <span>{object?.object_title}</span>
                            </Typography>
                            <>
                                {(!!object?.object_cultural_advice ||
                                    !!object?.object_is_featured ||
                                    !!object?.object_series_name) && (
                                    <Typography
                                        component={'p'}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginLeft: '-4px',
                                            marginTop: '-4px',
                                            marginBottom: '6px',
                                        }}
                                    >
                                        {!!object?.object_is_featured && (
                                            <>
                                                <BookmarkIcon
                                                    sx={{ fill: '#51247A', marginRight: '2px', width: '20px' }}
                                                />
                                                <StyledTagLabel
                                                    data-testid={`dlor-homepage-panel-${convertSnakeCaseToKebabCase(
                                                        object?.object_public_uuid,
                                                    )}-featured`}
                                                    sx={{ marginLeft: '-2px' }}
                                                >
                                                    Featured
                                                </StyledTagLabel>
                                            </>
                                        )}
                                        {!!object?.object_cultural_advice && (
                                            <>
                                                <InfoIcon sx={{ fill: '#2377CB', marginRight: '2px', width: '20px' }} />
                                                <StyledTagLabel
                                                    data-testid={`dlor-homepage-panel-${convertSnakeCaseToKebabCase(
                                                        object?.object_public_uuid,
                                                    )}-cultural-advice`}
                                                >
                                                    Cultural advice
                                                </StyledTagLabel>
                                            </>
                                        )}
                                        {!!object?.object_series_name && (
                                            <>
                                                <PlaylistAddCheckIcon
                                                    sx={{ fill: '#4aa74e', marginRight: '2px', width: '24px' }}
                                                />
                                                <StyledTagLabel
                                                    data-testid={`dlor-homepage-panel-${convertSnakeCaseToKebabCase(
                                                        object?.object_public_uuid,
                                                    )}-object-series-name`}
                                                >
                                                    Series: {object?.object_series_name}
                                                </StyledTagLabel>
                                            </>
                                        )}
                                    </Typography>
                                )}
                            </>
                        </header>
    
                        <div>
                            <p>{object?.object_summary}</p>
                        </div>
                        <footer>
                            {!!hasTopicFacet('item_type') && (
                                <>
                                    {getFacetTypeIcon('item_type')}
                                    <span
                                        data-testid={`dlor-homepage-panel-${convertSnakeCaseToKebabCase(
                                            object?.object_public_uuid,
                                        )}-footer-type`}
                                    >
                                        {getConcatenatedFilterLabels('item_type')}
                                    </span>
                                </>
                            )}
                            {!!hasTopicFacet('media_format') && (
                                <>
                                    {getFacetTypeIcon('media_format')}
                                    <span
                                        data-testid={`dlor-homepage-panel-${convertSnakeCaseToKebabCase(
                                            object?.object_public_uuid,
                                        )}-footer-media`}
                                    >
                                        {getConcatenatedFilterLabels('media_format')}
                                    </span>
                                </>
                            )}
                            {!!hasTopicFacet('topic') && (
                                <>
                                    {getFacetTypeIcon('topic')}
                                    <span
                                        data-testid={`dlor-homepage-panel-${convertSnakeCaseToKebabCase(
                                            object?.object_public_uuid,
                                        )}-footer-topic`}
                                    >
                                        {getConcatenatedFilterLabels('topic')}
                                    </span>
                                </>
                            )}
                        </footer>
                    </article>
                </StyledArticleCard>
            </Grid>
        );
    }
    
    useEffect(() => {
        if (!dlorListError && !dlorListLoading && !dlorList) {
            actions.loadCurrentDLORs();
        }
    }, [dlorList,  dlorListError, dlorListLoading,  actions]);

    function navigateToDetailPage(uuid) {
        window.location.href = getDlorViewPageUrl(uuid);
    }

    return (
        <StandardPage>
            {getTitleBlock()}
                {!!dlorSeries && !dlorSeriesLoading && (
                    <StyledContentGrid container spacing={4} data-testid="dlor-seriespage">
                        <Grid item xs={12}>
                            {/* <LoginPrompt account={account} instyle={{ marginBottom: '12px' }} /> */}
                            <Box sx={{ marginBottom: '12px' }}>
                                <StyledTitleTypography component={'h1'} variant={'h4'}>
                                    {dlorSeries?.series_name}
                                </StyledTitleTypography>
                            </Box>
                            <StyledHeaderDiv data-testid="dlor-seriespage-description">
                                        {!!dlorSeries?.series_description ? parse(dlorSeries?.series_description) : "This series does not have a detailed description at this time."}
                                        
                            </StyledHeaderDiv>
                            <StyledTitleTypography component="h2" variant="h6">
                                Objects contained in this series:
                            </StyledTitleTypography>
                            {/* <StyledLayoutBox> */}
                                
                                {/* <StyledSeriesList> */}
                                    {
                                        !!dlorList && dlorList.map((item, index) => {
                                            if(item.object_series_id && item.object_series_id == seriesId) {
                                                return displayItemPanel(item, index)
                                            }
                                        }) 
                                    }
                                    {/* {dlorSeries?.series_list
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
                                        })} */}
                                {/* </StyledSeriesList> */}
                            {/* </StyledLayoutBox> */}
                        </Grid>
                    </StyledContentGrid>
                )}
                
                {!!dlorListLoading && (
                    <ContentLoader />
                )}
                {!!dlorSeriesError && (
                    <StyledHeaderDiv data-testid="dlor-seriespage-loadError">
                        <StyledTitleTypography component={'p'}>
                            {dlorSeriesError}
                        </StyledTitleTypography>
                    </StyledHeaderDiv>
                )}
        </StandardPage>
    );
};

SeriesView.propTypes = {
    dlorSeries: PropTypes.any,
    dlorList: PropTypes.any,
    dlorListError: PropTypes.bool, 
    dlorListLoading: PropTypes.bool,
    dlorSeriesError: PropTypes.any,
    dlorSeriesLoading: PropTypes.bool,
    actions: PropTypes.any

};

export default React.memo(SeriesView);

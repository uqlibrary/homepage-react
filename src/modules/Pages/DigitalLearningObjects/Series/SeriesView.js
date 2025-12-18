import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import parse from 'html-react-parser';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import InfoIcon from '@mui/icons-material/Info';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import DescriptionIcon from '@mui/icons-material/Description';
import LaptopIcon from '@mui/icons-material/Laptop';
import LocalLibrarySharpIcon from '@mui/icons-material/LocalLibrarySharp';
import CopyrightIcon from '@mui/icons-material/Copyright';
import TopicIcon from '@mui/icons-material/Topic';
import SchoolSharpIcon from '@mui/icons-material/SchoolSharp';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { useAccountContext } from 'context';
import { ContentLoader } from 'modules/SharedComponents/Toolbox/Loaders';

import { isLibraryStaff, isStaff, isUQOnlyUser } from 'helpers/access';

import {
    getDlorViewPageUrl,
    getPathRoot,
    convertSnakeCaseToKebabCase,
} from 'modules/Pages/DigitalLearningObjects/dlorHelpers';

const StyledTitleTypography = styled(Typography)(({ theme }) => ({
    color: theme.palette.primary.main,
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
    marginBottom: 12,
    '& p': {
        margin: 0,
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        fontWight: 300,
        fontSize: '1rem',
        lineHeight: 1.5,
        letterSpacing: '0.00938em',
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
const StyledArticleCard = styled('button')(({ theme, isAccessible }) => ({
    backgroundColor: '#fff',
    borderColor: 'transparent',
    fontFamily: 'Roboto, sans-serif',
    paddingInline: 0,
    textAlign: 'left',
    width: '100%',
    '&:hover': {
        cursor: isAccessible ? 'pointer' : 'not-allowed',
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
            color: theme.palette.primary.main,
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
                    fill: theme.palette.primary.main,
                },
            },
            '& span': {
                paddingLeft: 2,
            },
        },
    },
}));

export const SeriesView = ({
    actions,
    dlorSeries,
    dlorSeriesLoading,
    dlorSeriesError,
    dlorList,
    dlorListError,
    dlorListLoading,
}) => {
    const { account } = useAccountContext(); // Add this line
    const { seriesId } = useParams();

    function usePrevious(value) {
        const seriesRef = useRef();
        useEffect(() => {
            seriesRef.current = value;
        }, [value]);
        return seriesRef.current;
    }

    const previousSeriesId = usePrevious(seriesId);

    useEffect(() => {
        if (seriesId !== previousSeriesId) {
            actions.loadDlorSeries(seriesId);
        }
    }, [seriesId, previousSeriesId]);

    useEffect(() => {
        document.title = dlorSeries?.series_name ?? 'Digital Learning Object Series';
    }, [dlorSeries]);

    const getFacetTypeIcon = facetTypeSlug => {
        const iconList = {
            item_type: <LaptopIcon aria-label={'Describes the item type'} />,
            media_format: <DescriptionIcon aria-label={'Describes the media format'} />,
            licence: <CopyrightIcon aria-label={'Describes the copyright licence type'} />,
            topic: <TopicIcon aria-label={'Describes the item topic'} />,
            graduate_attributes: <SchoolSharpIcon aria-label={'Describes the graduate attributes applied'} />,
            subject: <LocalLibrarySharpIcon aria-label={'Describes the subject'} />,
        };
        return iconList[facetTypeSlug];
    };

    function displayItemPanel(object, index) {
        // Add restriction check
        let restrictionMessage = '';
        let isAccessible = true;

        switch (object.object_restrict_to) {
            case 'uqlibrarystaff':
                isAccessible = isLibraryStaff(account);
                restrictionMessage = !isAccessible ? 'You need to be UQ Library staff to view this object' : '';
                break;
            case 'uqstaff':
                isAccessible = isStaff(account);
                restrictionMessage = !isAccessible ? 'You need to be UQ staff to view this object' : '';
                break;
            case 'uquser':
                isAccessible = isUQOnlyUser(account);
                restrictionMessage = !isAccessible ? 'You need to be a UQ staff or student to view this object' : '';
                break;
            default:
                break;
        }

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
                    opacity: !isAccessible ? 0.5 : 1,
                }}
                key={object?.object_id}
                data-testid={`dlor-homepage-panel-${convertSnakeCaseToKebabCase(object?.object_public_uuid)}`}
            >
                <StyledArticleCard
                    onClick={() => isAccessible && navigateToDetailPage(object?.object_public_uuid)}
                    tabIndex={isAccessible ? '0' : '-1'}
                    aria-disabled={!isAccessible}
                    isAccessible={isAccessible}
                    {...(!isAccessible && {
                        'aria-label': `${object?.object_title} - ${restrictionMessage}`,
                    })}
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
                            <p>{!!restrictionMessage ? restrictionMessage : object?.object_summary}</p>
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
    }, [dlorList, dlorListError, dlorListLoading, actions]);

    function navigateToDetailPage(uuid) {
        window.location.href = getDlorViewPageUrl(uuid);
    }

    return (
        <StandardPage>
            {getTitleBlock()}
            {!!dlorSeries && !dlorSeriesLoading && (
                <StyledContentGrid container spacing={4} data-testid="dlor-seriespage">
                    <Grid item xs={12}>
                        <Box sx={{ marginBottom: '12px' }}>
                            <StyledTitleTypography component={'h1'} variant={'h4'}>
                                {dlorSeries?.series_name}
                            </StyledTitleTypography>
                        </Box>
                        <StyledHeaderDiv data-testid="dlor-seriespage-description">
                            {!!dlorSeries?.series_description
                                ? parse(dlorSeries?.series_description)
                                : 'This series does not have a detailed description at this time.'}
                        </StyledHeaderDiv>
                        {!!dlorList &&
                            dlorList
                                .filter(item => item.object_series_id && item.object_series_id == seriesId)
                                .sort((a, b) => {
                                    /* istanbul ignore next */
                                    const orderA =
                                        a.object_series_order !== undefined
                                            ? a.object_series_order
                                            : Number.MAX_SAFE_INTEGER;
                                    /* istanbul ignore next */
                                    const orderB =
                                        b.object_series_order !== undefined
                                            ? b.object_series_order
                                            : Number.MAX_SAFE_INTEGER;
                                    return orderA - orderB;
                                })
                                .map((item, index) => {
                                    return displayItemPanel(item, index);
                                })}
                    </Grid>
                </StyledContentGrid>
            )}

            {!!dlorListLoading && <ContentLoader />}
            {!!dlorSeriesError && (
                <StyledHeaderDiv data-testid="dlor-seriespage-loadError">
                    <StyledTitleTypography component={'p'}>{dlorSeriesError}</StyledTitleTypography>
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
    actions: PropTypes.any,
};

export default React.memo(SeriesView);

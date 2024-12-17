import React from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { PropTypes } from 'prop-types';

import { styled } from '@mui/material/styles';

import { Link } from 'react-router-dom';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { Box, useMediaQuery, useTheme } from '@mui/material';

const fallBackImage = require('../../../../../public/images/article_placeholder.jpg');

const loadFallbackImage = image => {
    image.src = fallBackImage;
};

const StyledGridItem = styled(Grid)(({ articleindex, theme }) => {
    return {
        /* Parent */
        [theme.breakpoints.down('xs')]: {
            paddingTop: '24px !important',
            paddingLeft: '24px !important',
        },
        [theme.breakpoints.up('sm')]: {
            paddingTop: articleindex === 0 ? '24px !important' : '32px !important',
            paddingLeft: '32px !important',
        },
        /* items and utility styles */
        '.article-card': {
            [theme.breakpoints.up('xs')]: {
                border: articleindex === 0 ? '1px solid #dcdcdd' : 'none',
                '&:hover': {
                    backgroundColor: articleindex === 0 ? '#f3f3f4' : 'none',
                },
            },
            [theme.breakpoints.up('sm')]: {
                border: '1px solid #dcdcdd',
                '&:hover': {
                    backgroundColor: '#f3f3f4',
                },
            },
        },
        'article-container': {
            [theme.breakpoints.down('uqDsTablet')]: {
                padding: '0 24px 0 !important',
            },
        },
        '.ArticleCategory': {
            color: '#666 !important',
            fontFamily: '"Roboto", Helvetica, Arial, sans-serif',
            fontWeight: 500,
            letterSpacing: '0.16px',
            marginBottom: articleindex === 0 ? '.25rem' : '0',
            textDecoration: 'none !important',
            [theme.breakpoints.up('xs')]: {
                paddingTop: articleindex === 0 ? '24px !important' : 'none',
            },
            [theme.breakpoints.up('sm')]: {
                paddingTop: '0px !important',
            },
        },
        '.ArticleTextContainer': {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
            height: '100%',
            justifyContent: articleindex === 0 ? 'center' : 'top',
            paddingTop: '0px !important',

            [theme.breakpoints.up('xs')]: {
                paddingLeft: articleindex !== 0 ? 0 : 24,
                paddingRight: articleindex !== 0 ? 0 : 24,
                paddingBottom: '24px',
            },
            [theme.breakpoints.up('sm')]: {
                paddingLeft: 24,
                paddingRight: 24,
                paddingBottom: articleindex !== 0 ? 0 : 24,
            },
            [theme.breakpoints.up('md')]: {
                paddingLeft: 24,
                paddingRight: 24,
                paddingBottom: articleindex !== 0 ? 0 : 24,
            },
        },
        '.ArticleTitle': {
            letterSpacing: '0.24px',
        },
        a: {
            textDecoration: 'none !important',
            '&:hover': {
                textDecoration: 'none !important',
            },
            '&:hover h3': {
                textDecoration: 'underline !important',
            },
        },

        'a .ArticleDescription': {
            color: '#3b383e',
            lineHeight: '1.6',
        },
        h3: {
            color: '#19151c',
            textDecoration: 'none',
            '&:hover': {
                textDecoration: 'none',
            },
        },
    };
});

const RenderImage = (articleindex, article, theme, isSm) => {
    return (
        <Box
            sx={{
                width: {
                    xs: articleindex === 0 ? '100%' : '120px',
                    sm: articleindex === 0 ? '50%' : '100%',
                    md: articleindex === 0 ? '50%' : '100%',
                    lg: articleindex === 0 ? '50%' : '100%',
                    xl: articleindex === 0 ? '50%' : '100%',
                },
            }}
        >
            <div
                style={{
                    width: '100%',
                    position: 'relative',
                    paddingBottom: isSm && articleindex !== 0 ? '91.534%' : '66.667%',
                    marginBottom: articleindex === 0 ? null : '32px',
                }}
            >
                <img
                    src={article.image ?? fallBackImage}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                    }}
                    alt={article.title}
                    onError={() => loadFallbackImage(event.target)}
                />
            </div>
        </Box>
        // </Grid>
    );
};

const RenderTextblock = (articleindex, article, theme, isSm) => {
    return (
        <Box
            sx={{
                width: {
                    xs: articleindex === 0 ? '100%' : 'calc(100% - 120px)',
                    sm: articleindex === 0 ? '50%' : '100%',
                    md: articleindex === 0 ? '50%' : '100%',
                    lg: articleindex === 0 ? '50%' : '100%',
                    xl: articleindex === 0 ? '50%' : '100%',
                },
                paddingBottom: {
                    xs: articleindex !== 0 ? '0px' : '24px',
                    sm: articleindex === 0 ? '0px' : '24px',
                    md: articleindex === 0 ? '0px' : '24px',
                    lg: articleindex === 0 ? '0px' : '24px',
                    xl: articleindex === 0 ? '0px' : '24px',
                },
            }}
            className="ArticleContainer"
        >
            <div className="ArticleTextContainer">
                <Typography
                    component={'p'}
                    className={'ArticleCategory'}
                    sx={{
                        marginTop: isSm || articleindex === 0 ? '0' : '24px',
                        marginBottom: '0',
                        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                        color: '#666 !important',
                    }}
                >
                    {article.categories[0]}
                </Typography>
                <Typography
                    component={'h3'}
                    className={'ArticleTitle'}
                    sx={{
                        lineHeight: '1.2',
                        marginTop: '0',
                        letterSpacing: '0.01',
                        fontSize: isSm ? '22px' : '24px',
                        fontWeight: 500,
                        marginRight: isSm ? '16px' : '0px',
                        height: {
                            sx: 'auto',
                            sm: articleindex === 0 ? 'auto' : '116px',
                            md: articleindex === 0 ? 'auto' : '116px',
                            lg: articleindex === 0 ? 'auto' : '116px',
                            xl: articleindex === 0 ? 'auto' : '116px',
                        },
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: 'vertical',
                        textOverflow: 'ellipsis',
                        // marginBottom: '24px',
                    }}
                    data-testid={`article-${articleindex + 1}-title`}
                >
                    {article.title}
                </Typography>
                {!!article.description && article.description.trim() !== '' && (
                    <Typography
                        component={'p'}
                        sx={{
                            marginTop: '0.5em',
                            fontFamily: '"Roboto", Helvetica, Arial, sans-serif',
                            fontWeight: '400 !important',
                            letterSpacing: '.01rem !important',
                            textDecoration: 'none !important',
                        }}
                        className={'ArticleDescription'}
                    >
                        {articleindex === 0 && article.description}
                    </Typography>
                )}
            </div>
        </Box>
    );
};

const LibraryArticle = ({ article, articleindex }) => {
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
    return (
        <StyledGridItem
            key={articleindex}
            articleindex={articleindex}
            theme={theme}
            item
            xs={12}
            sm={articleindex === 0 ? 12 : 6}
            md={articleindex === 0 ? 12 : 4}
            className="article-container"
        >
            <StandardCard className={'article-card'} noPadding noHeader style={{ boxShadow: 'none' }}>
                <Link to={article.canonical_url} data-testid={`drupal-article-${articleindex}`}>
                    <Grid container sx={{ borderBottom: isSm ? '1px solid #ddd' : 'none' }}>
                        {(articleindex === 0 && isSmUp) || (articleindex !== 0 && isSm)
                            ? RenderTextblock(articleindex, article, theme, isSm)
                            : RenderImage(articleindex, article, theme, isSm)}
                        {(articleindex === 0 && isSmUp) || (articleindex !== 0 && isSm)
                            ? RenderImage(articleindex, article, theme, isSm)
                            : RenderTextblock(articleindex, article, theme, isSm)}
                    </Grid>
                </Link>
            </StandardCard>
        </StyledGridItem>
    );
};

LibraryArticle.propTypes = {
    article: PropTypes.object,
    articleindex: PropTypes.number,
};

export default LibraryArticle;

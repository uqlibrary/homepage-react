import React from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { PropTypes } from 'prop-types';

import { styled } from '@mui/material/styles';

import { Link } from 'react-router-dom';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { Box, useMediaQuery, useTheme } from '@mui/material';

const fallBackImage = require('../../../../../public/images/article_placeholder.png');

const loadFallbackImage = image => {
    image.src = fallBackImage;
};

const StyledGridItem = styled(Grid)(({ articleIndex, theme }) => {
    return {
        /* Parent */
        [theme.breakpoints.up('xs')]: {
            paddingTop: '24px !important',
            paddingLeft: '24px !important',
        },
        [theme.breakpoints.up('sm')]: {
            paddingTop: articleIndex === 0 ? '24px !important' : '32px !important',
            paddingLeft: '32px !important',
        },
        /* items and utility styles */
        '.article-card': {
            [theme.breakpoints.up('xs')]: {
                border: articleIndex === 0 ? '1px solid #dcdcdd' : 'none',
                '&:hover': {
                    backgroundColor: articleIndex === 0 ? '#f3f3f4' : 'none',
                },
            },
            [theme.breakpoints.up('sm')]: {
                border: '1px solid #dcdcdd',
                '&:hover': {
                    backgroundColor: '#f3f3f4',
                },
            },
        },
        '.ArticleCategory': {
            color: '#666 !important',
            fontFamily: '"Roboto", Helvetica, Arial, sans-serif',
            fontWeight: 500,
            marginBottom: '0',
            textDecoration: 'none !important',
            [theme.breakpoints.up('xs')]: {
                paddingTop: articleIndex === 0 ? '24px !important' : 'none',
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
            justifyContent: articleIndex === 0 ? 'center' : 'top',
            paddingTop: '0px !important',
            // paddingBottom: '24px',
            [theme.breakpoints.up('xs')]: {
                paddingLeft: articleIndex !== 0 ? 0 : 24,
                paddingRight: articleIndex !== 0 ? 0 : 24,
                paddingBottom: '24px',
            },
            [theme.breakpoints.up('sm')]: {
                paddingLeft: 24,
                paddingRight: 24,
                paddingBottom: articleIndex !== 0 ? 0 : 24,
            },
            [theme.breakpoints.up('md')]: {
                paddingLeft: 24,
                paddingRight: 24,
                paddingBottom: articleIndex !== 0 ? 0 : 24,
            },
        },
        '.ArticleTitle': {},
        a: {
            textDecoration: 'none',
            '&:hover': {
                textDecoration: 'none',
            },
            '&:hover h3': {
                textDecoration: 'underline',
            },
        },

        'a .ArticleDescription': {
            color: 'black',
        },
        h3: {
            color: 'black',
            textDecoration: 'none',
            '&:hover': {
                textDecoration: 'none',
            },
        },
    };
});

const RenderImage = (articleIndex, article, theme, isSm) => {
    return (
        <Box
            sx={{
                width: {
                    xs: articleIndex === 0 ? '100%' : '120px',
                    sm: articleIndex === 0 ? '50%' : '100%',
                    md: articleIndex === 0 ? '50%' : '100%',
                    lg: articleIndex === 0 ? '50%' : '100%',
                    xl: articleIndex === 0 ? '50%' : '100%',
                },
            }}
        >
            <div
                style={{
                    width: '100%',
                    position: 'relative',
                    paddingBottom: isSm && articleIndex !== 0 ? '91.534%' : '66.667%',
                }}
            >
                <img
                    src={article.image}
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

const RenderTextblock = (articleIndex, article, theme, isSm) => {
    return (
        <Box
            sx={{
                width: {
                    xs: articleIndex === 0 ? '100%' : 'calc(100% - 120px)',
                    sm: articleIndex === 0 ? '50%' : '100%',
                    md: articleIndex === 0 ? '50%' : '100%',
                    lg: articleIndex === 0 ? '50%' : '100%',
                    xl: articleIndex === 0 ? '50%' : '100%',
                },
                paddingBottom: {
                    xs: articleIndex !== 0 ? '0px' : '24px',
                    sm: articleIndex === 0 ? '0px' : '24px',
                    md: articleIndex === 0 ? '0px' : '24px',
                    lg: articleIndex === 0 ? '0px' : '24px',
                    xl: articleIndex === 0 ? '0px' : '24px',
                },
            }}
            className="ArticleContainer"
        >
            <div className="ArticleTextContainer">
                <Typography
                    component={'p'}
                    className={'ArticleCategory'}
                    sx={{
                        marginTop: isSm || articleIndex === 0 ? '0' : '24px',
                        marginBottom: '0',
                        fontFamily: '"Roboto", Helvetica, Arial, sans-serif',
                        color: '#666 !important',
                        fontWeight: 500,
                        textDecoration: 'none !important',
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
                            sm: articleIndex === 0 ? 'auto' : '116px',
                            md: articleIndex === 0 ? 'auto' : '116px',
                            lg: articleIndex === 0 ? 'auto' : '116px',
                            xl: articleIndex === 0 ? 'auto' : '116px',
                        },
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: 'vertical',
                        textOverflow: 'ellipsis',
                        // marginBottom: '24px',
                    }}
                    data-testid={`article-${articleIndex + 1}-title`}
                >
                    {article.title}
                </Typography>
                {!!article.description && (
                    <Typography
                        component={'p'}
                        sx={{
                            marginTop: '0.5em',
                            fontFamily: '"Roboto", Helvetica, Arial, sans-serif',
                            fontWeight: '300 !important',
                            letterSpacing: '.01rem !important',
                            textDecoration: 'none !important',
                        }}
                        className={'ArticleDescription'}
                    >
                        {articleIndex === 0 && article.description}
                    </Typography>
                )}
            </div>
        </Box>
    );
};

const LibraryArticle = ({ article, articleIndex }) => {
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
    return (
        <StyledGridItem
            articleIndex={articleIndex}
            theme={theme}
            item
            xs={12}
            sm={articleIndex === 0 ? 12 : 6}
            md={articleIndex === 0 ? 12 : 4}
            className="article-container"
        >
            <StandardCard className={'article-card'} noPadding noHeader>
                <Link to={article.canonical_url}>
                    <Grid container sx={{ borderBottom: isSm ? '1px solid #ddd' : 'none' }}>
                        {(articleIndex === 0 && isSmUp) || (articleIndex !== 0 && isSm)
                            ? RenderTextblock(articleIndex, article, theme, isSm)
                            : RenderImage(articleIndex, article, theme, isSm)}
                        {(articleIndex === 0 && isSmUp) || (articleIndex !== 0 && isSm)
                            ? RenderImage(articleIndex, article, theme, isSm)
                            : RenderTextblock(articleIndex, article, theme, isSm)}
                    </Grid>
                </Link>
            </StandardCard>
        </StyledGridItem>
    );
};

LibraryArticle.propTypes = {
    article: PropTypes.array,
    articleIndex: PropTypes.number,
};

export default LibraryArticle;

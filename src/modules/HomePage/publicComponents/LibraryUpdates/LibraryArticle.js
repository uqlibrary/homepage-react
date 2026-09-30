import React from 'react';

import Grid from '@mui/material/Grid';
import { PropTypes } from 'prop-types';

import { styled } from '@mui/material/styles';

import { Link } from 'react-router';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { useMediaQuery, useTheme } from '@mui/material';
import RenderImage from './partials/RenderImage';
import RenderTextblock from './partials/RenderTextblock';

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
                border: articleindex === 0 ? theme.palette.designSystem.border : 'none',
                '&:hover': {
                    backgroundColor: articleindex === 0 ? theme.palette.designSystem.panelBackgroundColor : 'none',
                },
            },
            [theme.breakpoints.up('sm')]: {
                border: theme.palette.designSystem.border,
                '&:hover': {
                    backgroundColor: theme.palette.designSystem.panelBackgroundColor,
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
            color: theme.palette.designSystem.bodyCopy,
            lineHeight: '1.6',
        },
        h3: {
            color: theme.palette.designSystem.headingColor,
            textDecoration: 'none',
            '&:hover': {
                textDecoration: 'none',
            },
        },
    };
});

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
                <Link
                    to={article.canonical_url}
                    data-testid={`drupal-article-${articleindex}`}
                    data-analyticsid={`spotlights-link-${articleindex}`}
                >
                    <Grid container sx={{ borderBottom: isSm ? '1px solid #ddd' : 'none' }}>
                        {(articleindex === 0 && isSmUp) || (articleindex !== 0 && isSm) ? (
                            <RenderTextblock articleindex={articleindex} article={article} isSm={isSm} />
                        ) : (
                            <RenderImage articleindex={articleindex} article={article} isSm={isSm} />
                        )}
                        {(articleindex === 0 && isSmUp) || (articleindex !== 0 && isSm) ? (
                            <RenderImage articleindex={articleindex} article={article} isSm={isSm} />
                        ) : (
                            <RenderTextblock articleindex={articleindex} article={article} isSm={isSm} />
                        )}
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

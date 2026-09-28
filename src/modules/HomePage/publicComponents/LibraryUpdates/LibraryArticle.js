import React from 'react';

import Grid from '@mui/material/Grid';
import { PropTypes } from 'prop-types';

import { styled } from '@mui/material/styles';
import { ArticleCard } from 'modules/SharedComponents/Toolbox/ArticleCard';

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
        'article-container': {
            [theme.breakpoints.down('uqDsTablet')]: {
                padding: '0 24px 0 !important',
            },
        },
    };
});

const LibraryArticle = ({ article, articleindex }) => {
    return (
        <StyledGridItem
            key={articleindex}
            articleindex={articleindex}
            item
            xs={12}
            sm={articleindex === 0 ? 12 : 6}
            md={articleindex === 0 ? 12 : 4}
            className="article-container"
        >
            <ArticleCard
                article={article}
                articleindex={articleindex}
                linkTestId={`drupal-article-${articleindex}`}
                analyticsId={`spotlights-link-${articleindex}`}
                titleTestId={`article-${articleindex + 1}-title`}
                enableFeaturedLayout
                useRouterLink
            />
        </StyledGridItem>
    );
};

LibraryArticle.propTypes = {
    article: PropTypes.object,
    articleindex: PropTypes.number,
};

export default LibraryArticle;

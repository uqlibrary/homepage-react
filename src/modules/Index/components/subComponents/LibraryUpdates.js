import React from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { linkToDrupal } from 'helpers/general';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import LibraryArticle from './LibraryArticle';

import { styled } from '@mui/material/styles';

const StyledLink = styled(Link)(({ theme }) => ({
    color: theme.palette.primary.light,
    fontWeight: 500,
    display: 'inline-block',
    marginLeft: '16px',
    paddingBlock: '2px',
    textDecoration: 'underline',
    transition: 'color 200ms ease-out, text-decoration 200ms ease-out, background-color 200ms ease-out',
    '&:hover': {
        color: '#fff',
        backgroundColor: theme.palette.primary.light,
    },
}));

const LibraryUpdates = ({ drupalArticleList, drupalArticlesError, drupalArticlesLoading }) => {
    return (
        <StandardPage>
            <Grid
                container
                spacing={4}
                style={{ marginTop: 0, paddingTop: 0 }}
                data-testid="library-updates-parent"
                key="library-updates-parent"
            >
                <Grid item xs={12} style={{ marginTop: 0, paddingTop: 0 }}>
                    <Typography
                        component={'h2'}
                        sx={{ marginTop: '72px', fontSize: '32px', fontWeight: 500, display: 'inline-block' }}
                    >
                        Library updates
                    </Typography>
                    <StyledLink to={linkToDrupal('/about-us/news')}>See more updates</StyledLink>
                </Grid>
                {(() => {
                    if (!!drupalArticlesError) {
                        return (
                            <Grid item xs={12}>
                                <p data-testid="drupal-error">No articles found</p>
                            </Grid>
                        );
                    } else if (!!drupalArticlesLoading) {
                        return (
                            <Grid item xs={12}>
                                <p data-testid="drupal-loading">Loading</p>
                            </Grid>
                        );
                    } else if (drupalArticleList && Array.isArray(drupalArticleList) && drupalArticleList.length > 0) {
                        return drupalArticleList.map((article, index) => {
                            return index <= 3 ? (
                                <LibraryArticle article={article} articleindex={index} key={index} />
                            ) : null;
                        });
                    } else {
                        return (
                            <Grid item xs={12}>
                                <p data-testid="drupal-empty">No articles found</p>
                            </Grid>
                        );
                    }
                })()}
            </Grid>
        </StandardPage>
    );
};

LibraryUpdates.propTypes = {
    drupalArticleList: PropTypes.array,
    drupalArticlesError: PropTypes.bool,
    drupalArticlesLoading: PropTypes.bool,
};

export default LibraryUpdates;

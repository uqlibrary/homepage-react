import React from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import LibraryArticle from './LibraryArticle';

const LibraryUpdates = ({drupalArticleList, drupalArticlesListError}) => {
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
                    <Typography component={'h2'} sx={{ marginTop: '72px', fontSize: '32px', fontWeight: 500 }}>
                        Library updates
                    </Typography>
                </Grid>
                {drupalArticleList && !drupalArticlesListError && Array.isArray(drupalArticleList) ? (
                    drupalArticleList.map((article, index) => {
                        if (index <= 3) {
                            return <LibraryArticle article={article} articleindex={index} key={index} />;
                        } else {
                            return null;
                        }
                    })
                ) : (
                    <Grid item xs={12} index={0}>
                        <p>No articles found</p>
                    </Grid>
                )}
            </Grid>
        </StandardPage>
    );
};

export default LibraryUpdates;

import React from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import LibraryArticle from './LibraryArticle';

const LibraryUpdates = drupalArticleList => {
    console.log('ARTICLE LIST AVAILABLE FROM THE COMPONENT', drupalArticleList);
    return (
        <StandardPage>
            <Grid container spacing={4} data-testid="library-updates-parent">
                <Grid item xs={12}>
                    <Typography component={'h2'} sx={{ marginTop: '1em', fontSize: '24px', fontWeight: 500 }}>
                        Library updates
                    </Typography>
                </Grid>
                {drupalArticleList && Array.isArray(drupalArticleList.drupalArticleList) ? (
                    drupalArticleList.drupalArticleList.map((article, index) => {
                        if (index <= 3) {
                            console.log('THE INDEX IS', index);
                            return <LibraryArticle article={article} articleIndex={index} />;
                        } else {
                            return null;
                        }
                    })
                ) : (
                    <p>No articles found</p>
                )}
                {/* <Grid item xs={12} sx={{ paddingTop: '0px' }}>
                    <StandardCard style={{ border: '1px solid #d1d0d2' }} noPadding noHeader>

                        <Grid container>
                            <Grid item xs={6}>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'left',
                                        height: '100%',
                                        justifyContent: 'center',
                                        paddingLeft: 20,
                                    }}
                                >
                                    <Typography
                                        component={'p'}
                                        sx={{
                                            marginTop: '0.5em',
                                            marginBottom: '0',
                                            fontFamily: '"Roboto", Helvetica, Arial, sans-serif',
                                            color: '#aaa',
                                            fontWeight: 500,
                                        }}
                                    >
                                        Research fellowships
                                    </Typography>
                                    <Typography
                                        component={'h2'}
                                        sx={{ marginTop: '0', fontSize: '24px', fontWeight: 500 }}
                                    >
                                        Rae and George Hammer Memorial
                                    </Typography>
                                    <Typography
                                        component={'p'}
                                        sx={{
                                            marginTop: '0.5em',
                                            fontFamily: '"Roboto", Helvetica, Arial, sans-serif',
                                        }}
                                    >
                                        Visiting research fellowship: up to $2,500 for students from universities
                                        outside of Brisbane to access our Fryer library collections
                                    </Typography>
                                </div>
                            </Grid>

                            <Grid item xs={6}>
                                <div
                                    style={{ width: '100%', height: 0, position: 'relative', paddingBottom: '66.667%' }}
                                >
                                    <img
                                        src="/images/Rae-George-Hammer.jpg"
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            height: '100%',
                                            width: '100%',
                                            objectFit: 'cover',
                                            objectPosition: 'center',
                                        }}
                                    />
                                </div>
                            </Grid>
                        </Grid>
                    </StandardCard>
                </Grid>
                <Grid item xs={12} md={4} sx={{ paddingTop: '0px' }}>
                    <StandardCard style={{ border: '1px solid #d1d0d2' }} noPadding noHeader>
                        <Grid container>

                            <Grid item xs={12}>
                                <div
                                    style={{ width: '100%', height: 0, position: 'relative', paddingBottom: '66.667%' }}
                                >
                                    <img
                                        src="/images/DE_Accessibility_DrupalCard.jpg"
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            height: '100%',
                                            width: '100%',
                                            objectFit: 'cover',
                                            objectPosition: 'center',
                                        }}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'left',
                                        height: '100%',
                                        justifyContent: 'center',
                                        paddingLeft: 20,
                                        // paddingBottom: 20,
                                    }}
                                >
                                    <Typography
                                        component={'p'}
                                        sx={{
                                            marginTop: '0.5em',
                                            marginBottom: '0',
                                            fontFamily: '"Roboto", Helvetica, Arial, sans-serif',
                                            color: '#aaa',
                                            fontWeight: 500,
                                        }}
                                    >
                                        Research fellowships
                                    </Typography>
                                    <Typography
                                        component={'h2'}
                                        sx={{ marginTop: '0', fontSize: '24px', fontWeight: 500 }}
                                    >
                                        Rae and George Hammer Memorial
                                    </Typography>
                                    <Typography
                                        component={'p'}
                                        sx={{
                                            paddingBottom: '20px',
                                            marginTop: '0.5em',
                                            fontFamily: '"Roboto", Helvetica, Arial, sans-serif',
                                        }}
                                    >
                                        Visiting research fellowship: up to $2,500 for students from universities
                                        outside of Brisbane to access our Fryer library collections
                                    </Typography>
                                </div>
                            </Grid>
                        </Grid>
                    </StandardCard>
                </Grid>
                <Grid item xs={12} md={4} sx={{ paddingTop: '0px' }}>
                    <StandardCard style={{ border: '1px solid #d1d0d2' }}>item 3</StandardCard>
                </Grid>
                <Grid item xs={12} md={4} sx={{ paddingTop: '0px' }}>
                    <StandardCard style={{ border: '1px solid #d1d0d2' }}>item 4</StandardCard>
                </Grid> */}
            </Grid>
        </StandardPage>
    );
};

export default LibraryUpdates;

import React from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { PropTypes } from 'prop-types';

import { Link } from 'react-router-dom';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { useMediaQuery, useTheme } from '@mui/material';

const RenderImage = (articleIndex, article) => {
    return (
        <Grid item xs={12} md={articleIndex === 0 ? 6 : 12}>
            <div style={{ width: '100%', height: 0, position: 'relative', paddingBottom: '66.667%' }}>
                <img
                    // src="/images/Rae-George-Hammer.jpg"
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
                />
            </div>
        </Grid>
    );
};

const RenderTextblock = (articleIndex, article) => {
    console.log(article);
    return (
        <Grid item xs={12} md={articleIndex === 0 ? 6 : 12} sx={{ minHeight: '190px' }}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'left',
                    height: '100%',
                    justifyContent: articleIndex === 0 ? 'center' : 'top',
                    paddingLeft: 20,
                    paddingRight: 20,
                }}
            >
                <Typography
                    component={'p'}
                    sx={{
                        marginTop: '0.5em',
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
                    component={'h2'}
                    sx={{ marginTop: '0', fontSize: '24px', fontWeight: 500, color: 'black !imporant' }}
                    data-testid={`article-${articleIndex + 1}-title`}
                >
                    {article.title}
                </Typography>
                <Typography
                    component={'p'}
                    sx={{
                        marginTop: '0.5em',
                        fontFamily: '"Roboto", Helvetica, Arial, sans-serif',
                    }}
                >
                    {articleIndex === 0 && article.description}
                </Typography>
            </div>
        </Grid>
    );
};

const LibraryArticle = ({ article, articleIndex }) => {
    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.down('md'));
    return (
        <Grid item xs={12} md={articleIndex === 0 ? 12 : 4} sx={{ paddingTop: '0px' }}>
            <StandardCard style={{ border: '1px solid #d1d0d2' }} noPadding noHeader>
                <Link to={article.canonical_url}>
                    {/* Example Wide item - to componentise */}
                    <Grid container>
                        {articleIndex === 0 && !isMd
                            ? RenderTextblock(articleIndex, article)
                            : RenderImage(articleIndex, article)}
                        {/* Image Location */}
                        {articleIndex === 0 && !isMd
                            ? RenderImage(articleIndex, article)
                            : RenderTextblock(articleIndex, article)}
                    </Grid>
                </Link>
            </StandardCard>
        </Grid>
        // <Grid item xs={12} md={4} sx={{ paddingTop: '0px' }}>
        //     <StandardCard style={{ border: '1px solid #d1d0d2' }} noPadding noHeader>
        //         <Grid container>
        //             {/* Image Location */}
        //             <Grid item xs={12}>
        //                 <div style={{ width: '100%', height: 0, position: 'relative', paddingBottom: '66.667%' }}>
        //                     <img
        //                         src="/images/DE_Accessibility_DrupalCard.jpg"
        //                         style={{
        //                             position: 'absolute',
        //                             top: 0,
        //                             left: 0,
        //                             height: '100%',
        //                             width: '100%',
        //                             objectFit: 'cover',
        //                             objectPosition: 'center',
        //                         }}
        //                     />
        //                 </div>
        //             </Grid>
        //             <Grid item xs={12}>
        //                 <div
        //                     style={{
        //                         display: 'flex',
        //                         flexDirection: 'column',
        //                         alignItems: 'left',
        //                         height: '100%',
        //                         justifyContent: 'center',
        //                         paddingLeft: 20,
        //                         // paddingBottom: 20,
        //                     }}
        //                 >
        //                     <Typography
        //                         component={'p'}
        //                         sx={{
        //                             marginTop: '0.5em',
        //                             marginBottom: '0',
        //                             fontFamily: '"Roboto", Helvetica, Arial, sans-serif',
        //                             color: '#aaa',
        //                             fontWeight: 500,
        //                         }}
        //                     >
        //                         Research fellowships
        //                     </Typography>
        //                     <Typography component={'h2'} sx={{ marginTop: '0', fontSize: '24px', fontWeight: 500 }}>
        //                         Rae and George Hammer Memorial
        //                     </Typography>
        //                     <Typography
        //                         component={'p'}
        //                         sx={{
        //                             paddingBottom: '20px',
        //                             marginTop: '0.5em',
        //                             fontFamily: '"Roboto", Helvetica, Arial, sans-serif',
        //                         }}
        //                     >
        //                         Visiting research fellowship: up to $2,500 for students from universities outside of
        //                         Brisbane to access our Fryer library collections
        //                     </Typography>
        //                 </div>
        //             </Grid>
        //         </Grid>
        //     </StandardCard>
        // </Grid>
        // <Grid item xs={12} md={4} sx={{ paddingTop: '0px' }}>
        //     <StandardCard style={{ border: '1px solid #d1d0d2' }}>item 3</StandardCard>
        // </Grid>
        // <Grid item xs={12} md={4} sx={{ paddingTop: '0px' }}>
        //     <StandardCard style={{ border: '1px solid #d1d0d2' }}>item 4</StandardCard>
        // </Grid>
    );
};

LibraryArticle.propTypes = {
    article: PropTypes.array,
    articleIndex: PropTypes.number,
};

export default LibraryArticle;

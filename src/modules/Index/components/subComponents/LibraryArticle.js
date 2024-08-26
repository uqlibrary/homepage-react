import React from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { PropTypes } from 'prop-types';

import { styled } from '@mui/material/styles';

import { Link } from 'react-router-dom';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { Box, useMediaQuery, useTheme } from '@mui/material';

const StyledGridItem = styled(Grid)(() => ({
    a: {
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'none',
        },
        '&:hover h2': {
            textDecoration: 'underline',
        },
    },

    'a .ArticleDescription': {
        color: 'black',
    },
    h2: {
        color: 'black',
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'none',
        },
    },
}));

const RenderImage = (articleIndex, article, theme, isSm) => {
    return (
        // <Grid item xs={articleIndex === 0 ? 12 : 3} md={articleIndex === 0 ? 6 : 12}>
        <Box
            sx={{
                width: {
                    xs: articleIndex === 0 ? '100%' : '120px',
                    md: articleIndex === 0 ? '50%' : '100%',
                },
            }}
        >
            <div
                style={{
                    width: isSm && articleIndex !== 0 ? '120px' : '100%',
                    height: 0,
                    position: 'relative',
                    paddingBottom: isSm && articleIndex !== 0 ? '91.534%' : '66.667%',
                }}
            >
                <img
                    // src="/images/Rae-George-Hammer.jpg"
                    src={article.image}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: isSm && articleIndex !== 0 ? 0 : 0,
                        height: '100%',
                        width: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                    }}
                    alt={article.title}
                />
            </div>
        </Box>
        // </Grid>
    );
};

const RenderTextblock = (articleIndex, article, theme, isSm) => {
    console.log(article);
    return (
        // <Grid
        //     item
        //     xs={articleIndex === 0 ? 12 : 9}
        //     md={articleIndex === 0 ? 6 : 12}
        //     sx={{ minHeight: isSm ? '145px' : '160px' }}
        // >
        <Box
            sx={{
                width: {
                    xs: articleIndex === 0 ? '100%' : 'calc(100% - 120px)',
                    md: articleIndex === 0 ? '50%' : '100%',
                },
                minHeight: isSm ? '145px' : '160px',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'left',
                    height: '100%',
                    justifyContent: articleIndex === 0 ? 'center' : 'top',
                    paddingLeft: articleIndex !== 0 && theme.breakpoints.down('sm') ? 0 : 20,
                    paddingRight: articleIndex !== 0 && theme.breakpoints.down('sm') ? 0 : 20,
                }}
            >
                <Typography
                    component={'p'}
                    className={'ArticleCategory'}
                    sx={{
                        marginTop: isSm ? '0' : '0.5em',
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
                    sx={{
                        marginTop: '0',
                        fontSize: isSm ? '22px' : '24px',
                        fontWeight: 500,
                        marginRight: isSm ? '16px' : '0px',
                    }}
                    data-testid={`article-${articleIndex + 1}-title`}
                >
                    {article.title}
                </Typography>
                <Typography
                    component={'p'}
                    sx={{
                        marginTop: '0.5em',
                        fontFamily: '"Roboto", Helvetica, Arial, sans-serif',
                        fontWeight: '300 !important',
                        letterSpacing: '.01rem !important',
                        textDecoration: 'none !important',
                        marginBottom: '20px',
                    }}
                    className={'ArticleDescription'}
                >
                    {articleIndex === 0 && article.description}
                </Typography>
            </div>
            {/* </Grid> */}
        </Box>
    );
};

const LibraryArticle = ({ article, articleIndex }) => {
    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.up('md'));
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <StyledGridItem item xs={12} md={articleIndex === 0 ? 12 : 4} sx={{ paddingTop: '0px' }}>
            <StandardCard
                style={{ border: theme.breakpoints.down('sm') && articleIndex !== 0 ? 'none' : '1px solid #d1d0d2' }}
                noPadding
                noHeader
            >
                <Link to={article.canonical_url}>
                    {/* Example Wide item - to componentise */}
                    <Grid container sx={{ borderBottom: isSm ? '1px solid #ddd' : 'none' }}>
                        {(articleIndex === 0 && isMd) || (articleIndex !== 0 && isSm)
                            ? RenderTextblock(articleIndex, article, theme, isSm)
                            : RenderImage(articleIndex, article, theme, isSm)}
                        {/* Image Location */}
                        {(articleIndex === 0 && isMd) || (articleIndex !== 0 && isSm)
                            ? RenderImage(articleIndex, article, theme, isSm)
                            : RenderTextblock(articleIndex, article, theme, isSm)}
                    </Grid>
                </Link>
            </StandardCard>
        </StyledGridItem>
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

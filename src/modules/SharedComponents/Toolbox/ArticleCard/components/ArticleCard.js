import React from 'react';
import PropTypes from 'prop-types';

import { Box, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

const fallBackImage = require('../../../../../../public/images/article_placeholder.jpg');

const StyledArticleCardRoot = styled('div', {
    shouldForwardProp: prop => !['articleindex', 'enableFeaturedLayout'].includes(prop),
})(({ articleindex, enableFeaturedLayout, theme }) => ({
    '.article-card': {
        [theme.breakpoints.up('xs')]: {
            border: enableFeaturedLayout && articleindex === 0 ? theme.palette.designSystem.border : theme.palette.designSystem.border,
            '&:hover': {
                backgroundColor: '#fff',
            },
        },
        [theme.breakpoints.up('sm')]: {
            border: theme.palette.designSystem.border,
            '&:hover': {
                backgroundColor: '#fff',
            },
        },
    },
    '.ArticleCategory': {
        color: '#666 !important',
        fontFamily: '"Roboto", Helvetica, Arial, sans-serif',
        fontWeight: 500,
        letterSpacing: '0.16px',
        marginBottom: (enableFeaturedLayout && articleindex === 0) ? '.25rem' : '0',
        textDecoration: 'none !important',
        [theme.breakpoints.up('xs')]: {
            paddingTop: (enableFeaturedLayout && articleindex === 0) ? '24px !important' : 'none',
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
        justifyContent: (enableFeaturedLayout && articleindex === 0) ? 'center' : 'top',
        paddingTop: '0px !important',
        [theme.breakpoints.up('xs')]: {
            paddingLeft: (enableFeaturedLayout && articleindex === 0) ? 24 : 0,
            paddingRight: (enableFeaturedLayout && articleindex === 0) ? 24 : 0,
            paddingBottom: '24px',
        },
        [theme.breakpoints.up('sm')]: {
            paddingLeft: 24,
            paddingRight: 24,
            paddingBottom: (enableFeaturedLayout && articleindex === 0) ? 24 : 0,
        },
        [theme.breakpoints.up('md')]: {
            paddingLeft: 24,
            paddingRight: 24,
            paddingBottom: (enableFeaturedLayout && articleindex === 0) ? 24 : 0,
        },
    },
    '.ArticleTitle': {
        letterSpacing: '0.24px',
    },
    a: {
        color: 'inherit',
        fontWeight: 400,
        textDecoration: 'none !important',
        transition: 'none',
        paddingBlock: '0px !important',
        '&:hover': {
            color: 'inherit !important',
            backgroundColor: 'transparent !important',
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
}));

const StyledImageFrame = styled('div')(() => ({
    width: '100%',
    position: 'relative',
    paddingBottom: '66.667%',
}));

const StyledImage = styled('img')(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    objectFit: 'cover',
}));

const ArticleCard = ({
    article,
    articleindex,
    cardId,
    cardTestId,
    titleTestId,
    imageTestId,
    contentTestId,
    eyebrowTestId,
    textTestId,
    linkTestId,
    analyticsId,
    enableFeaturedLayout,
    useRouterLink,
}) => {
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

    const title = article?.title || 'Library update';
    const description = article?.description || '';
    const category = article?.categories?.[0] || 'Services and spaces';
    const canonicalUrl = article?.canonical_url || null;
    const imageSrc = article?.image || fallBackImage;
    const imagePosition = article?.imagePosition || 'center';

    // When featured layout is disabled, render simple stacked image/text
    if (!enableFeaturedLayout) {
        const linkContent = (
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <StyledImageFrame
                    style={{ paddingBottom: '66.667%' }}
                    data-testid={imageTestId}
                >
                    <StyledImage
                        src={imageSrc}
                        alt={title}
                        style={{ objectPosition: imagePosition }}
                        loading="lazy"
                        onError={event => {
                            if (event.currentTarget.src !== fallBackImage) {
                                event.currentTarget.src = fallBackImage;
                            }
                        }}
                    />
                </StyledImageFrame>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                        p: 2,
                    }}
                    className="ArticleContainer"
                    data-testid={contentTestId}
                >
                    <Typography
                        component="p"
                        className="ArticleCategory"
                        data-testid={eyebrowTestId}
                        sx={{
                            m: 0,
                            mb: 0.5,
                            fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                            color: '#666 !important',
                        }}
                    >
                        {category}
                    </Typography>
                    <Typography
                        component="h3"
                        className="ArticleTitle"
                        data-testid={titleTestId}
                        sx={{
                            lineHeight: '1.2',
                            m: 0,
                            mb: 1,
                            letterSpacing: '0.01',
                            fontSize: '24px',
                            fontWeight: 500,
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: 'vertical',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {title}
                    </Typography>
                    {!!description && description.trim() !== '' && (
                        <Typography
                            component="p"
                            className="ArticleDescription"
                            data-testid={textTestId}
                            sx={{
                                mt: '0.5em',
                                fontFamily: '"Roboto", Helvetica, Arial, sans-serif',
                                fontWeight: '400 !important',
                                letterSpacing: '.01rem !important',
                                color: '#5a5861',
                            }}
                        >
                            {description}
                        </Typography>
                    )}
                </Box>
            </Box>
        );

        return (
            <StyledArticleCardRoot articleindex={articleindex} enableFeaturedLayout={enableFeaturedLayout}>
                <StandardCard
                    className="article-card"
                    noPadding
                    noHeader
                    style={{ boxShadow: 'none' }}
                    standardCardId={cardId}
                    data-testid={cardTestId}
                >
                    {useRouterLink && !!canonicalUrl ? (
                        <Link to={canonicalUrl} data-testid={linkTestId} data-analyticsid={analyticsId}
                            style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', minHeight: '100%' }}
                        >
                            {linkContent}
                        </Link>
                    ) : (
                        <a href={canonicalUrl || undefined} data-testid={linkTestId} data-analyticsid={analyticsId}
                            style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', minHeight: '100%' }}
                        >
                            {linkContent}
                        </a>
                    )}
                </StandardCard>
            </StyledArticleCardRoot>
        );
    }

    // Featured layout path (original complex logic)
    const showTextFirst = (articleindex === 0 && isSmUp) || (articleindex !== 0 && isSm);

    const renderImage = () => (
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
            <StyledImageFrame
                style={{
                    paddingBottom: isSm && articleindex !== 0 ? '91.534%' : '66.667%',
                    marginBottom: isSm && articleindex !== 0 ? '32px' : null,
                }}
                data-testid={imageTestId}
            >
                <StyledImage
                    src={imageSrc}
                    alt={title}
                    style={{ objectPosition: imagePosition }}
                    loading="lazy"
                    onError={event => {
                        if (event.currentTarget.src !== fallBackImage) {
                            event.currentTarget.src = fallBackImage;
                        }
                    }}
                />
            </StyledImageFrame>
        </Box>
    );

    const renderTextBlock = () => (
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
            data-testid={contentTestId}
        >
            <div className="ArticleTextContainer">
                <Typography
                    component="p"
                    className="ArticleCategory"
                    data-testid={eyebrowTestId}
                    sx={{
                        marginTop: isSm || articleindex === 0 ? '0' : '24px',
                        marginBottom: 0,
                        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                        color: '#666 !important',
                    }}
                >
                    {category}
                </Typography>
                <Typography
                    component="h3"
                    className="ArticleTitle"
                    data-testid={titleTestId}
                    sx={{
                        lineHeight: '1.2',
                        marginTop: 0,
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
                    }}
                >
                    {title}
                </Typography>
                {!!description && description.trim() !== '' && (
                    <Typography
                        component="p"
                        className="ArticleDescription"
                        data-testid={textTestId}
                        sx={{
                            marginTop: '0.5em',
                            fontFamily: '"Roboto", Helvetica, Arial, sans-serif',
                            fontWeight: '400 !important',
                            letterSpacing: '.01rem !important',
                            textDecoration: 'none !important',
                        }}
                    >
                        {articleindex === 0 ? description : ''}
                    </Typography>
                )}
            </div>
        </Box>
    );

    const linkContent = (
        <Grid container sx={{ borderBottom: isSm ? '1px solid #ddd' : 'none' }}>
            {showTextFirst ? renderTextBlock() : renderImage()}
            {showTextFirst ? renderImage() : renderTextBlock()}
        </Grid>
    );

    return (
        <StyledArticleCardRoot articleindex={articleindex} enableFeaturedLayout={enableFeaturedLayout}>
            <StandardCard
                className="article-card"
                noPadding
                noHeader
                style={{ boxShadow: 'none' }}
                standardCardId={cardId}
                data-testid={cardTestId}
            >
                {useRouterLink && !!canonicalUrl ? (
                    <Link
                        to={canonicalUrl}
                        data-testid={linkTestId}
                        data-analyticsid={analyticsId}
                        style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', minHeight: '100%' }}
                    >
                        {linkContent}
                    </Link>
                ) : (
                    <a
                        href={canonicalUrl || undefined}
                        data-testid={linkTestId}
                        data-analyticsid={analyticsId}
                        style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', minHeight: '100%' }}
                    >
                        {linkContent}
                    </a>
                )}
            </StandardCard>
        </StyledArticleCardRoot>
    );
};

ArticleCard.propTypes = {
    article: PropTypes.object,
    articleindex: PropTypes.number,
    cardId: PropTypes.string,
    cardTestId: PropTypes.string,
    titleTestId: PropTypes.string,
    imageTestId: PropTypes.string,
    contentTestId: PropTypes.string,
    eyebrowTestId: PropTypes.string,
    textTestId: PropTypes.string,
    linkTestId: PropTypes.string,
    analyticsId: PropTypes.string,
    enableFeaturedLayout: PropTypes.bool,
    useRouterLink: PropTypes.bool,
};

ArticleCard.defaultProps = {
    article: {},
    articleindex: 0,
    cardId: undefined,
    cardTestId: undefined,
    titleTestId: undefined,
    imageTestId: undefined,
    contentTestId: undefined,
    eyebrowTestId: undefined,
    textTestId: undefined,
    linkTestId: undefined,
    analyticsId: undefined,
    enableFeaturedLayout: false,
    useRouterLink: false,
};

export default ArticleCard;

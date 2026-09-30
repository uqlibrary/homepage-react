import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const RenderTextblock = ({ articleindex, article, isSm }) => {
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

RenderTextblock.propTypes = {
    articleindex: PropTypes.number,
    article: PropTypes.object,
    isSm: PropTypes.bool,
};

export default RenderTextblock;

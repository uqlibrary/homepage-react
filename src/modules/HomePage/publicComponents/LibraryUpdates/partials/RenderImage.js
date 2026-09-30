import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';

const fallBackImage = require('../../../../../../public/images/article_placeholder.jpg');

const RenderImage = ({ articleindex, article, isSm }) => {
    return (
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
            <div
                style={{
                    width: '100%',
                    position: 'relative',
                    paddingBottom: isSm && articleindex !== 0 ? '91.534%' : '66.667%',
                    marginBottom: isSm && articleindex !== 0 ? '32px' : null,
                }}
            >
                <img
                    src={article.image ?? fallBackImage}
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
                    onError={event => {
                        event.currentTarget.src = fallBackImage;
                    }}
                />
            </div>
        </Box>
    );
};

RenderImage.propTypes = {
    articleindex: PropTypes.number,
    article: PropTypes.object,
    isSm: PropTypes.bool,
};

export default RenderImage;

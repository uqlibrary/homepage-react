import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

const TrailImage = ({ alt, className, imgStyle, loading = 'eager', onLoad, src, style, ...props }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    const handleLoad = event => {
        setIsLoaded(true);
        onLoad?.(event);
    };

    return (
        <Box
            className={className}
            sx={{
                position: 'relative',
                width: '100%',
                maxWidth: '100%',
                lineHeight: 0,
                ...style,
            }}
        >
            {!isLoaded ? (
                <Skeleton
                    variant="rectangular"
                    animation="wave"
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        transform: 'none',
                        borderRadius: 0,
                    }}
                />
            ) : null}
            <Box
                component="img"
                alt={alt}
                loading={loading}
                src={src}
                onLoad={handleLoad}
                sx={{
                    display: 'block',
                    width: '100%',
                    maxWidth: '100%',
                    height: 'auto',
                    position: 'relative',
                    opacity: isLoaded ? 1 : 0,
                    transition: 'opacity 180ms ease-out',
                    ...imgStyle,
                }}
                {...props}
            />
        </Box>
    );
};

TrailImage.propTypes = {
    alt: PropTypes.string.isRequired,
    className: PropTypes.string,
    imgStyle: PropTypes.object,
    loading: PropTypes.oneOf(['eager', 'lazy']),
    onLoad: PropTypes.func,
    src: PropTypes.string.isRequired,
    style: PropTypes.object,
};

export default TrailImage;

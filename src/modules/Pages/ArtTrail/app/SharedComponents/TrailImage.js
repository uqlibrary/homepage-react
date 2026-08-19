import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

const toNumericDimension = value => {
    const numericValue = Number(value);

    return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : null;
};

const TrailImage = ({
    alt,
    className,
    imgStyle,
    intrinsicHeight,
    intrinsicWidth,
    loading = 'eager',
    onLoad,
    src,
    style,
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const numericWidth = toNumericDimension(intrinsicWidth);
    const numericHeight = toNumericDimension(intrinsicHeight);

    const handleLoad = event => {
        setIsLoaded(true);
        onLoad?.(event);
    };

    return (
        <Box
            className={className}
            aria-label={alt}
            sx={{
                width: '100%',
                height: `calc(100dvw / (${numericWidth} / ${numericHeight}))`,
                aspectRatio: `${numericWidth} / ${numericHeight}`,
                position: 'relative',
                ...style,
            }}
        >
            {!isLoaded && (
                <Skeleton
                    variant="rectangular"
                    animation="wave"
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        transform: 'none',
                        borderRadius: 0,
                        zIndex: 1,
                    }}
                />
            )}

            <img
                alt={alt}
                width="100%"
                loading={loading}
                src={src}
                onLoad={handleLoad}
                {...props}
                style={{
                    display: 'block',
                    width: '100%',
                    height: 'auto',
                    position: 'relative',
                    zIndex: 0,
                    visibility: isLoaded ? 'visible' : 'hidden',
                    opacity: isLoaded ? 1 : 0,
                    transition: 'opacity 180ms ease-out',
                    verticalAlign: 'top',
                    ...imgStyle,
                }}
            />
        </Box>
    );
};

TrailImage.propTypes = {
    alt: PropTypes.string.isRequired,
    className: PropTypes.string,
    imgStyle: PropTypes.object,
    intrinsicHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    intrinsicWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    loading: PropTypes.oneOf(['eager', 'lazy']),
    onLoad: PropTypes.func,
    src: PropTypes.string.isRequired,
    style: PropTypes.object,
};

export default TrailImage;

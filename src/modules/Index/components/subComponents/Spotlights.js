import React from 'react';
import { PropTypes } from 'prop-types';
import {
    CarouselProvider,
    Slider,
    Slide,
    ButtonBack,
    ButtonNext,
    ButtonPlay,
    DotGroup,
    Dot,
    Image,
} from 'pure-react-carousel';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
// import Fade from '@mui/material/Fade';
import { makeStyles } from '@mui/styles';

import ContentLoader from 'react-content-loader';
const MyLoader = props => (
    <ContentLoader
        uniqueKey="personalisation-panel-or-hours"
        speed={2}
        width={'100%'}
        height={'90%'}
        viewBox="0 0 1500 528"
        backgroundColor="#51247A"
        foregroundColor="#e2e2e2"
        {...props}
    >
        <rect x="0" y="0" rx="5" ry="5" width="1967" height="721" />
    </ContentLoader>
);

const useStyles = makeStyles(() => ({
    loading: {
        height: '90%',
        position: 'relative',
        flexGrow: 1,
        borderRadius: 4,
        overflow: 'hidden',
    },
    playButtonWrapper: {
        width: 36,
        position: 'absolute',
        top: 4,
        left: 32,
        zIndex: 3,
    },
    nextButtonWrapper: {
        width: 36,
        height: '90%',
        position: 'absolute',
        top: 4,
        right: 0,
        zIndex: 2,
    },
    backButtonWrapper: {
        width: 36,
        height: '90%',
        position: 'absolute',
        top: 4,
        left: 4,
        zIndex: 2,
    },
    topBlock: { height: '90%', position: 'relative', borderRadius: 4, overflow: 'hidden' },
    chipStyles: {
        width: 200,
        marginLeft: -100,
        position: 'absolute',
        top: 0,
        left: '50%',
        zIndex: 3,
        textAlign: 'center',
        '& button': {
            margin: '0 1px',
        },
    },
}));

const Spotlights = ({ spotlights, spotlightsLoading, account }) => {
    const classes = useStyles();
    const totalSlides = spotlights && spotlights.length;
    if (spotlightsLoading || !totalSlides || totalSlides === 0) {
        return (
            <div
                data-testid="spotlights"
                className={`${classes.loading}`}
                role="region"
                aria-label="UQ Spotlights carousel loading"
            >
                <MyLoader />
            </div>
        );
    }
    const slides =
        spotlights && spotlights.length > 0
            ? spotlights.map((item, index) => {
                  return {
                      index,
                      src: item.img_url,
                      alt: item.img_alt,
                      aria: item.title,
                      link: item.url,
                  };
              })
            : /* istanbul ignore next */ [];
    const renderDots = dotprops => {
        const totalSlides = dotprops.totalSlides;
        const visibleSlides = dotprops.visibleSlides;
        const slideGroups = Math.ceil(totalSlides / visibleSlides);
        /* istanbul ignore next */
        if (slideGroups <= 1) {
            return null;
        } else {
            const dots = [];
            for (let i = 0; i < totalSlides; i++) {
                dots.push(i);
            }
            return dots.map((_, index) => (
                <Dot
                    slide={index}
                    key={index}
                    aria-label={`UQ Spotlights Slide ${index + 1} of ${totalSlides}`}
                    id={`spotlights-dot-${index}`}
                    data-testid={`spotlights-dot-${index}`}
                    data-analyticsid={`spotlights-dot-${index}`}
                />
            ));
        }
    };
    return (
        <div
            data-testid="spotlights"
            className={`${classes.topBlock}`}
            role="region"
            aria-label="UQ Spotlights carousel"
        >
            {/* <Fade in={totalSlides > 0} timeout={1000}> */}
            <CarouselProvider
                visibleSlides={1}
                totalSlides={totalSlides}
                step={1}
                naturalSlideWidth={1967}
                naturalSlideHeight={721}
                isPlaying={!account}
                interval={10000}
                style={{ height: '100%' }}
                id="spotlights-carousel"
                data-testid="spotlights-carousel"
            >
                {totalSlides > 1 && (
                    <div className={`${classes.backButtonWrapper}`}>
                        <ButtonBack
                            aria-label="Previous slide"
                            id="spotlights-previous-button"
                            data-testid="spotlights-previous-button"
                            data-analyticsid="spotlights-previous-button"
                        >
                            <ChevronLeftIcon />
                        </ButtonBack>
                    </div>
                )}
                {totalSlides > 1 && (
                    <div className={`${classes.nextButtonWrapper}`}>
                        <ButtonNext
                            aria-label="Next slide"
                            id="spotlights-next-button"
                            data-testid="spotlights-next-button"
                            data-analyticsid="spotlights-next-button"
                        >
                            <ChevronRightIcon />
                        </ButtonNext>
                    </div>
                )}
                {totalSlides > 1 && (
                    <div className={`${classes.playButtonWrapper}`}>
                        <ButtonPlay
                            childrenPlaying={<PauseIcon />}
                            childrenPaused={<PlayArrowIcon />}
                            aria-label="UQ Spotlights Play/Pause slides"
                            id="spotlights-play-pause-button"
                            data-testid="spotlights-play-pause-button"
                            data-analyticsid="spotlights-play-pause-button"
                        />
                    </div>
                )}
                {totalSlides > 1 && (
                    <div className={`${classes.chipStyles}`}>
                        <DotGroup showAsSelectedForCurrentSlideOnly renderDots={renderDots} />
                    </div>
                )}
                <div
                    style={{
                        zIndex: 2,
                    }}
                >
                    <Slider trayTag="div" aria-label="UQ Spotlights" aria-live="off">
                        {slides.map((item, index) => (
                            <Slide
                                tag="div"
                                index={index}
                                key={index}
                                id={`spotlights-slide-${index}`}
                                data-testid={`spotlights-slide-${index}`}
                                data-analyticsid={`spotlights-link-${index}`}
                                onClick={() => (window.location = item.link)}
                                style={{ cursor: 'pointer' }}
                            >
                                <Image
                                    src={item.src}
                                    alt={item.alt}
                                    style={{ width: '100%' }}
                                    id={`spotlights-image-${index}`}
                                    data-testid={`spotlights-image-${index}`}
                                    data-analyticsid={`spotlights-image-${index}`}
                                />
                            </Slide>
                        ))}
                    </Slider>
                </div>
            </CarouselProvider>
            {/* </Fade> */}
        </div>
    );
};

Spotlights.propTypes = {
    spotlights: PropTypes.array,
    spotlightsLoading: PropTypes.bool,
    account: PropTypes.object,
};

Spotlights.defaultProps = {
    spotlightsLoading: false,
};

export default Spotlights;

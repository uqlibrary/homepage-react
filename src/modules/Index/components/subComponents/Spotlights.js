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
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
const defaultSlide = require('../../../../../public/images/Welcome_Spotlight.jpg');
import ContentLoader from 'react-content-loader';
import Fade from '@material-ui/core/Fade';
const MyLoader = props => (
    <ContentLoader
        speed={2}
        width={'100%'}
        height={'100%'}
        viewBox="0 0 1500 528"
        backgroundColor="#f3f3f3"
        foregroundColor="#e2e2e2"
        {...props}
    >
        <rect x="0" y="0" rx="5" ry="5" width="100%" height="100%" />
    </ContentLoader>
);

const Spotlights = ({ spotlights, spotlightsLoading, account }) => {
    const totalSlides = spotlights && spotlights.length;
    if (spotlightsLoading || !totalSlides || totalSlides === 0) {
        return (
            <div
                data-testid="spotlights"
                style={{
                    height: '100%',
                    position: 'relative',
                    flexGrow: 1,
                    borderRadius: 4,
                    overflow: 'hidden',
                }}
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
            : [];
    const renderDots = dotprops => {
        const totalSlides = dotprops.totalSlides;
        const visibleSlides = dotprops.visibleSlides;
        const slideGroups = Math.ceil(totalSlides / visibleSlides);
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
                />
            ));
        }
    };
    return (
        <div
            data-testid="spotlights"
            style={{ height: '100%', position: 'relative', borderRadius: 4, overflow: 'hidden' }}
            role="region"
            aria-label="UQ Spotlights carousel"
        >
            <Fade in={totalSlides > 0} timeout={1000}>
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
                        <div
                            style={{
                                width: 36,
                                height: '100%',
                                position: 'absolute',
                                top: 4,
                                left: 4,
                                zIndex: 101,
                            }}
                        >
                            <ButtonBack
                                aria-label="Previous slide"
                                id="spotlights-previous-button"
                                data-testid="spotlights-previous-button"
                            >
                                <ChevronLeftIcon />
                            </ButtonBack>
                        </div>
                    )}
                    {totalSlides > 1 && (
                        <div
                            style={{
                                width: 36,
                                height: '100%',
                                position: 'absolute',
                                top: 4,
                                right: 0,
                                zIndex: 101,
                            }}
                        >
                            <ButtonNext
                                aria-label="Next slide"
                                id="spotlights-next-button"
                                data-testid="spotlights-next-button"
                            >
                                <ChevronRightIcon />
                            </ButtonNext>
                        </div>
                    )}
                    {totalSlides > 1 && (
                        <div
                            style={{
                                width: 36,
                                position: 'absolute',
                                top: 4,
                                left: 32,
                                zIndex: 101,
                            }}
                        >
                            <ButtonPlay
                                childrenPlaying={<PauseIcon />}
                                childrenPaused={<PlayArrowIcon />}
                                aria-label="UQ Spotlights Play/Pause slides"
                                id="spotlights-play-pause-button"
                                data-testid="spotlights-play-pause-button"
                            />
                        </div>
                    )}
                    {totalSlides > 1 && (
                        <div
                            style={{
                                width: 200,
                                marginLeft: -100,
                                position: 'absolute',
                                top: 0,
                                left: '50%',
                                zIndex: 101,
                                textAlign: 'center',
                            }}
                        >
                            <DotGroup showAsSelectedForCurrentSlideOnly renderDots={renderDots} />
                        </div>
                    )}
                    <div
                        style={{
                            zIndex: 99,
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
                                >
                                    <a
                                        href={item.link}
                                        aria-label={item.aria}
                                        id={`spotlights-link-${index}`}
                                        data-testid={`spotlights-link-${index}`}
                                    >
                                        <Image
                                            src={item.src}
                                            alt={item.alt}
                                            style={{ width: '100%' }}
                                            id={`spotlights-image-${index}`}
                                            data-testid={`spotlights-image-${index}`}
                                        />
                                    </a>
                                </Slide>
                            ))}
                        </Slider>
                    </div>
                </CarouselProvider>
            </Fade>
        </div>
    );
};

Spotlights.propTypes = {
    spotlights: PropTypes.array,
    spotlightsLoading: PropTypes.bool,
    defaultSlide: PropTypes.string,
    account: PropTypes.object,
};

Spotlights.defaultProps = {
    spotlightsLoading: false,
    defaultSlide: defaultSlide,
};

export default Spotlights;

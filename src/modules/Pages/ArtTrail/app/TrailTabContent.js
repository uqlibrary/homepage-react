import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

const PAGE_TRANSITION_DURATION_MS = 360;
const PAGE_TRANSITION_EASING = 'cubic-bezier(0.32, 0.72, 0, 1)';
const PAGE_BACKGROUND_COLOR = '#fff';

const buildEnteringTransform = (direction, isAnimating) => {
    if (isAnimating) {
        return 'translate3d(0, 0, 0) scale(1)';
    }

    return direction === 'backward' ? 'translate3d(-10%, 0, 0) scale(1)' : 'translate3d(10%, 0, 0) scale(1)';
};

const buildExitingTransform = (direction, isAnimating) => {
    if (!isAnimating) {
        return 'translate3d(0, 0, 0) scale(1)';
    }

    return direction === 'backward' ? 'translate3d(26%, 0, 0) scale(1)' : 'translate3d(-26%, 0, 0) scale(1)';
};

const buildEnteringShadow = (direction, isAnimating) => {
    if (!isAnimating) {
        return 'none';
    }

    return direction === 'backward' ? '18px 0 36px rgba(15, 23, 42, 0.08)' : '-18px 0 36px rgba(15, 23, 42, 0.08)';
};

const TrailTabContent = ({ tab, page, pageKey, openDrawer, navigationDirection }) => {
    const [displayedPage, setDisplayedPage] = useState(() => page);
    const [displayedPageKey, setDisplayedPageKey] = useState(() => pageKey);
    const [exitingPage, setExitingPage] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const animationFrameRef = useRef(null);
    const animationTimeoutRef = useRef(null);
    const transitionIdRef = useRef(0);
    const displayedPageRef = useRef(page);
    const displayedPageKeyRef = useRef(pageKey);

    useEffect(() => {
        displayedPageRef.current = displayedPage;
        displayedPageKeyRef.current = displayedPageKey;
    }, [displayedPage, displayedPageKey]);

    useEffect(() => {
        return () => {
            window.cancelAnimationFrame(animationFrameRef.current);
            window.clearTimeout(animationTimeoutRef.current);
        };
    }, []);

    useEffect(() => {
        if (pageKey === displayedPageKeyRef.current) {
            return;
        }

        const transitionId = transitionIdRef.current + 1;
        transitionIdRef.current = transitionId;
        const previousPage = displayedPageRef.current;

        window.cancelAnimationFrame(animationFrameRef.current);
        window.clearTimeout(animationTimeoutRef.current);

        setExitingPage(() => previousPage);
        setDisplayedPage(() => page);
        setDisplayedPageKey(pageKey);
        setIsAnimating(false);

        animationFrameRef.current = window.requestAnimationFrame(() => {
            animationFrameRef.current = window.requestAnimationFrame(() => {
                if (transitionIdRef.current === transitionId) {
                    setIsAnimating(true);
                }
            });
        });

        animationTimeoutRef.current = window.setTimeout(() => {
            if (transitionIdRef.current !== transitionId) {
                return;
            }

            setExitingPage(null);
            setIsAnimating(false);
        }, PAGE_TRANSITION_DURATION_MS);
    }, [page, pageKey]);

    const PageComponent = displayedPage;
    const ExitingPageComponent = exitingPage;
    const showTransition = Boolean(ExitingPageComponent);

    return (
        <Box sx={{ position: 'relative', overflow: 'hidden', bgcolor: PAGE_BACKGROUND_COLOR }}>
            {showTransition ? (
                <Box
                    aria-hidden="true"
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: navigationDirection === 'backward' ? 2 : 1,
                        pointerEvents: 'none',
                        bgcolor: PAGE_BACKGROUND_COLOR,
                        transform: buildExitingTransform(navigationDirection, isAnimating),
                        opacity: 1,
                        transition: `transform ${PAGE_TRANSITION_DURATION_MS}ms ${PAGE_TRANSITION_EASING}`,
                        willChange: 'transform',
                    }}
                >
                    <ExitingPageComponent tab={tab} openDrawer={openDrawer} />
                </Box>
            ) : null}
            <Box
                sx={{
                    position: 'relative',
                    zIndex: navigationDirection === 'backward' ? 1 : 2,
                    bgcolor: PAGE_BACKGROUND_COLOR,
                    transform: showTransition
                        ? buildEnteringTransform(navigationDirection, isAnimating)
                        : 'translate3d(0, 0, 0) scale(1)',
                    opacity: 1,
                    boxShadow: showTransition ? buildEnteringShadow(navigationDirection, isAnimating) : 'none',
                    transition: showTransition
                        ? `transform ${PAGE_TRANSITION_DURATION_MS}ms ${PAGE_TRANSITION_EASING}, box-shadow ${PAGE_TRANSITION_DURATION_MS}ms ${PAGE_TRANSITION_EASING}`
                        : 'none',
                    willChange: showTransition ? 'transform, box-shadow' : 'auto',
                }}
            >
                <PageComponent tab={tab} openDrawer={openDrawer} />
            </Box>
        </Box>
    );
};

TrailTabContent.propTypes = {
    navigationDirection: PropTypes.oneOf(['forward', 'backward']).isRequired,
    pageKey: PropTypes.string.isRequired,
    tab: PropTypes.shape({
        label: PropTypes.string.isRequired,
        subtitle: PropTypes.string,
    }).isRequired,
    page: PropTypes.elementType.isRequired,
    openDrawer: PropTypes.func.isRequired,
};

export default TrailTabContent;

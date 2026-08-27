import React, { useEffect, useId, useMemo, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import HeadphonesOutlinedIcon from '@mui/icons-material/HeadphonesOutlined';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';

const PLAYBACK_STATES = {
    IDLE: 'idle',
    PLAYING: 'playing',
    STOPPED: 'stopped',
};
const CONTROL_BUTTON_SIZE_PX = 48;

const formatTime = value => {
    if (!Number.isFinite(value) || value <= 0) {
        return '0:00';
    }

    const totalSeconds = Math.floor(value);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

const TrailAudioPlayer = ({ className, description, src, stopSignal, title }) => {
    const audioRef = useRef(null);
    const playButtonRef = useRef(null);
    const stopButtonRef = useRef(null);
    const pendingFocusRef = useRef(null);
    const hasMountedStopSignalRef = useRef(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackState, setPlaybackState] = useState(PLAYBACK_STATES.IDLE);
    const [playbackError, setPlaybackError] = useState(false);
    const descriptionId = useId();
    const timeId = useId();
    const isPlaying = playbackState === PLAYBACK_STATES.PLAYING;
    const isStopped = playbackState === PLAYBACK_STATES.STOPPED;
    const canReplay = isStopped && currentTime > 0;
    const progressValue = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;
    const progressValueText = useMemo(() => {
        if (!duration) {
            return 'Not started';
        }

        return `${formatTime(currentTime)} of ${formatTime(duration)}`;
    }, [currentTime, duration]);

    const resetPlaybackState = () => {
        setCurrentTime(0);
        setPlaybackState(PLAYBACK_STATES.IDLE);
        setPlaybackError(false);
    };

    const stopPlayback = useCallback(({ resetToStart = true, nextState = PLAYBACK_STATES.IDLE } = {}) => {
        const audioElement = audioRef.current;

        if (!audioElement) {
            if (resetToStart) {
                resetPlaybackState();
            } else {
                setPlaybackState(nextState);
                setPlaybackError(false);
            }
            return;
        }

        audioElement.pause();

        if (resetToStart) {
            audioElement.currentTime = 0;
            resetPlaybackState();
            return;
        }

        setPlaybackState(nextState);
        setPlaybackError(false);
    }, []);

    const startPlayback = async () => {
        const audioElement = audioRef.current;

        if (!audioElement) {
            return;
        }

        try {
            pendingFocusRef.current = 'stop';
            await audioElement.play();
            setPlaybackState(PLAYBACK_STATES.PLAYING);
            setPlaybackError(false);
        } catch {
            pendingFocusRef.current = null;
            setPlaybackState(PLAYBACK_STATES.IDLE);
            setPlaybackError(true);
        }
    };

    const handleReplay = () => {
        const audioElement = audioRef.current;

        if (!audioElement) {
            return;
        }

        pendingFocusRef.current = 'play';
        audioElement.pause();
        audioElement.currentTime = 0;
        setCurrentTime(0);
        setPlaybackState(PLAYBACK_STATES.IDLE);
        setPlaybackError(false);
    };

    useEffect(() => {
        resetPlaybackState();
        setDuration(0);
    }, [src]);

    useEffect(() => {
        if (!hasMountedStopSignalRef.current) {
            hasMountedStopSignalRef.current = true;
            return;
        }

        stopPlayback();
    }, [stopPlayback, stopSignal]);

    useEffect(() => {
        if (pendingFocusRef.current === 'stop') {
            stopButtonRef.current?.focus();
        } else if (pendingFocusRef.current === 'play') {
            playButtonRef.current?.focus();
        }

        pendingFocusRef.current = null;
    }, [playbackState]);

    useEffect(() => {
        return () => {
            stopPlayback();
        };
    }, [stopPlayback]);

    return (
        <Box
            className={className}
            role="group"
            aria-label={title}
            sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 4,
                bgcolor: 'background.paper',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.08)',
                overflow: 'hidden',
            }}
        >
            <audio
                ref={audioRef}
                preload="metadata"
                src={src}
                onLoadedMetadata={event => {
                    setDuration(event.currentTarget.duration || 0);
                    setCurrentTime(event.currentTarget.currentTime || 0);
                }}
                onTimeUpdate={event => {
                    setCurrentTime(event.currentTarget.currentTime || 0);
                }}
                onPlay={() => {
                    setPlaybackState(PLAYBACK_STATES.PLAYING);
                }}
                onPause={() => {
                    setPlaybackState(currentState =>
                        currentState === PLAYBACK_STATES.PLAYING ? PLAYBACK_STATES.STOPPED : currentState,
                    );
                }}
                onEnded={() => {
                    resetPlaybackState();
                }}
                onError={() => {
                    setPlaybackState(PLAYBACK_STATES.IDLE);
                    setPlaybackError(true);
                }}
            />
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'auto minmax(0, 1fr) auto',
                    alignItems: 'center',
                    columnGap: 1,
                    px: 1,
                }}
            >
                <Box
                    aria-hidden="true"
                    sx={{
                        display: 'grid',
                        placeItems: 'center',
                        color: 'primary.main',
                    }}
                >
                    <HeadphonesOutlinedIcon fontSize="large" />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle2" component="p" sx={{ color: 'text.primary' }}>
                        {title}
                    </Typography>
                    {description ? (
                        <Typography id={descriptionId} variant="body2" sx={{ color: 'text.secondary' }}>
                            {description}
                        </Typography>
                    ) : null}
                    <Typography id={timeId} variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                        {progressValueText}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(2, ${CONTROL_BUTTON_SIZE_PX}px)`,
                        alignItems: 'center',
                        justifyItems: 'center',
                        columnGap: 0.25,
                    }}
                >
                    <IconButton
                        aria-label={`Replay ${title}`}
                        onClick={handleReplay}
                        disabled={!canReplay}
                        color="primary"
                        size="large"
                    >
                        <ReplayRoundedIcon fontSize="large" />
                    </IconButton>
                    {isPlaying ? (
                        <IconButton
                            ref={stopButtonRef}
                            aria-label={`Stop ${title}`}
                            onClick={() => stopPlayback({ resetToStart: false, nextState: PLAYBACK_STATES.STOPPED })}
                            color="primary"
                            size="large"
                        >
                            <StopCircleOutlinedIcon fontSize="large" />
                        </IconButton>
                    ) : (
                        <IconButton
                            ref={playButtonRef}
                            aria-label={`Play ${title}`}
                            onClick={() => startPlayback()}
                            color="primary"
                            size="large"
                        >
                            <PlayCircleOutlineRoundedIcon fontSize="large" />
                        </IconButton>
                    )}
                </Box>
            </Box>
            <LinearProgress
                variant="determinate"
                value={progressValue}
                aria-label={`${title} progress`}
                aria-describedby={[description ? descriptionId : null, timeId].filter(Boolean).join(' ')}
                aria-valuetext={progressValueText}
                sx={{
                    height: 3,
                    borderRadius: 0,
                    bgcolor: 'rgba(103, 58, 183, 0.16)',
                    '& .MuiLinearProgress-bar': {
                        bgcolor: 'primary.main',
                    },
                }}
            />
            {playbackError ? (
                <Typography variant="body2" sx={{ px: 1.5, py: 1, color: 'error.main' }}>
                    Audio could not be played.
                </Typography>
            ) : null}
        </Box>
    );
};

TrailAudioPlayer.propTypes = {
    className: PropTypes.string,
    description: PropTypes.string,
    src: PropTypes.string.isRequired,
    stopSignal: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    title: PropTypes.string.isRequired,
};

export default TrailAudioPlayer;

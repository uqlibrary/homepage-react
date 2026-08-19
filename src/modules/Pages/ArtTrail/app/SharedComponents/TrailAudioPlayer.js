import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import HeadphonesOutlinedIcon from '@mui/icons-material/HeadphonesOutlined';
import PauseCircleOutlineRoundedIcon from '@mui/icons-material/PauseCircleOutlineRounded';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';

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
    const hasMountedStopSignalRef = useRef(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasPlaybackStarted, setHasPlaybackStarted] = useState(false);
    const [playbackError, setPlaybackError] = useState(false);
    const descriptionId = useId();
    const timeId = useId();
    const progressValue = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;
    const progressValueText = useMemo(() => {
        if (!duration) {
            return 'Not started';
        }

        return `${formatTime(currentTime)} of ${formatTime(duration)}`;
    }, [currentTime, duration]);

    const resetPlaybackState = () => {
        setCurrentTime(0);
        setIsPlaying(false);
        setPlaybackError(false);
    };

    const stopPlayback = ({ resetToStart = true } = {}) => {
        const audioElement = audioRef.current;

        if (!audioElement) {
            resetPlaybackState();
            return;
        }

        audioElement.pause();

        if (resetToStart) {
            audioElement.currentTime = 0;
        }

        resetPlaybackState();
    };

    const handlePlayPause = async () => {
        const audioElement = audioRef.current;

        if (!audioElement) {
            return;
        }

        if (isPlaying) {
            audioElement.pause();
            setIsPlaying(false);
            return;
        }

        try {
            await audioElement.play();
            setHasPlaybackStarted(true);
            setIsPlaying(true);
            setPlaybackError(false);
        } catch {
            setIsPlaying(false);
            setPlaybackError(true);
        }
    };

    const handleReplay = async () => {
        const audioElement = audioRef.current;

        if (!audioElement) {
            return;
        }

        audioElement.currentTime = 0;
        setCurrentTime(0);

        try {
            await audioElement.play();
            setHasPlaybackStarted(true);
            setIsPlaying(true);
            setPlaybackError(false);
        } catch {
            setIsPlaying(false);
            setPlaybackError(true);
        }
    };

    useEffect(() => {
        resetPlaybackState();
        setDuration(0);
        setHasPlaybackStarted(false);
    }, [src]);

    useEffect(() => {
        if (!hasMountedStopSignalRef.current) {
            hasMountedStopSignalRef.current = true;
            return;
        }

        stopPlayback();
    }, [stopSignal]);

    useEffect(() => {
        return () => {
            stopPlayback();
        };
    }, []);

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
                    setIsPlaying(true);
                    setHasPlaybackStarted(true);
                }}
                onPause={() => {
                    setIsPlaying(false);
                }}
                onEnded={() => {
                    setCurrentTime(0);
                    setIsPlaying(false);
                }}
                onError={() => {
                    setIsPlaying(false);
                    setPlaybackError(true);
                }}
            />
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'auto minmax(0, 1fr) auto',
                    alignItems: 'center',
                    columnGap: 1,
                    px: 1.5,
                    py: 1,
                }}
            >
                <Box
                    aria-hidden="true"
                    sx={{
                        display: 'grid',
                        placeItems: 'center',
                        color: isPlaying ? 'primary.main' : 'text.secondary',
                    }}
                >
                    <HeadphonesOutlinedIcon />
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
                <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 0.25 }}>
                    {hasPlaybackStarted && !isPlaying ? (
                        <IconButton aria-label={`Replay ${title}`} onClick={handleReplay} color="primary" size="large">
                            <ReplayRoundedIcon fontSize="large" />
                        </IconButton>
                    ) : null}
                    {isPlaying ? (
                        <IconButton
                            aria-label={`Pause ${title}`}
                            onClick={handlePlayPause}
                            color="primary"
                            size="large"
                        >
                            <PauseCircleOutlineRoundedIcon fontSize="large" />
                        </IconButton>
                    ) : (
                        <IconButton aria-label={`Play ${title}`} onClick={handlePlayPause} color="primary" size="large">
                            <PlayCircleOutlineRoundedIcon fontSize="large" />
                        </IconButton>
                    )}
                    {(isPlaying || currentTime > 0) && !playbackError ? (
                        <IconButton
                            aria-label={`Stop ${title}`}
                            onClick={() => stopPlayback()}
                            color="primary"
                            size="large"
                        >
                            <StopCircleOutlinedIcon fontSize="large" />
                        </IconButton>
                    ) : null}
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

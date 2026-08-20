import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TrailAudioPlayer from './TrailAudioPlayer';

describe('TrailAudioPlayer', () => {
    const originalPlay = window.HTMLMediaElement.prototype.play;
    const originalPause = window.HTMLMediaElement.prototype.pause;

    beforeEach(() => {
        window.HTMLMediaElement.prototype.play = jest.fn().mockResolvedValue();
        window.HTMLMediaElement.prototype.pause = jest.fn();
    });

    afterEach(() => {
        window.HTMLMediaElement.prototype.play = originalPlay;
        window.HTMLMediaElement.prototype.pause = originalPause;
    });

    it('shows play initially, then only stop while playing, and resets after ending', async () => {
        const user = userEvent.setup();

        const { container } = render(
            <TrailAudioPlayer src="https://example.com/audio.mp3" title="Listen to this page" description="Intro" />,
        );

        const audioElement = container.querySelector('audio');

        Object.defineProperty(audioElement, 'duration', {
            configurable: true,
            value: 42,
        });
        Object.defineProperty(audioElement, 'currentTime', {
            configurable: true,
            writable: true,
            value: 0,
        });

        fireEvent.loadedMetadata(audioElement);

        expect(screen.getByRole('button', { name: 'Play Listen to this page' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Replay Listen to this page' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Stop Listen to this page' })).not.toBeInTheDocument();
        expect(screen.getByRole('progressbar', { name: 'Listen to this page progress' })).toHaveAttribute(
            'aria-valuetext',
            '0:00 of 0:42',
        );

        await user.click(screen.getByRole('button', { name: 'Play Listen to this page' }));

        fireEvent.play(audioElement);
        audioElement.currentTime = 12;
        fireEvent.timeUpdate(audioElement);

        expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
        expect(screen.queryByRole('button', { name: 'Play Listen to this page' })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Stop Listen to this page' })).toBeInTheDocument();
        expect(screen.getByRole('progressbar', { name: 'Listen to this page progress' })).toHaveAttribute(
            'aria-valuetext',
            '0:12 of 0:42',
        );

        fireEvent.ended(audioElement);

        expect(screen.getByRole('button', { name: 'Play Listen to this page' })).toBeEnabled();
        expect(screen.queryByRole('button', { name: 'Replay Listen to this page' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Stop Listen to this page' })).not.toBeInTheDocument();
    });

    it('resets to the start without resuming playback when replay is pressed', async () => {
        const user = userEvent.setup();

        const { container } = render(
            <TrailAudioPlayer src="https://example.com/audio.mp3" title="Listen to this page" />,
        );

        const audioElement = container.querySelector('audio');

        Object.defineProperty(audioElement, 'currentTime', {
            configurable: true,
            writable: true,
            value: 0,
        });

        await user.click(screen.getByRole('button', { name: 'Play Listen to this page' }));

        fireEvent.play(audioElement);
        audioElement.currentTime = 9;
        fireEvent.timeUpdate(audioElement);

        await user.click(screen.getByRole('button', { name: 'Stop Listen to this page' }));

        expect(window.HTMLMediaElement.prototype.pause).toHaveBeenCalled();
        expect(audioElement.currentTime).toBe(9);
        expect(screen.getByRole('button', { name: 'Play Listen to this page' })).toBeEnabled();
        expect(screen.getByRole('button', { name: 'Replay Listen to this page' })).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Replay Listen to this page' }));

        expect(audioElement.currentTime).toBe(0);
        expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
        expect(screen.getByRole('button', { name: 'Play Listen to this page' })).toBeEnabled();
        expect(screen.queryByRole('button', { name: 'Replay Listen to this page' })).not.toBeInTheDocument();
    });

    it('stops and resets when the stop signal changes', async () => {
        const user = userEvent.setup();

        const { container, rerender } = render(
            <TrailAudioPlayer src="https://example.com/audio.mp3" title="Listen to this page" stopSignal="trail:0" />,
        );

        const audioElement = container.querySelector('audio');

        Object.defineProperty(audioElement, 'currentTime', {
            configurable: true,
            writable: true,
            value: 0,
        });

        await user.click(screen.getByRole('button', { name: 'Play Listen to this page' }));

        fireEvent.play(audioElement);
        audioElement.currentTime = 9;
        fireEvent.timeUpdate(audioElement);

        rerender(
            <TrailAudioPlayer src="https://example.com/audio.mp3" title="Listen to this page" stopSignal="map:0" />,
        );

        expect(window.HTMLMediaElement.prototype.pause).toHaveBeenCalled();
        expect(audioElement.currentTime).toBe(0);
        expect(screen.getByRole('button', { name: 'Play Listen to this page' })).toBeEnabled();
        expect(screen.queryByRole('button', { name: 'Replay Listen to this page' })).not.toBeInTheDocument();
    });
});

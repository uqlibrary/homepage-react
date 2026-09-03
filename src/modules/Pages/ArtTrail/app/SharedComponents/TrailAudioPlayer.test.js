import React, { useRef } from 'react';
import { fireEvent, rtlRender, userEvent, waitFor } from 'test-utils';

import TrailAudioPlayer from './TrailAudioPlayer';

jest.mock('react', () => {
    const actualReact = jest.requireActual('react');

    return {
        ...actualReact,
        useRef: jest.fn(actualReact.useRef),
    };
});

const originalUseRef = jest.requireActual('react').useRef;

const setup = (props = {}) =>
    rtlRender(<TrailAudioPlayer src="https://example.com/audio.mp3" title="Listen to this page" {...props} />);

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
        useRef.mockImplementation(originalUseRef);
    });

    it('shows play initially, then only stop while playing, and resets after ending', async () => {
        const { container, getByRole, getByTestId, getByText, queryByRole } = setup({ description: 'Intro' });

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

        expect(getByRole('button', { name: 'Play audio' })).toBeInTheDocument();
        expect(getByRole('button', { name: 'Reset audio playback' })).toBeDisabled();
        expect(queryByRole('button', { name: 'Stop audio playback' })).not.toBeInTheDocument();
        expect(queryByRole('progressbar')).not.toBeInTheDocument();
        expect(getByTestId('audio-progress')).toHaveAttribute('aria-hidden', 'true');
        expect(getByText('0:00 of 0:42')).toHaveAttribute('aria-hidden', 'true');
        expect(getByText('0 minutes 0 seconds of 0 minutes 42 seconds')).toBeInTheDocument();

        await userEvent.click(getByRole('button', { name: 'Play audio' }));

        fireEvent.play(audioElement);
        audioElement.currentTime = 12;
        fireEvent.timeUpdate(audioElement);

        expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
        expect(queryByRole('button', { name: 'Play audio' })).not.toBeInTheDocument();
        expect(getByRole('button', { name: 'Stop audio playback' })).toBeInTheDocument();
        await waitFor(() => expect(getByRole('button', { name: 'Stop audio playback' })).toHaveFocus());
        expect(getByRole('button', { name: 'Reset audio playback' })).toBeDisabled();
        expect(getByText('0:12 of 0:42')).toHaveAttribute('aria-hidden', 'true');
        expect(getByText('0 minutes 12 seconds of 0 minutes 42 seconds')).toBeInTheDocument();

        fireEvent.ended(audioElement);

        expect(getByRole('button', { name: 'Play audio' })).toBeEnabled();
        expect(getByRole('button', { name: 'Reset audio playback' })).toBeDisabled();
        expect(queryByRole('button', { name: 'Stop audio playback' })).not.toBeInTheDocument();
    });

    it('resets to the start without resuming playback when replay is pressed', async () => {
        const { container, getByRole } = setup();

        const audioElement = container.querySelector('audio');

        Object.defineProperty(audioElement, 'currentTime', {
            configurable: true,
            writable: true,
            value: 0,
        });

        await userEvent.click(getByRole('button', { name: 'Play audio' }));

        fireEvent.play(audioElement);
        audioElement.currentTime = 9;
        fireEvent.timeUpdate(audioElement);

        await userEvent.click(getByRole('button', { name: 'Stop audio playback' }));

        expect(window.HTMLMediaElement.prototype.pause).toHaveBeenCalled();
        expect(audioElement.currentTime).toBe(9);
        expect(getByRole('button', { name: 'Play audio' })).toBeEnabled();
        expect(getByRole('button', { name: 'Reset audio playback' })).toBeEnabled();

        await userEvent.click(getByRole('button', { name: 'Reset audio playback' }));

        expect(audioElement.currentTime).toBe(0);
        expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
        expect(getByRole('button', { name: 'Play audio' })).toBeEnabled();
        await waitFor(() => expect(getByRole('button', { name: 'Play audio' })).toHaveFocus());
        expect(getByRole('button', { name: 'Reset audio playback' })).toBeDisabled();
    });

    it('calls playback callbacks for their corresponding media actions', async () => {
        const onPlay = jest.fn();
        const onStop = jest.fn();
        const onReset = jest.fn();
        const onComplete = jest.fn();
        const { container, getByRole } = setup({ onPlay, onStop, onReset, onComplete });
        const audioElement = container.querySelector('audio');

        Object.defineProperty(audioElement, 'currentTime', {
            configurable: true,
            writable: true,
            value: 0,
        });

        fireEvent.play(audioElement);
        expect(onPlay).toHaveBeenCalledTimes(1);

        audioElement.currentTime = 9;
        fireEvent.timeUpdate(audioElement);
        await userEvent.click(getByRole('button', { name: 'Stop audio playback' }));
        expect(onStop).toHaveBeenCalledTimes(1);

        await userEvent.click(getByRole('button', { name: 'Reset audio playback' }));
        expect(onReset).toHaveBeenCalledTimes(1);
        expect(onStop).toHaveBeenCalledTimes(1);

        fireEvent.ended(audioElement);
        expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it('uses singular minute and second units in the spoken progress text', () => {
        const { container, getByText } = setup();
        const audioElement = container.querySelector('audio');

        Object.defineProperty(audioElement, 'duration', {
            configurable: true,
            value: 61,
        });
        Object.defineProperty(audioElement, 'currentTime', {
            configurable: true,
            value: 1,
        });

        fireEvent.loadedMetadata(audioElement);

        expect(getByText('0 minutes 1 second of 1 minute 1 second')).toBeInTheDocument();
    });

    it('stops and resets when the stop signal changes', async () => {
        const { container, getByRole, rerender } = setup({ stopSignal: 'trail:0' });

        const audioElement = container.querySelector('audio');

        Object.defineProperty(audioElement, 'currentTime', {
            configurable: true,
            writable: true,
            value: 0,
        });

        await userEvent.click(getByRole('button', { name: 'Play audio' }));

        fireEvent.play(audioElement);
        audioElement.currentTime = 9;
        fireEvent.timeUpdate(audioElement);

        rerender(
            <TrailAudioPlayer src="https://example.com/audio.mp3" title="Listen to this page" stopSignal="map:0" />,
        );

        expect(window.HTMLMediaElement.prototype.pause).toHaveBeenCalled();
        expect(audioElement.currentTime).toBe(0);
        expect(getByRole('button', { name: 'Play audio' })).toBeEnabled();
        expect(getByRole('button', { name: 'Reset audio playback' })).toBeDisabled();
    });

    it('shows an error when playback is rejected or the audio element reports an error', async () => {
        window.HTMLMediaElement.prototype.play.mockRejectedValueOnce(new Error('Playback rejected'));

        const { container, findByText, getByRole, queryByText } = setup();
        const audioElement = container.querySelector('audio');

        await userEvent.click(getByRole('button', { name: 'Play audio' }));

        expect(await findByText('Audio could not be played.')).toBeInTheDocument();
        expect(getByRole('button', { name: 'Play audio' })).toBeEnabled();

        window.HTMLMediaElement.prototype.play.mockResolvedValueOnce();
        await userEvent.click(getByRole('button', { name: 'Play audio' }));

        expect(queryByText('Audio could not be played.')).not.toBeInTheDocument();

        fireEvent.error(audioElement);

        expect(getByRole('button', { name: 'Play audio' })).toBeEnabled();
        expect(await findByText('Audio could not be played.')).toBeInTheDocument();
    });

    it('handles media value fallbacks, pause transitions, and source resets', () => {
        const { container, getByRole, getByTestId, getByText, rerender } = setup();
        const audioElement = container.querySelector('audio');

        Object.defineProperty(audioElement, 'duration', {
            configurable: true,
            value: Number.NaN,
        });
        Object.defineProperty(audioElement, 'currentTime', {
            configurable: true,
            writable: true,
            value: 7,
        });

        fireEvent.loadedMetadata(audioElement);

        expect(getByText('Not started', { selector: '[id]' })).toBeInTheDocument();

        Object.defineProperty(audioElement, 'duration', {
            configurable: true,
            value: 10,
        });
        audioElement.currentTime = 20;
        fireEvent.loadedMetadata(audioElement);

        expect(getByTestId('audio-progress')).toHaveAttribute('aria-valuenow', '100');

        audioElement.currentTime = 0;
        fireEvent.timeUpdate(audioElement);
        fireEvent.pause(audioElement);

        expect(getByRole('button', { name: 'Reset audio playback' })).toBeDisabled();

        fireEvent.play(audioElement);
        fireEvent.pause(audioElement);

        expect(getByRole('button', { name: 'Reset audio playback' })).toBeDisabled();

        rerender(<TrailAudioPlayer src="https://example.com/replacement.mp3" title="Listen to this page" />);

        expect(getByText('Not started', { selector: '[id]' })).toBeInTheDocument();
        expect(getByRole('button', { name: 'Reset audio playback' })).toBeDisabled();
    });

    it('handles controls safely when the audio ref is unavailable', async () => {
        useRef
            .mockImplementationOnce(initialValue => {
                const unavailableAudioRef = originalUseRef(initialValue);
                Object.defineProperty(unavailableAudioRef, 'current', {
                    configurable: true,
                    get: () => null,
                    set: () => {},
                });
                return unavailableAudioRef;
            })
            .mockImplementation(originalUseRef);

        const { container, getByRole } = setup();
        const audioElement = container.querySelector('audio');

        await userEvent.click(getByRole('button', { name: 'Play audio' }));
        expect(window.HTMLMediaElement.prototype.play).not.toHaveBeenCalled();

        fireEvent.play(audioElement);
        Object.defineProperty(audioElement, 'currentTime', {
            configurable: true,
            writable: true,
            value: 3,
        });
        fireEvent.timeUpdate(audioElement);
        await userEvent.click(getByRole('button', { name: 'Stop audio playback' }));
        expect(getByRole('button', { name: 'Reset audio playback' })).toBeEnabled();

        await userEvent.click(getByRole('button', { name: 'Reset audio playback' }));
        expect(getByRole('button', { name: 'Reset audio playback' })).toBeInTheDocument();
    });
});

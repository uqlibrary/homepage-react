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
        const { container, getByRole, queryByRole } = setup({ description: 'Intro' });

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

        expect(getByRole('button', { name: 'Play Listen to this page' })).toBeInTheDocument();
        expect(getByRole('button', { name: 'Replay Listen to this page' })).toBeDisabled();
        expect(queryByRole('button', { name: 'Stop Listen to this page' })).not.toBeInTheDocument();
        expect(getByRole('progressbar', { name: 'Listen to this page progress' })).toHaveAttribute(
            'aria-valuetext',
            '0:00 of 0:42',
        );

        await userEvent.click(getByRole('button', { name: 'Play Listen to this page' }));

        fireEvent.play(audioElement);
        audioElement.currentTime = 12;
        fireEvent.timeUpdate(audioElement);

        expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
        expect(queryByRole('button', { name: 'Play Listen to this page' })).not.toBeInTheDocument();
        expect(getByRole('button', { name: 'Stop Listen to this page' })).toBeInTheDocument();
        await waitFor(() => expect(getByRole('button', { name: 'Stop Listen to this page' })).toHaveFocus());
        expect(getByRole('button', { name: 'Replay Listen to this page' })).toBeDisabled();
        expect(getByRole('progressbar', { name: 'Listen to this page progress' })).toHaveAttribute(
            'aria-valuetext',
            '0:12 of 0:42',
        );

        fireEvent.ended(audioElement);

        expect(getByRole('button', { name: 'Play Listen to this page' })).toBeEnabled();
        expect(getByRole('button', { name: 'Replay Listen to this page' })).toBeDisabled();
        expect(queryByRole('button', { name: 'Stop Listen to this page' })).not.toBeInTheDocument();
    });

    it('resets to the start without resuming playback when replay is pressed', async () => {
        const { container, getByRole } = setup();

        const audioElement = container.querySelector('audio');

        Object.defineProperty(audioElement, 'currentTime', {
            configurable: true,
            writable: true,
            value: 0,
        });

        await userEvent.click(getByRole('button', { name: 'Play Listen to this page' }));

        fireEvent.play(audioElement);
        audioElement.currentTime = 9;
        fireEvent.timeUpdate(audioElement);

        await userEvent.click(getByRole('button', { name: 'Stop Listen to this page' }));

        expect(window.HTMLMediaElement.prototype.pause).toHaveBeenCalled();
        expect(audioElement.currentTime).toBe(9);
        expect(getByRole('button', { name: 'Play Listen to this page' })).toBeEnabled();
        expect(getByRole('button', { name: 'Replay Listen to this page' })).toBeEnabled();

        await userEvent.click(getByRole('button', { name: 'Replay Listen to this page' }));

        expect(audioElement.currentTime).toBe(0);
        expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
        expect(getByRole('button', { name: 'Play Listen to this page' })).toBeEnabled();
        await waitFor(() => expect(getByRole('button', { name: 'Play Listen to this page' })).toHaveFocus());
        expect(getByRole('button', { name: 'Replay Listen to this page' })).toBeDisabled();
    });

    it('stops and resets when the stop signal changes', async () => {
        const { container, getByRole, rerender } = setup({ stopSignal: 'trail:0' });

        const audioElement = container.querySelector('audio');

        Object.defineProperty(audioElement, 'currentTime', {
            configurable: true,
            writable: true,
            value: 0,
        });

        await userEvent.click(getByRole('button', { name: 'Play Listen to this page' }));

        fireEvent.play(audioElement);
        audioElement.currentTime = 9;
        fireEvent.timeUpdate(audioElement);

        rerender(
            <TrailAudioPlayer src="https://example.com/audio.mp3" title="Listen to this page" stopSignal="map:0" />,
        );

        expect(window.HTMLMediaElement.prototype.pause).toHaveBeenCalled();
        expect(audioElement.currentTime).toBe(0);
        expect(getByRole('button', { name: 'Play Listen to this page' })).toBeEnabled();
        expect(getByRole('button', { name: 'Replay Listen to this page' })).toBeDisabled();
    });

    it('shows an error when playback is rejected or the audio element reports an error', async () => {
        window.HTMLMediaElement.prototype.play.mockRejectedValueOnce(new Error('Playback rejected'));

        const { container, findByText, getByRole, queryByText } = setup();
        const audioElement = container.querySelector('audio');

        await userEvent.click(getByRole('button', { name: 'Play Listen to this page' }));

        expect(await findByText('Audio could not be played.')).toBeInTheDocument();
        expect(getByRole('button', { name: 'Play Listen to this page' })).toBeEnabled();

        window.HTMLMediaElement.prototype.play.mockResolvedValueOnce();
        await userEvent.click(getByRole('button', { name: 'Play Listen to this page' }));

        expect(queryByText('Audio could not be played.')).not.toBeInTheDocument();

        fireEvent.error(audioElement);

        expect(getByRole('button', { name: 'Play Listen to this page' })).toBeEnabled();
        expect(await findByText('Audio could not be played.')).toBeInTheDocument();
    });

    it('handles media value fallbacks, pause transitions, and source resets', () => {
        const { container, getByRole, rerender } = setup();
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

        expect(getByRole('progressbar', { name: 'Listen to this page progress' })).toHaveAttribute(
            'aria-valuetext',
            'Not started',
        );

        Object.defineProperty(audioElement, 'duration', {
            configurable: true,
            value: 10,
        });
        audioElement.currentTime = 20;
        fireEvent.loadedMetadata(audioElement);

        expect(getByRole('progressbar', { name: 'Listen to this page progress' })).toHaveAttribute(
            'aria-valuenow',
            '100',
        );

        audioElement.currentTime = 0;
        fireEvent.timeUpdate(audioElement);
        fireEvent.pause(audioElement);

        expect(getByRole('button', { name: 'Replay Listen to this page' })).toBeDisabled();

        fireEvent.play(audioElement);
        fireEvent.pause(audioElement);

        expect(getByRole('button', { name: 'Replay Listen to this page' })).toBeDisabled();

        rerender(<TrailAudioPlayer src="https://example.com/replacement.mp3" title="Listen to this page" />);

        expect(getByRole('progressbar', { name: 'Listen to this page progress' })).toHaveAttribute(
            'aria-valuetext',
            'Not started',
        );
        expect(getByRole('button', { name: 'Replay Listen to this page' })).toBeDisabled();
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

        await userEvent.click(getByRole('button', { name: 'Play Listen to this page' }));
        expect(window.HTMLMediaElement.prototype.play).not.toHaveBeenCalled();

        fireEvent.play(audioElement);
        Object.defineProperty(audioElement, 'currentTime', {
            configurable: true,
            writable: true,
            value: 3,
        });
        fireEvent.timeUpdate(audioElement);
        await userEvent.click(getByRole('button', { name: 'Stop Listen to this page' }));
        expect(getByRole('button', { name: 'Replay Listen to this page' })).toBeEnabled();

        await userEvent.click(getByRole('button', { name: 'Replay Listen to this page' }));
        expect(getByRole('button', { name: 'Replay Listen to this page' })).toBeInTheDocument();
    });
});

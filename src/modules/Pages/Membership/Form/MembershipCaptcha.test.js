import React from 'react';
import { render, screen, act } from '@testing-library/react';

import locale from '../membership.locale';
import { MembershipCaptcha, getMembershipCaptchaToken } from './MembershipCaptcha';

const { captcha } = locale.form;

// The integration URL is empty in the test build, so the script the component adds resolves to this src.
const SCRIPT_SELECTOR = 'script[src="/jsapi.js"]';

const lastRenderConfig = () => window.AwsWafCaptcha.renderCaptcha.mock.calls.slice(-1)[0][1];

describe('MembershipCaptcha', () => {
    afterEach(() => {
        delete window.AwsWafCaptcha;
        delete window.AwsWafIntegration;
        document.querySelectorAll(SCRIPT_SELECTOR).forEach(script => script.remove());
    });

    describe('when the integration script is already loaded', () => {
        beforeEach(() => {
            window.AwsWafCaptcha = { renderCaptcha: jest.fn() };
        });

        it('renders the puzzle straight away without adding the script again', () => {
            render(<MembershipCaptcha onSolved={jest.fn()} />);

            expect(document.querySelector(SCRIPT_SELECTOR)).toBeNull();
            expect(window.AwsWafCaptcha.renderCaptcha).toHaveBeenCalledTimes(1);
            expect(window.AwsWafCaptcha.renderCaptcha.mock.calls[0][0]).toBe(
                screen.getByTestId('membership-captcha-container'),
            );
            expect(lastRenderConfig()).toEqual(expect.objectContaining({ dynamicWidth: true }));
            expect(screen.getByTestId('membership-captcha')).toHaveTextContent(captcha.instruction);
            expect(screen.queryByTestId('membership-captcha-error')).not.toBeInTheDocument();
        });

        it('tells the form when the puzzle is solved', () => {
            const onSolved = jest.fn();
            render(<MembershipCaptcha onSolved={onSolved} />);

            act(() => lastRenderConfig().onSuccess('a-token'));

            expect(onSolved).toHaveBeenCalledTimes(1);
            expect(screen.queryByTestId('membership-captcha-error')).not.toBeInTheDocument();
        });

        it('shows an error when the puzzle reports one', () => {
            render(<MembershipCaptcha onSolved={jest.fn()} />);

            act(() => lastRenderConfig().onError({ kind: 'network_error' }));

            expect(screen.getByTestId('membership-captcha-error')).toHaveTextContent(captcha.error);
        });
    });

    describe('when the integration script has not loaded yet', () => {
        it('adds the script and renders once it loads, then removes it on unmount', () => {
            const { unmount } = render(<MembershipCaptcha onSolved={jest.fn()} />);

            const script = document.querySelector(SCRIPT_SELECTOR);
            expect(script).not.toBeNull();

            window.AwsWafCaptcha = { renderCaptcha: jest.fn() };
            act(() => script.onload());
            expect(window.AwsWafCaptcha.renderCaptcha).toHaveBeenCalledTimes(1);

            unmount();
            expect(document.querySelector(SCRIPT_SELECTOR)).toBeNull();
        });

        it('shows an error when the script fails to load', () => {
            render(<MembershipCaptcha onSolved={jest.fn()} />);

            act(() => document.querySelector(SCRIPT_SELECTOR).onerror());

            expect(screen.getByTestId('membership-captcha-error')).toHaveTextContent(captcha.error);
        });
    });

    describe('getMembershipCaptchaToken', () => {
        it('reads the current token from the integration when it is present', async () => {
            window.AwsWafIntegration = { getToken: jest.fn().mockResolvedValue('fresh-token') };

            await expect(getMembershipCaptchaToken()).resolves.toBe('fresh-token');
        });

        it('resolves undefined when the integration has not loaded', async () => {
            await expect(getMembershipCaptchaToken()).resolves.toBeUndefined();
        });
    });
});

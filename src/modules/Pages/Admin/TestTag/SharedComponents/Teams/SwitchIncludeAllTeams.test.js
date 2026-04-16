import React from 'react';
import { rtlRender, userEvent } from 'test-utils';

import SwitchIncludeAllTeams from './SwitchIncludeAllTeams';

const mockSetCookie = jest.fn();
let mockCookies = {};
jest.mock('react-cookie', () => ({
    useCookies: jest.fn(() => [mockCookies, mockSetCookie]),
}));

const defaultLocale = { includeAllTeams: 'All team assets' };

function setup(testProps = {}, renderer = rtlRender) {
    const props = {
        locale: defaultLocale,
        onChange: jest.fn(),
        ...testProps,
    };
    return renderer(<SwitchIncludeAllTeams {...props} />);
}

describe('SwitchIncludeAllTeams', () => {
    beforeEach(() => {
        mockCookies = {};
        mockSetCookie.mockClear();
    });

    it('renders the switch with the correct label', () => {
        const { getByText, getByRole } = setup();
        expect(getByText('All team assets')).toBeInTheDocument();
        expect(getByRole('checkbox')).toBeInTheDocument();
    });

    it('fires onChange on mount when fireOnChangeOnMount is true (default)', () => {
        const onChange = jest.fn();
        setup({ onChange });
        expect(onChange).toHaveBeenCalledWith(false);
    });

    it('does not fire onChange on mount when fireOnChangeOnMount is false', () => {
        const onChange = jest.fn();
        setup({ onChange, fireOnChangeOnMount: false });
        expect(onChange).not.toHaveBeenCalled();
    });

    it('initialises checked from cookie value when withCookie is true', () => {
        mockCookies.TNT_ALL_TEAMS = true;
        const onChange = jest.fn();
        const { getByRole } = setup({ onChange });
        expect(getByRole('checkbox')).toBeChecked();
        expect(onChange).toHaveBeenCalledWith(true);
    });

    it('initialises unchecked when cookie is absent and withCookie is true', () => {
        const { getByRole } = setup();
        expect(getByRole('checkbox')).not.toBeChecked();
    });

    it('initialises from defaultValue when withCookie is false', () => {
        const onChange = jest.fn();
        const { getByRole } = setup({ onChange, withCookie: false, defaultValue: true });
        expect(getByRole('checkbox')).toBeChecked();
        expect(onChange).toHaveBeenCalledWith(true);
    });

    it('initialises unchecked when withCookie is false and defaultValue is false', () => {
        const { getByRole } = setup({ withCookie: false, defaultValue: false });
        expect(getByRole('checkbox')).not.toBeChecked();
    });

    it('toggles the switch and calls onChange and setCookie on click', async () => {
        const onChange = jest.fn();
        const { getByRole } = setup({ onChange });
        const checkbox = getByRole('checkbox');

        // Initially unchecked, toggle on
        await userEvent.click(checkbox);
        expect(checkbox).toBeChecked();
        expect(mockSetCookie).toHaveBeenCalledWith('TNT_ALL_TEAMS', true, { path: '/' });
        expect(onChange).toHaveBeenCalledWith(true);
    });

    it('does not set cookie when withCookie is false and switch is toggled', async () => {
        const onChange = jest.fn();
        const { getByRole } = setup({ onChange, withCookie: false, fireOnChangeOnMount: false });
        const checkbox = getByRole('checkbox');

        await userEvent.click(checkbox);
        expect(checkbox).toBeChecked();
        expect(mockSetCookie).not.toHaveBeenCalled();
        expect(onChange).toHaveBeenCalledWith(true);
    });

    it('uses a custom cookieName when provided', async () => {
        mockCookies.MY_COOKIE = true;
        const { getByRole } = setup({ cookieName: 'MY_COOKIE' });
        expect(getByRole('checkbox')).toBeChecked();

        await userEvent.click(getByRole('checkbox'));
        expect(mockSetCookie).toHaveBeenCalledWith('MY_COOKIE', false, { path: '/' });
    });

    it('works without onChange callback provided', () => {
        expect(() => {
            rtlRender(<SwitchIncludeAllTeams locale={defaultLocale} />);
        }).not.toThrow();
    });
});

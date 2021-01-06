import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { default as locale } from '../footer.locale.js';
import { ConnectFooter } from './ConnectFooter';

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

function setup(testProps = {}) {
    const history = {
        push: jest.fn(),
        go: jest.fn(),
        location: { pathname: '/' },
    };
    const props = {
        ...testProps,
        classes: {},
        history: testProps.history || history,
    };
    return getElement(ConnectFooter, props);
}

describe('Component Megamenu', () => {
    it('should render', () => {
        const wrapper = setup();
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    test('user can visit giving links', () => {
        render(<ConnectFooter history={history} />);

        const givingButton = [...locale.connectFooter.givingLinks].splice(0, 1).reduce(output => output);

        const screenButton = screen.getByText(givingButton.label);

        // from https://www.benmvp.com/blog/mocking-window-location-methods-jest-jsdom/
        const oldWindowLocation = window.location;
        delete window.location;

        window.location = Object.defineProperties(
            {},
            {
                ...Object.getOwnPropertyDescriptors(oldWindowLocation),
                assign: {
                    configurable: true,
                    value: jest.fn(),
                },
            },
        );
        window.location.assign.mockReset();

        userEvent.click(screenButton);

        expect(window.location.assign).toHaveBeenCalledTimes(1);
        expect(window.location.assign).toHaveBeenCalledWith(givingButton.linkTo);

        // restore `window.location` to the `jsdom` `Location` object
        window.location = oldWindowLocation;
    });

    test('user can visit social media links', () => {
        render(<ConnectFooter history={history} />);

        const socialButton = [...locale.connectFooter.buttonSocial].splice(0, 1).reduce(output => output);

        // const screenButton = getByTestId(socialButton.dataTestid);
        const screenButton = screen.getByTestId(socialButton.dataTestid);
        // const screenButton = screen.getByTitle(socialButton.linkMouseOver);

        const oldWindowOpen = window.open;
        delete window.open;

        window.open = jest.fn();
        // window.open.assign.mockReset();

        userEvent.click(screenButton);

        expect(window.open).toHaveBeenCalledTimes(1);
        expect(window.open).toHaveBeenCalledWith(socialButton.linkTo, undefined);

        // restore `window.open`
        window.open = oldWindowOpen;
    });
});

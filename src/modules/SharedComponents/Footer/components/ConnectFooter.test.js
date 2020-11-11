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

import { ConnectFooter } from './ConnectFooter';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        classes: {},
        history: testProps.history || { push: jest.fn() },
    };
    return getElement(ConnectFooter, props);
}

describe('Component Megamenu', () => {
    it('should render', () => {
        const wrapper = setup();
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });
});

import { default as locale } from './locale';

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

describe('Component MinimalFooter', () => {
    it('should render', () => {
        const wrapper = setup();
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('should have a valid locale', () => {
        // because the menu locale is meant to be maintained by the user, we check the file is valid
        function checkLocaleBlock(item) {
            item.type !== 'text' || expect(item.text.length).not.toBe(0);

            item.type !== 'link' || expect(item.dataTestid.length).not.toBe(0);
            item.type !== 'link' || expect(item.linkLabel.length).not.toBe(0);
            item.type !== 'link' || expect(item.linkTo.length).not.toBe(0);
            item.type !== 'link' ||
                !item.target ||
                expect(item.target).toEqual('_blank') ||
                expect(item.target).toEqual('_parent') ||
                expect(item.target).toEqual('_top');

            item.type !== 'abbr' || expect(item.abbrDisplay.length).not.toBe(0);
            item.type !== 'abbr' || expect(item.abbrMouseoverText.length).not.toBe(0);

            item.type !== 'header' || expect(item.text.length).not.toBe(0);
        }

        locale.minimalFooter.leftColumn.line1.forEach(item => {
            checkLocaleBlock(item);
        });
        locale.minimalFooter.leftColumn.line2.forEach(item => {
            checkLocaleBlock(item);
        });
        locale.minimalFooter.leftColumn.line3.forEach(item => {
            checkLocaleBlock(item);
        });

        locale.minimalFooter.rightColumn.line1.forEach(item => {
            checkLocaleBlock(item);
        });
        locale.minimalFooter.rightColumn.line2.forEach(item => {
            checkLocaleBlock(item);
        });

        locale.minimalFooter.bottomBlock.line1.forEach(item => {
            checkLocaleBlock(item);
        });
    });
});

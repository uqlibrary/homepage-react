import React from 'react';
import { rtlRender } from 'test-utils';
import { StandardCard } from './StandardCard';

function setup(testProps = {}) {
    const props = {
        title: 'card title',
        classes: {
            card: 'testClass',
        },
        ...testProps,
    };
    return rtlRender(<StandardCard {...props} />);
}

describe('Cards component', () => {
    it('renders with title and no help icon', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('renders with title and help button', () => {
        const { container } = setup({
            help: {
                title: 'help',
                text: 'help text',
                buttonLabel: 'OK',
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('renders with custom colours and full height', () => {
        const { container } = setup({
            customBackgroundColor: '#fcc',
            customTitleColor: '#111',
            customTitleBgColor: '#ccc',
            customTextColor: 'blue',
            fullHeight: true,
            noPadding: true,
            primaryHeader: true,
            classes: {
                cardHeaderPurple: 'purple',
                cardContentNoPadding: 'no-padding',
                cardHeaderPrimary: '#555',
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('renders with square top and accent header', () => {
        const { container } = setup({
            squareTop: true,
            accentHeader: true,
            classes: {
                cardHeaderAccent: '#333',
            },
        });

        expect(container).toMatchSnapshot();
    });

    it('renders with small title and as a subcard', () => {
        const { container } = setup({
            smallTitle: true,
            subCard: true,
        });
        expect(container).toMatchSnapshot();
    });

    it('renders given ID for standar card', () => {
        const { container } = setup({ standardCardId: 'test-card' });
        expect(container).toMatchSnapshot();
    });

    it('renders with header action', () => {
        const { container } = setup({ headerAction: jest.fn() });
        expect(container).toMatchSnapshot();
    });

    it('renders with custom content classname', () => {
        const { container } = setup({ contentProps: { className: 'customClass' } });
        expect(container).toMatchSnapshot();
    });
});

describe('StandardCard component', () => {
    it('should render StyledCard with same props', () => {
        const { container } = setup({ test1: 'test1value', test2: 'test2value' });
        expect(container).toMatchSnapshot();
    });
});

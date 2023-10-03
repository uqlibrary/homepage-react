import React from 'react';
import { HelpDrawer } from './HelpDrawer';
import HelpDrawerWithStyles from './HelpDrawer';
import { rtlRender } from '../../../../../../utils/test-utils';

function setup(testProps = {}) {
    const props = {
        classes: { paper: {} },
        theme: { palette: { white: { main: '#FFFFFF' } } },
        open: true,
        title: 'Test title',
        text: 'Test text',
        hide: jest.fn(),
        buttonLabel: 'Test OK',
        ...testProps,
    };
    return rtlRender(<HelpDrawer {...props} />);
}

describe('HelpDrawer tests', () => {
    it('renders menu', () => {
        const hdText = 'Integer mattis rutrum velit nec posuere. Quisque rhoncus quam elit.';
        const { getByText } = setup({
            title: 'HelpDrawer Title',
            text: hdText,
            open: true,
            buttonLabel: 'Close',
        });
        expect(getByText(hdText)).toBeInTheDocument();
        expect(getByText('HelpDrawer Title')).toBeInTheDocument();
    });

    it('renders text as react children', () => {
        const { getByText } = setup({
            title: 'HelpDrawer title',
            text: (
                <p>
                    <span>Test text</span>
                </p>
            ),
        });
        expect(getByText('Test text')).toBeInTheDocument();
    });

    it('renders text as react element', () => {
        const { container } = setup({
            title: 'HelpDrawer title',
            text: <span>Test text</span>,
        });
        expect(container).toMatchSnapshot();
    });

    it('should render with styles', () => {
        const { container } = setup(HelpDrawerWithStyles, {
            open: true,
            title: 'Test title',
            text: 'Test text',
            hide: jest.fn(),
        });
        expect(container).toMatchSnapshot();
    });
});

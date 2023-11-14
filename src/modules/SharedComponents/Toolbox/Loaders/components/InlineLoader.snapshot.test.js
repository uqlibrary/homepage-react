import React from 'react';
import { InlineLoader } from './InlineLoader';
import InlineLoaderWithStyles from './InlineLoader';
import { rtlRender } from '../../../../../../utils/test-utils';

function setup(testProps = {}) {
    const props = {
        classes: {},
        message: '',
        // theme: { palette: { accent: { main: 'blue' } } },
        ...testProps,
    };
    return rtlRender(<InlineLoader {...props} />);
}

describe('Component InlineLoader', () => {
    it('should render as expected', () => {
        const props = {
            message: 'InlineLoader Test',
            classes: {
                text: {
                    fontWeight: 200,
                    margin: '24px 0',
                },
            },
        };
        const { container } = setup({ ...props });
        expect(container).toMatchSnapshot();
    });

    it('should render with styles', () => {
        const props = {
            message: 'InlineLoader Styled Test',
        };
        const { container } = rtlRender(<InlineLoaderWithStyles {...props} />);
        expect(container).toMatchSnapshot();
    });
});

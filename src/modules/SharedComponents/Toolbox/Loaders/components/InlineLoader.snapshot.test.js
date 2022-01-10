import { InlineLoader } from './InlineLoader';
import InlineLoaderWithStyles from './InlineLoader';

function setup(testProps = {}) {
    const props = {
        classes: {},
        message: '',
        // theme: { palette: { accent: { main: 'blue' } } },
        ...testProps,
    };
    return getElement(InlineLoader, props);
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
        const wrapper = setup({ ...props });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with styles', () => {
        const wrapper = getElement(InlineLoaderWithStyles, {
            message: 'InlineLoader Styled Test',
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

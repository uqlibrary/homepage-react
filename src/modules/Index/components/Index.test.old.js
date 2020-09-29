import Index from './Index';

function setup(testProps = {}, args = { isShallow: false }) {
    const props = {
        ...testProps,
    };
    return getElement(Index, props, args);
}

describe('Index page', () => {
    it('should render placeholders', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

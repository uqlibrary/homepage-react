import React from 'react';
import { fireEvent, rtlRender } from 'test-utils';

import TrailImage from './TrailImage';

const defaultProps = {
    alt: 'Artwork detail',
    intrinsicHeight: 800,
    intrinsicWidth: 1200,
    src: 'https://example.com/artwork.jpg',
};

const setup = (props = {}) => rtlRender(<TrailImage {...defaultProps} {...props} />);

describe('TrailImage', () => {
    it('shows a skeleton until the image loads, then reveals the image and forwards onLoad', () => {
        const onLoad = jest.fn();
        const { container, getByAltText } = setup({ onLoad });

        const image = getByAltText(defaultProps.alt);

        expect(container.querySelector('.MuiSkeleton-root')).toBeInTheDocument();
        expect(image).toHaveStyle({ visibility: 'hidden', opacity: '0' });

        fireEvent.load(image);

        expect(onLoad).toHaveBeenCalledTimes(1);
        expect(container.querySelector('.MuiSkeleton-root')).not.toBeInTheDocument();
        expect(image).toHaveStyle({ visibility: 'visible', opacity: '1' });
    });

    it('passes the intrinsic dimensions and loading mode to the native image element', () => {
        const { getByAltText } = setup({ loading: 'lazy' });

        const image = getByAltText(defaultProps.alt);

        expect(image).toHaveAttribute('loading', 'lazy');
        expect(image).toHaveAttribute('width', String(defaultProps.intrinsicWidth));
        expect(image).toHaveAttribute('height', String(defaultProps.intrinsicHeight));
    });

    describe('coverage', () => {
        it('falls back to automatic sizing when intrinsic dimensions are invalid', () => {
            const { getByAltText } = setup({ intrinsicWidth: 'invalid', intrinsicHeight: 0 });

            const image = getByAltText(defaultProps.alt);
            const imageWrapper = image.parentElement;

            expect(image).not.toHaveAttribute('width');
            expect(image).not.toHaveAttribute('height');
            expect(imageWrapper).toHaveStyle({ height: 'auto' });
            expect(imageWrapper).not.toHaveStyle({
                aspectRatio: `${defaultProps.intrinsicWidth} / ${defaultProps.intrinsicHeight}`,
            });
        });
    });
});

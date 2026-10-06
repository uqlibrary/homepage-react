import React from 'react';

import { rtlRender, screen } from 'test-utils';

import { locale } from 'modules/Pages/Admin/BookableSpaces/bookablespaces.locale';
import { ImageSizeWarning } from './ImageSizeWarning';

describe('ImageSizeWarning', () => {
    const originalIdeal = { ...locale.form.upload.ideal };

    afterEach(() => {
        locale.form.upload.ideal = { ...originalIdeal };
    });

    it('shows a warning when dimensions are outside the preferred size range', () => {
        rtlRender(<ImageSizeWarning imgWidth={1000} imgHeight={700} />);

        expect(screen.getByText(/dimensions:/i)).toBeInTheDocument();
        expect(screen.getByText(/larger images will affect page load time/i)).toBeInTheDocument();
    });

    it('shows the OK message when the image dimensions are within range', () => {
        locale.form.upload.ideal = { width: 1800, height: 700, ratio: 2.57 };

        rtlRender(<ImageSizeWarning imgWidth={1800} imgHeight={700} />);

        expect(screen.getByText(/dimensions:/i)).toBeInTheDocument();
        expect(screen.queryByText(/larger images will affect page load time/i)).not.toBeInTheDocument();
    });
});

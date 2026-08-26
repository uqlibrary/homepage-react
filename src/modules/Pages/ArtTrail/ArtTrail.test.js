import React from 'react';
import { rtlRender, userEvent } from 'test-utils';

import ArtTrail from './ArtTrail';

const setup = (props = {}) => {
    return rtlRender(<ArtTrail {...props} />);
};

describe('ArtTrail', () => {
    it('renders the landing page', () => {
        const { getByRole } = setup();

        expect(
            getByRole('heading', {
                name: 'Welcome to the Indigenous Art and Library Discovery Trail at the University of Queensland Library.',
            }),
        ).toBeInTheDocument();
        expect(getByRole('button', { name: 'Launch Web App' })).toBeInTheDocument();
    });

    it.each(['/art-trail', '/art-trail/'])('launches the app from %s', async currentPath => {
        window.history.replaceState({}, '', currentPath);
        const open = jest.spyOn(window, 'open').mockImplementation(() => null);
        const { getByRole } = setup();

        await userEvent.click(getByRole('button', { name: 'Launch Web App' }));

        expect(open).toHaveBeenCalledWith(
            `${window.location.origin}/art-trail/app`,
            '_blank',
            `width=${screen.availWidth},height=${screen.availHeight},left=0,top=0,menubar=no,toolbar=no,location=no,status=no,noopener,noreferrer`,
        );

        open.mockRestore();
    });
});

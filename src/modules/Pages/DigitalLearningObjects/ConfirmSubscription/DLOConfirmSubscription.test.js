import React from 'react';
import { MemoryRouter, useParams } from 'react-router';
import { rtlRender, screen } from 'test-utils';
import { DLOConfirmSubscription } from './DLOConfirmSubscription';

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useParams: jest.fn(),
}));

jest.mock('modules/SharedComponents/Toolbox/StandardPage', () => ({
    // eslint-disable-next-line react/prop-types
    StandardPage: ({ children }) => <div>{children}</div>,
}));

jest.mock('modules/SharedComponents/Toolbox/StandardCard', () => ({
    // eslint-disable-next-line react/prop-types
    StandardCard: ({ children }) => <div>{children}</div>,
}));

jest.mock('modules/SharedComponents/Toolbox/Loaders', () => ({
    // eslint-disable-next-line react/prop-types
    InlineLoader: ({ message }) => <div data-testid="inline-loader">{message}</div>,
}));

jest.mock('modules/Pages/DigitalLearningObjects/dlorHelpers', () => ({
    getDlorViewPageUrl: uuid => `/digital-learning-hub/view/${uuid}`,
}));

const defaultProps = {
    actions: {
        loadDlorSubscriptionConfirmation: jest.fn(),
    },
    dlorItemUpdating: false,
    dlorUpdatedItemError: null,
    dlorUpdatedItem: null,
};

const renderPage = (props = {}, confirmationId = 'confirmation-123', withSiteHeader = false) => {
    useParams.mockReturnValue(confirmationId ? { confirmationId } : {});
    const actions = {
        ...defaultProps.actions,
        ...(props.actions || {}),
    };
    const siteHeader = withSiteHeader ? document.createElement('uq-site-header') : null;

    if (siteHeader) {
        document.body.appendChild(siteHeader);
    }

    rtlRender(
        <MemoryRouter>
            <DLOConfirmSubscription {...defaultProps} {...props} actions={actions} />
        </MemoryRouter>,
    );

    return { actions, siteHeader };
};

describe('DLOConfirmSubscription', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        document.querySelector('uq-site-header')?.remove();
    });

    it('loads the confirmation and updates the site header while loading', () => {
        const { actions, siteHeader } = renderPage({ dlorItemUpdating: true }, 'confirmation-123', true);

        expect(screen.getByTestId('inline-loader')).toHaveTextContent('Loading');
        expect(actions.loadDlorSubscriptionConfirmation).toHaveBeenCalledWith('confirmation-123');
        expect(siteHeader).toHaveAttribute('secondleveltitle');
        expect(siteHeader).toHaveAttribute('secondLevelUrl');
    });

    it('stays in the loading state when the update state is null and there is no confirmation id', () => {
        const { actions } = renderPage({ dlorItemUpdating: null }, null);

        expect(screen.getByTestId('inline-loader')).toBeInTheDocument();
        expect(actions.loadDlorSubscriptionConfirmation).not.toHaveBeenCalled();
    });

    it('shows an update error', () => {
        renderPage({ dlorUpdatedItemError: 'Unable to confirm request' });

        expect(screen.getByTestId('dlor-confirm-error')).toHaveTextContent('Unable to confirm request');
    });

    it('shows the confirmed response and links to the object', () => {
        renderPage({
            dlorUpdatedItem: {
                response: 'ok',
                object_title: 'Object title',
                object_public_uuid: 'object-123',
            },
        });

        expect(screen.getByTestId('dlor-confirm-line-2')).toHaveTextContent(
            'Your request has been confirmed. We will send an email when we update the object.',
        );
        expect(screen.getByRole('link', { name: 'Object title' })).toHaveAttribute(
            'href',
            '/digital-learning-hub/view/object-123',
        );
    });

    it('explains when the confirmation period has expired', () => {
        renderPage({
            dlorUpdatedItem: {
                response: 'expired',
                object_title: 'Object title',
                object_public_uuid: 'object-123',
            },
        });

        expect(screen.getByTestId('dlor-confirm-line-2')).toHaveTextContent(
            'Unfortunately, your confirmation period expired before you were able to visit this link.',
        );
        expect(screen.getByRole('link', { name: 'Object title' })).toHaveAttribute(
            'href',
            '/digital-learning-hub/view/object-123',
        );
    });

    it('explains when the notification request was already confirmed', () => {
        renderPage({
            dlorUpdatedItem: {
                response: 'used',
                object_title: 'Object title',
                object_public_uuid: 'object-123',
            },
        });

        expect(screen.getByTestId('dlor-confirm-line-2')).toHaveTextContent(
            'You have already confirmed this notification request.',
        );
        expect(screen.getByRole('link', { name: 'Object title' })).toHaveAttribute(
            'href',
            '/digital-learning-hub/view/object-123',
        );
    });

    it('shows the unexpected-response error for an unrecognized response', () => {
        renderPage({ dlorUpdatedItem: { response: 'unexpected' } });

        expect(screen.getByTestId('dlor-confirm-error')).toHaveTextContent(
            'Something seems to have gone wrong - please check your email and try again.',
        );
    });

    it('shows the missing-confirmation instructions for a missing response', () => {
        renderPage({ dlorUpdatedItem: { response: 'missing' } });

        expect(
            screen.getByText("Unfortunately, your confirmation code isn't one that is currently available."),
        ).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'our Digital learning hub' })).toHaveAttribute(
            'href',
            '/digital-learning-hub',
        );
    });
});

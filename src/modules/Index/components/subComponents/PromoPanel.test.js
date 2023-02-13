import React from 'react';
import PromoPanel, { reportToSentry } from './PromoPanel';
import { rtlRender } from '../../../../../utils/test-utils';
import * as Sentry from '@sentry/browser';

function setup(testProps = {}) {
    const props = {
        account: { id: 1 },
        useAPI: true,
        accountLoading: false,
        currentPromoPanel: {
            active_panel: {
                panel_title: 'unit test title',
                panel_content: 'unit test content',
            },
        },
        promoPanelActionError: null,
        promoPanelLoading: false,
    };
    return rtlRender(<PromoPanel {...props} {...testProps} />);
}

describe('Promo Panel display', () => {
    it('renders panel correctly when exists for logged out', () => {
        const { getByTestId, getByText, queryByTestId } = setup({ account: {} });
        expect(getByTestId('promo-panel-content')).toBeInTheDocument();
        expect(getByText('unit test title')).toBeInTheDocument();
        expect(getByText('unit test content')).toBeInTheDocument();
        expect(queryByTestId('panel-fallback-content')).not.toBeInTheDocument();
        // screen.debug(undefined, 10000);
    });
    it('renders panel correctly when exists for logged in', () => {
        const { getByTestId, getByText, queryByTestId } = setup();
        expect(getByTestId('promo-panel-content')).toBeInTheDocument();
        expect(getByText('unit test title')).toBeInTheDocument();
        expect(getByText('unit test content')).toBeInTheDocument();
        expect(queryByTestId('panel-fallback-content')).not.toBeInTheDocument();
        // screen.debug(undefined, 10000);
    });
    it('renders panel uses fallback when no panel exists for logged out', () => {
        const { getByTestId } = setup({ promoPanelActionError: 'test', account: {} });
        expect(getByTestId('panel-fallback-content')).toBeInTheDocument();
    });
    it('renders panel uses fallback when no panel exists for logged in', () => {
        const { getByTestId } = setup({ promoPanelActionError: 'test', account: { id: 1 } });
        expect(getByTestId('panel-fallback-content')).toBeInTheDocument();
    });

    it('Renders promopanel loader when account or panel is loading', () => {
        const { queryByTestId } = setup({ promoPanelLoading: true });
        expect(queryByTestId('panel-fallback-content')).not.toBeInTheDocument();
    });
    it('correctly fires an error to sentry if no error loaded', () => {
        const mockSentryScope = jest.spyOn(Sentry, 'withScope');
        reportToSentry([
            new Error('Promo Panel API failed to load panel.'),
            {
                extra: {
                    message: 'PromoPanel Action load error',
                    panelError: 'Error',
                },
            },
        ]);
        expect(mockSentryScope).toBeCalled();
        reportToSentry([new Error('Promo Panel API failed to load panel.')]);
        expect(mockSentryScope).toBeCalled();
    });
    it('renders panel uses fallback when set to not use API', () => {
        const { getByTestId } = setup({ useAPI: false });
        expect(getByTestId('panel-fallback-content')).toBeInTheDocument();
    });
    it('renders panel does NOT fallback when set to not use API', () => {
        const { queryByTestId } = setup({ useAPI: true });
        expect(queryByTestId('panel-fallback-content')).not.toBeInTheDocument();
    });
});

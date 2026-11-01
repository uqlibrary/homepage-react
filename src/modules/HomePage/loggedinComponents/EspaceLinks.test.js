import React from 'react';
import { rtlRender, WithRouter } from 'test-utils';

import {
    EspaceEditorialAppointments,
    EspaceLinks,
    EspaceNTROs,
    EspaceOrcid,
    EspacePossible,
    EspaceUpdateWorks,
} from './EspaceLinks';

const defaultProps = {
    author: { aut_orcid_id: '0000-0001' },
    possibleRecords: null,
    incompleteNTRORecords: null,
};

function setup(testProps = {}) {
    return rtlRender(
        <WithRouter>
            <EspaceLinks {...defaultProps} {...testProps} />
        </WithRouter>,
    );
}

function renderLink(link) {
    return rtlRender(<WithRouter>{link}</WithRouter>);
}

describe('EspaceLinks', () => {
    it('shows dashboard and update links without an attention list when nothing needs updating', () => {
        const { getByRole, queryByText } = setup();

        expect(getByRole('heading', { name: 'UQ eSpace' })).toBeInTheDocument();
        expect(getByRole('link', { name: 'UQ eSpace dashboard' })).toHaveAttribute(
            'href',
            'https://espace.library.uq.edu.au/dashboard',
        );
        expect(getByRole('link', { name: 'Update editorial appointments' })).toHaveAttribute(
            'href',
            'https://espace.library.uq.edu.au/editorial-appointments',
        );
        expect(getByRole('link', { name: 'Update UQ eSpace records' })).toHaveAttribute(
            'href',
            'https://espace.library.uq.edu.au/dashboard',
        );
        expect(queryByText('Update the following items:')).not.toBeInTheDocument();
    });

    it('shows the ORCID link when the author has no ORCID', () => {
        const { getByRole, queryByRole } = setup({ author: {} });

        expect(getByRole('link', { name: 'Link ORCiD account' })).toHaveAttribute(
            'href',
            'https://espace.library.uq.edu.au/author-identifiers/orcid/link',
        );
        expect(getByRole('link', { name: 'Link ORCiD account' })).toHaveAttribute('target', '_blank');
        expect(queryByRole('link', { name: /Claim/ })).not.toBeInTheDocument();
    });

    it('shows the singular claim link and hides the update link when records need claiming', () => {
        const { getByRole, queryByRole } = setup({ possibleRecords: { total: 1 } });

        expect(getByRole('link', { name: 'Claim 1 record' })).toHaveAttribute(
            'href',
            'https://espace.library.uq.edu.au/records/possible',
        );
        expect(queryByRole('link', { name: 'Update UQ eSpace records' })).not.toBeInTheDocument();
    });

    it('shows the singular NTRO link when incomplete records remain', () => {
        const { getByRole, queryByRole } = setup({ incompleteNTRORecords: { total: 1 } });

        expect(getByRole('link', { name: 'Complete 1 NTRO record' })).toHaveAttribute(
            'href',
            'https://espace.library.uq.edu.au/records/incomplete',
        );
        expect(queryByRole('link', { name: /Claim/ })).not.toBeInTheDocument();
    });

    it('shows all attention links with plural counts when every action is needed', () => {
        const { getByRole, queryByRole } = setup({
            author: {},
            possibleRecords: { total: 2 },
            incompleteNTRORecords: { total: 3 },
        });

        expect(getByRole('link', { name: 'Link ORCiD account' })).toBeInTheDocument();
        expect(getByRole('link', { name: 'Claim 2 records' })).toBeInTheDocument();
        expect(getByRole('link', { name: 'Complete 3 NTRO records' })).toBeInTheDocument();
        expect(queryByRole('link', { name: 'Update UQ eSpace records' })).not.toBeInTheDocument();
    });

    it.each([0, -1])('does not show action links for non-positive record totals (%i)', total => {
        const { getByRole, queryByRole, queryByText } = setup({
            possibleRecords: { total },
            incompleteNTRORecords: { total },
        });

        expect(getByRole('link', { name: 'Update UQ eSpace records' })).toBeInTheDocument();
        expect(queryByRole('link', { name: /Claim|Complete/ })).not.toBeInTheDocument();
        expect(queryByText('Update the following items:')).not.toBeInTheDocument();
    });

    describe('link components', () => {
        it('renders a claim link with the supplied record count', () => {
            const { getByRole } = renderLink(<EspacePossible recordCount={2} />);

            expect(getByRole('link', { name: 'Claim 2 records' })).toHaveAttribute(
                'href',
                'https://espace.library.uq.edu.au/records/possible',
            );
            expect(getByRole('link', { name: 'Claim 2 records' })).toHaveAttribute('target', '_blank');
        });

        it('renders the update works link', () => {
            const { getByRole } = renderLink(<EspaceUpdateWorks />);

            expect(getByRole('link', { name: 'Update UQ eSpace records' })).toHaveAttribute(
                'href',
                'https://espace.library.uq.edu.au/dashboard',
            );
        });

        it('renders the editorial appointments link', () => {
            const { getByRole } = renderLink(<EspaceEditorialAppointments />);

            expect(getByRole('link', { name: 'Update editorial appointments' })).toHaveAttribute(
                'href',
                'https://espace.library.uq.edu.au/editorial-appointments',
            );
        });

        it('renders the ORCID link with its analytics identifier', () => {
            const { getByRole } = renderLink(<EspaceOrcid />);

            expect(getByRole('link', { name: 'Link ORCiD account' })).toHaveAttribute(
                'href',
                'https://espace.library.uq.edu.au/author-identifiers/orcid/link',
            );
            expect(getByRole('link', { name: 'Link ORCiD account' })).toHaveAttribute(
                'data-analyticsid',
                'pp-espace-orcid-tooltip',
            );
        });

        it('renders an incomplete NTRO link with the supplied record count', () => {
            const { getByRole } = renderLink(<EspaceNTROs recordCount={2} />);

            expect(getByRole('link', { name: 'Complete 2 NTRO records' })).toHaveAttribute(
                'href',
                'https://espace.library.uq.edu.au/records/incomplete',
            );
            expect(getByRole('link', { name: 'Complete 2 NTRO records' })).toHaveAttribute(
                'data-analyticsid',
                'pp-espace-ntro-tooltip',
            );
        });
    });
});

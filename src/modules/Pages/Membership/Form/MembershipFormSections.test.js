import React from 'react';
import { renderHook } from '@testing-library/react';
import { rtlRender, screen } from 'test-utils';

import { useForm } from 'modules/SharedComponents/Toolbox/ReactHookForm';
import MembershipFormSections, {
    MembershipFormRow,
    getVisibleSections,
    visibleFieldsInRow,
    visibleRowsInSection,
} from './MembershipFormSections';

const renderWithControl = ui => {
    const { result } = renderHook(() => useForm());
    return rtlRender(React.cloneElement(ui, { control: result.current.control }));
};

describe('MembershipFormSections', () => {
    it('renders the account and contact sections with their legends', () => {
        renderWithControl(<MembershipFormSections type="community" formData={{ titles: ['Mr'] }} current={{}} />);

        expect(screen.getByTestId('membership-form-section-account')).toBeInTheDocument();
        expect(screen.getByTestId('membership-form-section-contact')).toBeInTheDocument();
        expect(screen.getByTestId('membership-form-group-your-name')).toBeInTheDocument();
        expect(screen.getByTestId('membership-form-group-home-address')).toBeInTheDocument();
    });

    it('titles the account section for the nominated borrower on a proxy application', () => {
        renderWithControl(<MembershipFormSections type="proxy" formData={{ titles: ['Mr'] }} current={{}} />);

        expect(screen.getByTestId('membership-form-section-account')).toHaveTextContent('Nominated borrower details');
        expect(screen.getByTestId('membership-form-section-nominated')).toBeInTheDocument();
        expect(screen.getByTestId('membership-form-section-authorising')).toBeInTheDocument();
    });

    it('shows the UQ student section for an alumni application but not for community', () => {
        renderWithControl(<MembershipFormSections type="alumni" formData={{ titles: ['Mr'] }} current={{}} />);
        expect(screen.getByTestId('membership-form-section-student')).toBeInTheDocument();
    });

    it('renders a plain row without a legend fieldset', () => {
        renderWithControl(<MembershipFormRow row={{ fields: ['mail'] }} type="community" formData={{}} current={{}} />);
        expect(screen.getByTestId('mail-input')).toBeInTheDocument();
    });

    it('gives a captioned-row field with no width of its own an equal share', () => {
        // mail carries no gridSm, so under a legend it falls back to an equal share of the row.
        renderWithControl(
            <MembershipFormRow
                row={{ legend: 'Contact', fields: ['mail'] }}
                type="community"
                formData={{}}
                current={{}}
            />,
        );
        expect(screen.getByTestId('mail-input')).toBeInTheDocument();
    });

    it('renders nothing for a row whose fields the type never asks for', () => {
        const { container } = renderWithControl(
            <MembershipFormRow row={{ fields: ['not_a_field'] }} type="community" formData={{}} current={{}} />,
        );
        expect(container).toBeEmptyDOMElement();
    });

    describe('selectors', () => {
        it('lists only the fields a row shows for the type', () => {
            expect(visibleFieldsInRow({ fields: ['title', 'not_a_field'] }, 'community')).toEqual(['title']);
        });

        it('drops rows that have nothing to show', () => {
            const section = { rows: [{ fields: ['title'] }, { fields: ['not_a_field'] }] };
            expect(visibleRowsInSection(section, 'community')).toHaveLength(1);
        });

        it('lists the sections the type sees', () => {
            expect(getVisibleSections('community').map(section => section.id)).toEqual(['account', 'contact']);
        });

        it('includes a type-specific section only for the types that declare it', () => {
            expect(getVisibleSections('alumni').map(section => section.id)).toContain('student');
            expect(getVisibleSections('community').map(section => section.id)).not.toContain('student');
        });
    });
});

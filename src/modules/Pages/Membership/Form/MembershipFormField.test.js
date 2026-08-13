import React from 'react';
import { renderHook } from '@testing-library/react';
import { rtlRender, screen } from 'test-utils';

import { useForm } from 'modules/SharedComponents/Toolbox/ReactHookForm';
import MembershipFormField from './MembershipFormField';

const setup = props => {
    const { result } = renderHook(() => useForm());

    return rtlRender(
        <MembershipFormField
            control={result.current.control}
            formData={{ titles: ['Mr', 'Ms'] }}
            current={{}}
            {...props}
        />,
    );
};

describe('MembershipFormField', () => {
    it('draws a text field for a field the type asks for', () => {
        setup({ field: 'first_name', type: 'community' });
        expect(screen.getByRole('textbox', { name: 'First name and other initials' })).toBeInTheDocument();
    });

    it('draws an email field where the config asks for one', () => {
        setup({ field: 'mail', type: 'community' });
        expect(screen.getByTestId('mail-input')).toHaveAttribute('type', 'email');
    });

    it('draws a select with its options', () => {
        setup({ field: 'title', type: 'community' });
        expect(screen.getByRole('combobox', { name: 'Title' })).toBeInTheDocument();
    });

    it('marks a required field whose label is hidden with an asterisk in its placeholder', () => {
        setup({ field: 'first_name', type: 'community', hideLabel: true });
        expect(screen.getByTestId('first_name-input')).toHaveAttribute(
            'placeholder',
            'First name and other initials *',
        );
    });

    it('does not add an asterisk to an optional field whose label is hidden', () => {
        setup({ field: 'home_address_1', type: 'community', hideLabel: true });
        expect(screen.getByTestId('home_address_1-input')).toHaveAttribute('placeholder', 'Suburb e.g. St Lucia');
    });

    it('draws nothing for a field that has no presentation at all', () => {
        const { container } = setup({ field: 'not_a_field', type: 'community' });
        expect(container).toBeEmptyDOMElement();
    });

    it('draws nothing for a field this type does not ask for', () => {
        const { container } = setup({ field: 'title', type: 'notcommunity' });
        expect(container).toBeEmptyDOMElement();
    });
});

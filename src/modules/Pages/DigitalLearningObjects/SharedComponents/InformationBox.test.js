import React from 'react';
import { render, screen } from '@testing-library/react';
import InformationBox from './InformationBox';

describe('InformationBox', () => {
    const defaultProps = {
        prompt: 'This is a prompt',
        identifier: 'info-box',
        linkUrl: 'https://example.com',
        linkText: 'Example Link',
    };

    it('renders the prompt text', () => {
        render(<InformationBox {...defaultProps} />);
        expect(screen.getByText('This is a prompt')).toBeTruthy();
    });

    it('renders the box with a default prompt text', () => {
        const testProps = {
            identifier: 'info-box',
            linkUrl: 'https://example.com',
            linkText: 'Example Link',
        }
        render(<InformationBox {...testProps} />);
        expect(screen.getByText('No help is available')).toBeTruthy();
    });

    it('renders the link with the correct URL and text', () => {
        render(<InformationBox {...defaultProps} />);
        const link = screen.getByRole('link', { name: 'Example Link' });
        expect(link).toBeTruthy();
        expect(link.getAttribute('href')).toBe('https://example.com');
    });

    it('does not render the link if linkUrl and linkText are not provided', () => {
        const { container } = render(<InformationBox prompt="No link" identifier="no-link" />);
        expect(container.querySelector('a')).toBeNull();
    });

    it('renders with the correct identifier', () => {
        render(<InformationBox {...defaultProps} />);
        expect(screen.getByTestId('dlor-info-box-helper')).toBeTruthy();
    });
    it('renders the box with a default identifier', () => {
        const testProps = {
            linkUrl: 'https://example.com',
            linkText: 'Example Link',
        }
        render(<InformationBox {...testProps} />);
        expect(screen.getByTestId('dlor-default-helper')).toBeTruthy();
    });
});
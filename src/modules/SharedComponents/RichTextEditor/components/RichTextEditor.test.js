import React from 'react';
import { rtlRender } from 'test-utils';
import RichTextEditor from './RichTextEditor';

let mockEditorHtml = '<p>edited</p>';

jest.mock('mui-tiptap', () => {
    const react = require('react');

    return {
        RichTextEditor: ({ renderControls, children, onUpdate, id, 'data-testid': dataTestId, editorProps }) => {
            react.useEffect(() => {
                onUpdate?.({ editor: { getHTML: () => mockEditorHtml } });
            }, [onUpdate]);

            const attributes = {
                ...(editorProps?.attributes || {}),
                ...(id ? { id } : {}),
                ...(dataTestId ? { 'data-testid': dataTestId } : {}),
            };

            return react.createElement(
                'div',
                attributes,
                renderControls?.(),
                typeof children === 'function' ? children() : children,
            );
        },
        LinkBubbleMenu: () => react.createElement('div', { 'data-testid': 'mock-link-bubble-menu' }),
    };
});

jest.mock('./RichTextToolbar', () => () => <div data-testid="mock-rich-text-toolbar" />);
jest.mock('./extensions', () => ({ createExtensions: () => [] }));

const setup = (props = {}) => rtlRender(<RichTextEditor onChange={jest.fn()} {...props} />);

describe('RichTextEditor', () => {
    it('renders and forwards editor updates through onChange', () => {
        mockEditorHtml = '<p>edited</p>';
        const onChange = jest.fn();
        const { getByTestId, getByRole } = setup({ onChange });

        expect(getByRole('textbox')).toBeInTheDocument();
        expect(getByTestId('mock-rich-text-toolbar')).toBeInTheDocument();
        expect(getByTestId('mock-link-bubble-menu')).toBeInTheDocument();
        expect(onChange).toHaveBeenCalledWith('<p>edited</p>');
    });

    it('normalizes blank editor content and non-string values to empty strings before callback', () => {
        const values = [undefined, null, '<p></p>', '<p><br></p>', '<p><br/></p>'];

        values.forEach(value => {
            mockEditorHtml = value;
            const onChange = jest.fn();
            setup({ onChange });

            expect(onChange).toHaveBeenLastCalledWith('');
        });
    });

    it('omits the id and data-testid attributes when neither prop is supplied', () => {
        mockEditorHtml = '<p>hi</p>';
        const { getByRole } = setup();

        expect(getByRole('textbox')).toBeInTheDocument();
        expect(getByRole('textbox')).not.toHaveAttribute('id');
        expect(getByRole('textbox')).not.toHaveAttribute('data-testid');
    });

    it('passes through the id, testId, and ariaLabel attributes when supplied', () => {
        mockEditorHtml = '<p>hello</p>';
        const onChange = jest.fn();
        const { getByRole } = setup({
            id: 'notes-editor',
            testId: 'notes-editor',
            ariaLabel: 'Notes editor',
            onChange,
        });

        expect(getByRole('textbox')).toHaveAttribute('id', 'notes-editor');
        expect(getByRole('textbox')).toHaveAttribute('data-testid', 'notes-editor');
        expect(getByRole('textbox')).toHaveAttribute('aria-label', 'Notes editor');
        expect(onChange).toHaveBeenCalledWith('<p>hello</p>');
    });
});

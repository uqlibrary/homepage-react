import React from 'react';
import { rtlRender } from 'test-utils';
import RichTextEditor from './RichTextEditor';

// mui-tiptap renders a ProseMirror editor that needs browser APIs jsdom lacks, so stand it in
// with a lightweight double. The double invokes the render props and update callback it is given
// so their code paths are exercised here rather than only in the browser e2e run.
jest.mock('mui-tiptap', () => {
    const react = require('react');
    return {
        RichTextEditor: ({ renderControls, children, onUpdate }) => {
            react.useEffect(() => {
                onUpdate?.({ editor: { getHTML: () => '<p>edited</p>' } });
            }, [onUpdate]);
            return react.createElement(
                'div',
                { 'data-testid': 'mock-rich-text-editor' },
                renderControls?.(),
                typeof children === 'function' ? children() : children,
            );
        },
        LinkBubbleMenu: () => react.createElement('div', { 'data-testid': 'mock-link-bubble-menu' }),
    };
});

// The toolbar and extensions pull their pieces from mui-tiptap's editor context, which the mock
// above does not provide; they have their own coverage, so stub them out of this component's test.
jest.mock('./RichTextToolbar', () => () => <div data-testid="mock-rich-text-toolbar" />);
jest.mock('./extensions', () => ({ createExtensions: () => [] }));

const setup = (props = {}) => rtlRender(<RichTextEditor onChange={jest.fn()} {...props} />);

describe('RichTextEditor', () => {
    it('renders and forwards editor updates through onChange', () => {
        const onChange = jest.fn();
        const { getByTestId } = setup({ onChange });

        expect(getByTestId('mock-rich-text-editor')).toBeInTheDocument();
        expect(getByTestId('mock-rich-text-toolbar')).toBeInTheDocument();
        expect(getByTestId('mock-link-bubble-menu')).toBeInTheDocument();
        expect(onChange).toHaveBeenCalledWith('<p>edited</p>');
    });

    it('omits the id and data-testid attributes when neither prop is supplied', () => {
        const { getByTestId } = setup();

        expect(getByTestId('mock-rich-text-editor')).toBeInTheDocument();
    });

    it('passes through the id and testId attributes when supplied', () => {
        const { getByTestId } = setup({ id: 'notes-editor', testId: 'notes-editor', value: '<p>hi</p>' });

        expect(getByTestId('mock-rich-text-editor')).toBeInTheDocument();
    });
});

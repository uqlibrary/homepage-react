import React from 'react';
import PropTypes from 'prop-types';
import { RichTextEditor as MuiRichTextEditor } from 'mui-tiptap';
import RichTextToolbar from './RichTextToolbar';
import { createExtensions } from './extensions';
import { LinkBubbleMenu } from 'mui-tiptap';

const editorStyles = {
    '& .MuiTiptap-RichTextField-content': {
        '& .ProseMirror': {
            height: '200px',

            '& h2': {
                fontSize: '1.5em',
            },

            '& h3': {
                fontSize: '1.17em',
            },

            '& a:not([data-type="mention"])': {
                color: '#3872a8',
                textDecoration: 'none',

                '&:hover': {
                    textDecoration: 'underline',
                },
            },
        },
    },
};

const normalizeEditorHtml = htmlValue => {
    if (typeof htmlValue !== 'string') {
        return '';
    }

    const normalizedValue = htmlValue.replace(/\s/g, '');
    if (normalizedValue === '<p></p>' || normalizedValue === '<p><br></p>' || normalizedValue === '<p><br/></p>') {
        return '';
    }

    return htmlValue;
};

const RichTextEditor = ({ id, value, onChange, testId, ariaLabel }) => {
    return (
        <MuiRichTextEditor
            id={id}
            data-testid={testId}
            content={value}
            editable
            extensions={createExtensions()}
            renderControls={() => <RichTextToolbar />}
            onUpdate={({ editor }) => {
                onChange(normalizeEditorHtml(editor.getHTML()));
            }}
            sx={editorStyles}
            editorProps={{
                attributes: {
                    ...(id ? { id } : {}),
                    ...(testId ? { 'data-testid': testId } : {}),
                    role: 'textbox',
                    'aria-multiline': 'true',
                    ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
                },
            }}
        >
            {() => (
                <>
                    <LinkBubbleMenu />
                </>
            )}
        </MuiRichTextEditor>
    );
};

RichTextEditor.propTypes = {
    id: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    testId: PropTypes.string,
    ariaLabel: PropTypes.string,
};

export default RichTextEditor;

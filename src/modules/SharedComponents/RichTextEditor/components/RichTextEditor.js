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

const RichTextEditor = ({ id, value, onChange, testId }) => {
    return (
        <MuiRichTextEditor
            id={id}
            data-testid={testId}
            content={value}
            editable
            extensions={createExtensions()}
            renderControls={() => <RichTextToolbar />}
            onUpdate={({ editor }) => {
                onChange(editor.getHTML());
            }}
            sx={editorStyles}
            editorProps={{
                attributes: {
                    ...(id ? { id } : {}),
                    ...(testId ? { 'data-testid': testId } : {}),
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
};

export default RichTextEditor;

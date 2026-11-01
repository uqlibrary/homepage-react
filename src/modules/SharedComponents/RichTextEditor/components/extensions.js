import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Heading from '@tiptap/extension-heading';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import { ListItem, OrderedList, BulletList } from '@tiptap/extension-list';
import History from '@tiptap/extension-history';
import Link from '@tiptap/extension-link';
import { LinkBubbleMenuHandler } from 'mui-tiptap';

const CustomLinkExtension = Link.extend({
    inclusive: false,
});

export const createExtensions = () => {
    return [
        Document,
        Paragraph,
        Text,

        Heading.configure({
            levels: [2, 3],
        }),

        Bold,
        Italic,

        BulletList,
        OrderedList,
        ListItem,

        History,

        CustomLinkExtension.configure({
            openOnClick: false,
        }),

        LinkBubbleMenuHandler,
    ];
};

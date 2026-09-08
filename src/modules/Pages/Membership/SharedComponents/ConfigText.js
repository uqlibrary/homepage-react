import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { visuallyHidden } from '@mui/utils';

/**
 * Renders a piece of text from the membership form config, which may contain links.
 *
 * The config's descriptions, conditions, upload instructions and agreements are prose written by Library staff
 * and served by the API. The only markup any of them carries is anchors - `<a href>`, some of them `mailto:`,
 * some `target="_blank"`.
 *
 * This does not trust the string as HTML. It parses the string and rebuilds it out of React elements, emitting
 * only text and anchors. No raw HTML reaches the DOM, so there is nothing for injected markup to be injected
 * into - a tag that is not on the allowlist has its words kept and the tag itself dropped.
 *
 * Parsing happens in a detached document, which does not fetch, run scripts, or run event handlers.
 */

// Anything that can navigate somewhere inert. Notably absent: `javascript:` and `data:`.
export const ALLOWED_SCHEMES = ['https:', 'http:', 'mailto:'];

export const NEW_WINDOW_WARNING = ' (opens in a new window)';

/**
 * Whether a link may be rendered as a link. Resolved against the current origin so a relative href is judged on
 * the scheme it would actually navigate to.
 */
export const isSafeHref = href => {
    if (!href) {
        return false;
    }
    try {
        return ALLOWED_SCHEMES.includes(new URL(href, window.location.origin).protocol);
    } catch {
        // Not a URL at all, so it cannot be a safe one.
        return false;
    }
};

function nodeToReact(node, key) {
    if (node.nodeType === Node.TEXT_NODE) {
        return node.nodeValue;
    }

    // Comments, processing instructions and the like carry nothing worth rendering.
    if (node.nodeType !== Node.ELEMENT_NODE) {
        return null;
    }

    const children = Array.from(node.childNodes).map((child, index) => nodeToReact(child, index));

    if (node.tagName.toLowerCase() !== 'a') {
        // Not on the allowlist: keep what it said, lose the tag. A <script> contributes its text and nothing
        // more, because its contents are only ever a text node to us.
        return children;
    }

    const href = node.getAttribute('href');
    if (!isSafeHref(href)) {
        return children;
    }

    // `target` and `href` are the only attributes carried over; everything else the config might have written
    // (event handlers included) is simply never read.
    const opensNewWindow = node.getAttribute('target') === '_blank';

    return (
        <a
            key={key}
            href={href}
            // Without this, a page we opened can rewrite the page it was opened from.
            {...(opensNewWindow ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
            {children}
            {/* Warn before the link is followed, not after it has moved someone somewhere new (WCAG 3.2.5). */}
            {!!opensNewWindow && (
                <Box component="span" sx={visuallyHidden}>
                    {NEW_WINDOW_WARNING}
                </Box>
            )}
        </a>
    );
}

const childNodesToReact = node => Array.from(node.childNodes).map((child, index) => nodeToReact(child, index));

export const ConfigText = ({ text, component = 'span', ...props }) => {
    if (!text) {
        return null;
    }

    const parsed = new DOMParser().parseFromString(String(text), 'text/html');

    return (
        <Box {...props} component={component}>
            {childNodesToReact(parsed.body)}
        </Box>
    );
};

ConfigText.propTypes = {
    text: PropTypes.string,
    component: PropTypes.string,
};

export default ConfigText;

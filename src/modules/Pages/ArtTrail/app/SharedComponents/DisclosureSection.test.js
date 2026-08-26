import React from 'react';
import Typography from '@mui/material/Typography';
import { rtlRender, userEvent } from 'test-utils';

import DisclosureSection from './DisclosureSection';

const summaryText =
    "This work was created by senior men from the Men's Painting Room and celebrates their memories of Country.";
const detailsText = 'For Anangu communities, the tree is a significant motif for ancestry and family.';
const extraDetailsText =
    'Through this shared storytelling, Punu Tjukurpa creates a conduit between roots and future generations.';

const setup = (props = {}) =>
    rtlRender(
        <DisclosureSection
            heading={
                <Typography variant="h6" component="h3">
                    About the artwork
                </Typography>
            }
            summary={<p>{summaryText}</p>}
            details={
                <>
                    <p>{detailsText}</p>
                    <p>{extraDetailsText}</p>
                </>
            }
            {...props}
        />,
    );

describe('DisclosureSection', () => {
    it('renders collapsed initially and expands the details when view more is clicked', async () => {
        const { getByRole, getByText, queryByText } = setup();

        const expandButton = getByRole('button', { name: 'View more' });
        const expandedContentId = expandButton.getAttribute('aria-controls');

        expect(getByText('About the artwork')).toBeInTheDocument();
        expect(getByText(summaryText)).toBeInTheDocument();
        expect(queryByText(detailsText)).not.toBeInTheDocument();
        expect(expandButton).toHaveAttribute('aria-expanded', 'false');
        expect(expandedContentId).toBeTruthy();

        await userEvent.click(expandButton);

        const collapseButton = getByRole('button', { name: 'View less' });

        expect(getByText(detailsText)).toBeInTheDocument();
        expect(getByText(extraDetailsText)).toBeInTheDocument();
        expect(collapseButton).toHaveAttribute('aria-expanded', 'true');
        expect(collapseButton).toHaveAttribute('aria-controls', expandedContentId);
        expect(document.getElementById(expandedContentId)).toContainElement(getByText(detailsText));
    });

    it('collapses the details again when view less is clicked', async () => {
        const { getByRole, queryByText } = setup();

        await userEvent.click(getByRole('button', { name: 'View more' }));
        await userEvent.click(getByRole('button', { name: 'View less' }));

        expect(queryByText(detailsText)).not.toBeInTheDocument();
        expect(getByRole('button', { name: 'View more' })).toBeInTheDocument();
    });
});

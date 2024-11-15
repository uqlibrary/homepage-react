import React from 'react';
import PropTypes from 'prop-types';
import { canSeeEndnoteReferencing } from 'helpers/access';

import Grid from '@mui/material/Grid';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

export const ReferencingPanel = ({ account }) => {
    const referencingPanel = [
        {
            id: 'style',
            title: 'Referencing style guides',
            url: 'https://guides.library.uq.edu.au/referencing',
            description: 'APA, Chicago, Vancouver and more',
            uqOnly: false, // only "UQ users", this is mostly to exclude EM users
        },
        {
            id: 'endnote',
            title: 'Endnote referencing software',
            url: 'https://web.library.uq.edu.au/research-tools-techniques/endnote-referencing-software',
            description: 'Download and support',
            uqOnly: true,
        },
    ];
    return (
        <StandardCard
            subCard
            noPadding
            // fullHeight
            primaryHeader
            standardCardId="referencing-homepage-panel"
            title="Referencing"
        >
            <Grid container>
                <Grid item xs={12} style={{ margin: '0 24px 0' }}>
                    {referencingPanel.map((item, index) =>
                        !item.uqOnly || (item.uqOnly && canSeeEndnoteReferencing(account)) ? (
                            <p key={index}>
                                <a href={`${item.url}`} data-testid={`referencing-${item.id}`}>{`${item.title}`}</a>
                                <br />
                                {`${item.description}`}
                            </p>
                        ) : null,
                    )}
                </Grid>
            </Grid>
        </StandardCard>
    );
};

ReferencingPanel.propTypes = {
    account: PropTypes.object,
};

export default ReferencingPanel;

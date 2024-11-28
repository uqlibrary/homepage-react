import React from 'react';
import PropTypes from 'prop-types';
import { canSeeEndnoteReferencing } from 'helpers/access';

import Grid from '@mui/material/Grid';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { linkToDrupal } from 'helpers/general';

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
            url: linkToDrupal('/research-tools-techniques/endnote-referencing-software'),
            description: 'Download and support',
            uqOnly: true,
        },
    ];
    return (
        <StandardCard subCard noPadding primaryHeader standardCardId="referencing-homepage-panel" title="Referencing">
            <Grid container padding={3} spacing={2} style={{ paddingBlock: '16px' }}>
                <Grid item xs={12}>
                    <a href={'https://guides.library.uq.edu.au/referencing'} data-testid={'referencing-style'}>
                        Referencing style guides
                    </a>
                    <div>APA, Chicago, Vancouver and more</div>
                </Grid>
                {canSeeEndnoteReferencing(account) && (
                    <Grid item xs={12}>
                        <a
                            href={linkToDrupal('/research-tools-techniques/endnote-referencing-software')}
                            data-testid={'referencing-endnote'}
                        >
                            Endnote referencing software
                        </a>
                        <div>Download and support</div>
                    </Grid>
                )}
            </Grid>
        </StandardCard>
    );
};

ReferencingPanel.propTypes = {
    account: PropTypes.object,
};

export default ReferencingPanel;

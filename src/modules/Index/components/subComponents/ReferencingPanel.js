import React from 'react';
import PropTypes from 'prop-types';
import { isUQUser } from 'helpers/access';

import Grid from '@mui/material/Grid';

import { default as locale } from './locale/subComponents.locale';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

export const ReferencingPanel = ({ account }) => {
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
                {locale.referencingPanel.items.map((item, index) =>
                    !item.uqOnly || (item.uqOnly && isUQUser(account)) ? (
                        <Grid
                            item
                            uqDsMobile={12}
                            key={index}
                            className="reference-panel-item"
                            style={{ margin: '0 24px 0' }}
                        >
                            <p>
                                <a href={`${item.url}`}>{`${item.title}`}</a>
                                <br />
                                {`${item.description}`}
                            </p>
                        </Grid>
                    ) : null,
                )}
            </Grid>
        </StandardCard>
    );
};

ReferencingPanel.propTypes = {
    account: PropTypes.object,
};

export default ReferencingPanel;

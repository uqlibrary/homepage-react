import React from 'react';
import { PropTypes } from 'prop-types';

import { getUserServices } from 'helpers/access';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import Grid from '@mui/material/Grid';

const LibraryServices = ({ account }) => {
    return (
        <StandardCard primaryHeader fullHeight squareTop={false} title="Library services">
            <Grid container spacing={1} data-testid="library-services-items" style={{ marginBottom: -8 }}>
                {getUserServices(account).map((item, index) => {
                    return (
                        <Grid item xs={12} sm={12} key={index}>
                            <a href={item.url}>{item.title}</a>
                        </Grid>
                    );
                })}
            </Grid>
        </StandardCard>
    );
};

LibraryServices.propTypes = {
    account: PropTypes.object,
};

export default LibraryServices;

import React from 'react';
import { PropTypes } from 'prop-types';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Grid from '@material-ui/core/Grid';
import { getUserServices } from 'helpers/access';

const LibraryServices = ({ account }) => {
    return (
        <StandardCard
            primaryHeader
            fullHeight
            squareTop={false}
            title={
                <Grid container>
                    <Grid item xs>
                        Library services
                    </Grid>
                </Grid>
            }
        >
            <Grid container spacing={1}>
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

LibraryServices.defaultProps = {};

export default LibraryServices;
